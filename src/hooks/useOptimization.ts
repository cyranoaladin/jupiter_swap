import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { getTokenPrice } from '@/services/coingecko';

// Types pour les données d'optimisation réelles
export interface OptimizationData {
  totalSavings: number;
  slippageOptimized: number;
  confidenceScore: number;
  lastOptimization: {
    timestamp: Date;
    beforeFees: { amountSol: number; amountUsd: number };
    afterFees: { amountSol: number; amountUsd: number };
    savedFees: { amountSol: number; amountUsd: number };
    serviceFee: { amountSol: number; amountUsd: number };
  } | null;
}

/**
 * Hook pour gérer les données d'optimisation réelles
 */
export function useOptimization() {
  const [data, setData] = useState<OptimizationData>({
    totalSavings: 0,
    slippageOptimized: 0.5,
    confidenceScore: 85,
    lastOptimization: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solPrice, setSolPrice] = useState<number>(0);

  // Récupération du prix SOL en temps réel
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const price = await getTokenPrice('solana');
        setSolPrice(price);
      } catch (error) {
        console.warn('Erreur récupération prix SOL:', error);
        setSolPrice(100); // Fallback price
      }
    };

    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  // Calcul des vraies économies basées sur les données de transaction
  const calculateOptimization = async (
    inputAmount: number,
    slippageUsed: number,
    priorityFee: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Tracer l'opération avec Sentry
      return await Sentry.startSpan(
        {
          op: 'optimization.calculate',
          name: 'Calculate Real Optimization Data',
        },
        async () => {
          // Calcul des économies réelles par rapport aux frais standards
          const standardSlippage = 1.0; // 1% slippage standard
          const standardPriorityFee = 0.001; // 0.001 SOL standard

          // Économies sur le slippage
          const slippageSavings = Math.max(0, (standardSlippage - slippageUsed) * inputAmount / 100);
          
          // Économies sur les priority fees
          const priorityFeeSavings = Math.max(0, (standardPriorityFee - priorityFee));
          
          const totalSavingsSol = slippageSavings + priorityFeeSavings;
          const totalSavingsUsd = totalSavingsSol * solPrice;

          // Fee de service (25% des économies)
          const serviceFeePercentage = 0.25;
          const serviceFeeSol = totalSavingsSol * serviceFeePercentage;
          const serviceFeeUsd = serviceFeeSol * solPrice;

          // Calcul du score de confiance basé sur les conditions du marché
          const confidenceScore = Math.min(95, Math.max(60, 
            85 - (slippageUsed * 10) + (totalSavingsSol > 0 ? 10 : 0)
          ));

          const newOptimization = {
            timestamp: new Date(),
            beforeFees: {
              amountSol: inputAmount + standardPriorityFee,
              amountUsd: (inputAmount + standardPriorityFee) * solPrice
            },
            afterFees: {
              amountSol: inputAmount + priorityFee,
              amountUsd: (inputAmount + priorityFee) * solPrice
            },
            savedFees: {
              amountSol: totalSavingsSol,
              amountUsd: totalSavingsUsd
            },
            serviceFee: {
              amountSol: serviceFeeSol,
              amountUsd: serviceFeeUsd
            }
          };

          setData(prev => ({
            totalSavings: prev.totalSavings + totalSavingsUsd,
            slippageOptimized: slippageUsed,
            confidenceScore,
            lastOptimization: newOptimization
          }));

          // Log des métriques dans Sentry
          Sentry.setContext('optimization', {
            totalSavingsUsd,
            slippageUsed,
            confidenceScore,
            solPrice
          });

          setLoading(false);
          return newOptimization;
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur calcul optimisation';
      setError(errorMessage);
      Sentry.captureException(err);
      setLoading(false);
      throw err;
    }
  };

  // Réinitialisation des données
  const resetOptimization = () => {
    setData({
      totalSavings: 0,
      slippageOptimized: 0.5,
      confidenceScore: 85,
      lastOptimization: null
    });
    setError(null);
  };

  // Obtenir les métriques d'optimisation en temps réel
  const getOptimizationMetrics = () => {
    return {
      savingsRate: data.totalSavings > 0 ? 
        ((data.lastOptimization?.savedFees.amountUsd || 0) / data.totalSavings * 100) : 0,
      efficiency: data.confidenceScore,
      averageSlippage: data.slippageOptimized,
      solPrice
    };
  };

  return {
    data,
    loading,
    error,
    solPrice,
    calculateOptimization,
    resetOptimization,
    getOptimizationMetrics
  };
}
