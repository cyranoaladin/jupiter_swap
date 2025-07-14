/**
 * Mock du service Swap
 * 
 * Ce fichier contient un mock complet du service Swap pour les tests unitaires
 * Implémente le processus complet de swap avec optimisations
 */

// Mock des résultats de swap
export const mockSwapResult = {
  signature: 'test-signature',
  inputAmount: 1000000000, // 1 SOL en lamports
  outputAmount: 10000000, // 10 USDC (6 décimales)
  inputToken: 'SOL',
  outputToken: 'USDC',
  slippage: 40, // 0.4%
  priorityFee: 10000, // 0.00001 SOL
  savings: {
    slippageSavingsBps: 10,
    feeSavings: 5000,
    slippageSavingsValue: 1000000,
    totalSavings: 1005000,
    originalParams: {
      slippageBps: 50,
      priorityFee: 15000,
      amount: 1000000000,
    },
    optimizedParams: {
      slippageBps: 40,
      priorityFee: 10000,
      amount: 1000000000,
    },
  },
  timestamp: Date.now(),
};

// Mock des fonctions du service Swap
export const mockExecuteSwap = jest.fn().mockImplementation(async (params) => {
  // Simuler les étapes du processus de swap
  if (params.progressCallback) {
    params.progressCallback({ step: 'VALIDATING_BALANCES', message: 'Validation des soldes...' });
    await new Promise(resolve => setTimeout(resolve, 10));
    
    params.progressCallback({ step: 'FETCHING_QUOTE', message: 'Récupération des quotes...' });
    await new Promise(resolve => setTimeout(resolve, 10));
    
    params.progressCallback({ step: 'OPTIMIZING_PARAMETERS', message: 'Optimisation des paramètres...' });
    await new Promise(resolve => setTimeout(resolve, 10));
    
    params.progressCallback({ step: 'BUILDING_TRANSACTION', message: 'Construction de la transaction...' });
    await new Promise(resolve => setTimeout(resolve, 10));
    
    params.progressCallback({ step: 'SIMULATING_TRANSACTION', message: 'Simulation de la transaction...' });
    await new Promise(resolve => setTimeout(resolve, 10));
    
    params.progressCallback({ step: 'SENDING_TRANSACTION', message: 'Envoi de la transaction...' });
    await new Promise(resolve => setTimeout(resolve, 10));
    
    params.progressCallback({ step: 'CONFIRMING_TRANSACTION', message: 'Confirmation de la transaction...' });
    await new Promise(resolve => setTimeout(resolve, 10));
    
    params.progressCallback({ step: 'RECOVERING_SAVINGS', message: 'Récupération des économies...' });
    await new Promise(resolve => setTimeout(resolve, 10));
    
    params.progressCallback({ step: 'COMPLETED', message: 'Swap terminé avec succès!' });
  }
  
  return mockSwapResult;
});

export const mockValidateSwapParams = jest.fn().mockImplementation((params) => {
  // Validation de base des paramètres
  if (!params.inputToken || !params.outputToken) {
    throw new Error('Les tokens d\'entrée et de sortie sont requis');
  }
  if (!params.amount || params.amount <= 0) {
    throw new Error('Le montant doit être supérieur à 0');
  }
  return true;
});

export const mockCalculateSwapSavings = jest.fn().mockReturnValue({
  slippageSavingsBps: 10,
  feeSavings: 5000,
  slippageSavingsValue: 1000000,
  totalSavings: 1005000,
});

// Mock du service Swap
export const mockSwapService = {
  executeSwap: mockExecuteSwap,
  validateSwapParams: mockValidateSwapParams,
  calculateSwapSavings: mockCalculateSwapSavings,
  getSwapQuote: jest.fn().mockResolvedValue({
    inputMint: 'So11111111111111111111111111111111111111112',
    outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    inAmount: 1000000000,
    outAmount: 10000000,
    otherAmountThreshold: 9950000,
    slippageBps: 40,
    priceImpactPct: 0.1,
  }),
  buildSwapTransaction: jest.fn().mockResolvedValue({
    transaction: 'mock-swap-transaction',
    swapParams: {
      inputMint: 'So11111111111111111111111111111111111111112',
      outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      inAmount: 1000000000,
      outAmount: 10000000,
      slippageBps: 40,
      priorityFee: 10000,
    },
  }),
  simulateSwapTransaction: jest.fn().mockResolvedValue({ success: true, logs: [] }),
  sendAndConfirmSwapTransaction: jest.fn().mockResolvedValue('test-signature'),
  recoverSwapSavings: jest.fn().mockResolvedValue({
    success: true,
    signature: 'test-savings-signature',
    amount: 0.02,
  }),
};

export default mockSwapService;
