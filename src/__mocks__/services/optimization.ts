/**
 * Mock du service Optimization
 * 
 * Ce fichier contient un mock complet du service Optimization pour les tests unitaires
 * Implémente les optimisations dynamiques de slippage et priority fees
 */

// Mock des fonctions d'optimisation
export const mockCalculateDynamicSlippage = jest.fn().mockImplementation((baseSlippageBps, marketConditions) => {
  // Implémentation de la formule : optimizedSlippage = baseSlippage * (1 - optimizationFactor)
  const optimizationFactor = marketConditions ? 0.2 + (marketConditions.volatility || 0) * 0.1 : 0.2; // Ajustement basé sur la volatilité
  return Math.max(Math.floor(baseSlippageBps * (1 - optimizationFactor)), 10); // Minimum 10 bps (0.1%)
});

export const mockCalculateSmartPriorityFee = jest.fn().mockImplementation((networkConditions) => {
  // Valeur ajustée en fonction des conditions du réseau
  const baseFee = 10000; // 0.00001 SOL
  const congestionMultiplier = networkConditions ? 1 + (networkConditions.congestion || 0) * 0.5 : 1;
  return Math.floor(baseFee * congestionMultiplier);
});

export const mockCalculateSavings = jest.fn().mockImplementation((originalParams, optimizedParams) => {
  // Calcul des économies réalisées
  const originalSlippage = originalParams.slippageBps || 50;
  const optimizedSlippage = optimizedParams.slippageBps || 40;
  
  const originalFee = originalParams.priorityFee || 15000;
  const optimizedFee = optimizedParams.priorityFee || 10000;
  
  const slippageSavingsBps = originalSlippage - optimizedSlippage;
  const feeSavings = originalFee - optimizedFee;
  
  // Conversion en valeur monétaire pour un montant de transaction typique
  const transactionAmount = originalParams.amount || 1000000000; // 1 SOL en lamports
  const slippageSavingsValue = (transactionAmount * slippageSavingsBps) / 10000; // En lamports
  const totalSavings = slippageSavingsValue + feeSavings;
  
  return {
    slippageSavingsBps,
    feeSavings,
    slippageSavingsValue,
    totalSavings,
    originalParams,
    optimizedParams,
  };
});

export const mockGetNetworkConditions = jest.fn().mockResolvedValue({
  congestion: 'MEDIUM',
  avgConfirmationTime: 0.8,
  avgPriorityFee: 12000,
  recentBlockProductionTime: 0.6,
  slot: 123456789,
  timestamp: Date.now(),
});

// Mock du service d'optimisation
export const mockOptimizationService = {
  calculateDynamicSlippage: mockCalculateDynamicSlippage,
  calculateSmartPriorityFee: mockCalculateSmartPriorityFee,
  calculateSavings: mockCalculateSavings,
  getNetworkConditions: mockGetNetworkConditions,
  shouldRecoverSavings: jest.fn().mockImplementation((savings) => {
    const minThreshold = 0.01; // 0.01 SOL en valeur
    return savings.totalSavings / 1000000000 >= minThreshold;
  }),
  createSavingsRecoveryTransaction: jest.fn().mockResolvedValue({
    transaction: 'mock-savings-recovery-transaction',
    amount: 0.02,
  }),
};

export default mockOptimizationService;
