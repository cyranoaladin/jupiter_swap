/**
 * Hook useSwap pour la gestion des opérations de swap
 * 
 * Ce hook fournit une interface simple pour les composants React
 * pour interagir avec les services de swap Jupiter.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react';

import * as Sentry from '@sentry/nextjs';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  getSwapService, 
  type SwapParams, 
  type SwapResult,
  type SwapStage 
} from '@/services/swap';
import { getTokenPrice } from '@/services/coingecko';
import type { Token, QuoteResponse } from '@/types';

/**
 * État du hook useSwap
 */
interface UseSwapState {
  // États de chargement
  loading: boolean;
  quoteLoading: boolean;
  swapLoading: boolean;
  
  // Données du swap
  currentQuote: QuoteResponse | null;
  lastSwapResult: SwapResult | null;
  
  // État de progression
  swapStage: SwapStage | null;
  swapProgress: number; // 0-100
  
  // Gestion des erreurs
  error: string | null;
  quoteError: string | null;
  
  // Prix des tokens en USD
  solPrice: number;
  usdcPrice: number;
}

/**
 * Configuration pour les opérations de swap
 */
interface SwapConfig {
  slippageBps?: number;
  enableOptimizations?: boolean;
  priorityFeeStrategy?: 'auto' | 'low' | 'medium' | 'high';
  simulateFirst?: boolean;
}

/**
 * Hook principal pour les opérations de swap
 */
export function useSwap(config: SwapConfig = {}) {
  const { publicKey, signTransaction } = useWallet();
  const swapService = getSwapService();
  
  const [state, setState] = useState<UseSwapState>({
    loading: false,
    quoteLoading: false,
    swapLoading: false,
    currentQuote: null,
    lastSwapResult: null,
    swapStage: null,
    swapProgress: 0,
    error: null,
    quoteError: null,
    solPrice: 0,
    usdcPrice: 1,
  });

  // Configuration par défaut
  const defaultConfig: Required<SwapConfig> = {
    slippageBps: 50, // 0.5%
    enableOptimizations: true,
    priorityFeeStrategy: 'auto',
    simulateFirst: true,
    ...config
  };

  // Récupération des prix des tokens en temps réel
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [solPrice, usdcPrice] = await Promise.all([
          getTokenPrice('solana'),
          getTokenPrice('usd-coin')
        ]);
        
        setState(prev => ({ ...prev, solPrice, usdcPrice }));
      } catch (error) {
        console.warn('Erreur récupération prix tokens:', error);
        // Utiliser des prix de fallback
        setState(prev => ({ ...prev, solPrice: 100, usdcPrice: 1 }));
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  /**
   * Obtient un quote pour un swap
   */
  const getQuote = useCallback(async (
    inputToken: Token,
    outputToken: Token,
    inputAmount: number
  ): Promise<QuoteResponse | null> => {
    if (!inputToken || !outputToken || inputAmount <= 0) {
      return null;
    }

    setState(prev => ({ 
      ...prev, 
      quoteLoading: true, 
      quoteError: null,
      currentQuote: null 
    }));

    try {
      // Note: getQuote ne nécessite pas userPublicKey
      const quote = await swapService.getQuote({
        inputToken,
        outputToken,
        inputAmount,
      });

      setState(prev => ({ 
        ...prev, 
        currentQuote: quote,
        quoteLoading: false 
      }));

      // Tracer l'événement dans Sentry
      Sentry.addBreadcrumb({
        category: 'swap',
        message: 'Quote obtenu avec succès',
        data: {
          inputToken: inputToken.symbol,
          outputToken: outputToken.symbol,
          inputAmount,
          outputAmount: quote.outAmount
        }
      });

      return quote;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération du quote';
      
      setState(prev => ({ 
        ...prev, 
        quoteLoading: false,
        quoteError: errorMessage 
      }));

      Sentry.captureException(error, {
        tags: { operation: 'getQuote' },
        extra: { inputToken, outputToken, inputAmount }
      });

      console.error('Erreur getQuote:', error);
      return null;
    }
  }, [swapService]);

  /**
   * Exécute un swap complet
   */
  const executeSwap = useCallback(async (
    inputToken: Token,
    outputToken: Token,
    inputAmount: number
  ): Promise<SwapResult | null> => {
    if (!publicKey || !signTransaction || !inputToken || !outputToken || inputAmount <= 0) {
      setState(prev => ({ 
        ...prev, 
        error: 'Wallet non connecté ou paramètres invalides' 
      }));
      return null;
    }

    setState(prev => ({ 
      ...prev, 
      swapLoading: true, 
      error: null,
      swapStage: 'analyzing_market',
      swapProgress: 0 
    }));

    try {
      return await Sentry.startSpan(
        {
          op: 'swap.execute',
          name: 'Execute Complete Swap',
        },
        async () => {
          const swapParams: SwapParams = {
            inputToken,
            outputToken,
            inputAmount,
            userPublicKey: publicKey,
            slippageConfig: {
              maxSlippageBps: defaultConfig.slippageBps,
              enableDynamicOptimization: defaultConfig.enableOptimizations,
              marketConditionWeight: 0.6,
              liquidityDepthWeight: 0.4,
              minConfidenceLevel: 0.7
            },
            priorityFeeConfig: {
              strategy: defaultConfig.priorityFeeStrategy,
              targetConfirmationTime: 15,
              maxFeeBudget: 100000
            },
            enableOptimizations: defaultConfig.enableOptimizations,
            onProgress: (stage: SwapStage, data?: any) => {
              const progressMap: Record<SwapStage, number> = {
                'preparing': 5,
                'analyzing_market': 15,
                'getting_quote': 25,
                'building_transaction': 40,
                'simulating': 50,
                'sending': 60,
                'confirming': 80,
                'completed': 100,
                'failed': 0
              };

              setState(prev => ({
                ...prev,
                swapStage: stage,
                swapProgress: progressMap[stage] || 0
              }));

              // Log détaillé pour le debugging
              console.log(`🔄 Swap progress: ${stage} (${progressMap[stage]}%)`, data);
            }
          };

          const result = await swapService.executeSwap(swapParams);

          setState(prev => ({ 
            ...prev, 
            swapLoading: false,
            lastSwapResult: result,
            swapStage: 'completed',
            swapProgress: 100
          }));

          // Tracer le succès dans Sentry
          Sentry.addBreadcrumb({
            category: 'swap',
            message: 'Swap exécuté avec succès',
            data: {
              signature: result.transaction.signature,
              inputToken: inputToken.symbol,
              outputToken: outputToken.symbol,
              inputAmount,
              optimizationUsed: !!result.optimization
            }
          });

          console.log('🎉 Swap exécuté avec succès:', result);
          return result;
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'exécution du swap';
      
      setState(prev => ({ 
        ...prev, 
        swapLoading: false,
        error: errorMessage,
        swapStage: 'failed',
        swapProgress: 0
      }));

      Sentry.captureException(error, {
        tags: { operation: 'executeSwap' },
        extra: { 
          inputToken, 
          outputToken, 
          inputAmount,
          userPublicKey: publicKey.toString()
        }
      });

      console.error('Erreur executeSwap:', error);
      return null;
    }
  }, [publicKey, signTransaction, swapService, defaultConfig]);

  // Fonction getQuote déclarée plus haut, suppression de la duplication

  /**
   * Calcule la valeur USD d'un montant de token
   */
  const calculateUsdValue = useCallback((
    token: Token,
    amount: number
  ): number => {
    if (token.symbol === 'SOL') {
      return amount * state.solPrice;
    } else if (token.symbol === 'USDC') {
      return amount * state.usdcPrice;
    }
    return 0;
  }, [state.solPrice, state.usdcPrice]);

  /**
   * Remet à zéro les erreurs
   */
  const clearErrors = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      error: null, 
      quoteError: null 
    }));
  }, []);

  /**
   * Remet à zéro l'état complet
   */
  const resetState = useCallback(() => {
    setState({
      loading: false,
      quoteLoading: false,
      swapLoading: false,
      currentQuote: null,
      lastSwapResult: null,
      swapStage: null,
      swapProgress: 0,
      error: null,
      quoteError: null,
      solPrice: state.solPrice, // Garder les prix
      usdcPrice: state.usdcPrice,
    });
  }, [state.solPrice, state.usdcPrice]);

  return {
    // État
    ...state,
    
    // Configuration
    config: defaultConfig,
    
    // Méthodes
    getQuote,
    executeSwap,
    calculateUsdValue,
    clearErrors,
    resetState,
    
    // État dérivé
    hasQuote: !!state.currentQuote,
    canSwap: !!publicKey && !state.swapLoading,
    pricesLoaded: state.solPrice > 0,
  };
}
