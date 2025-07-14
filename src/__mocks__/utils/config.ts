/**
 * Mock du module de configuration
 * 
 * Ce fichier contient les mocks des fonctions de configuration utilisées dans les tests
 */

// Mock des fonctions de configuration
export const getServiceWallet = jest.fn().mockReturnValue('11111111111111111111111111111111');
export const getRpcEndpoints = jest.fn().mockReturnValue([
  {
    url: 'https://mainnet.helius-rpc.com/?api-key=d94d81dd-f2a1-40f7-920d-0dfaf3aaf032',
    name: 'Helius Primary',
    weight: 3,
  },
  {
    url: 'https://solana-mainnet.g.alchemy.com/v2/UvOk23LRlqGz1m58VCEd3PJ2ZOX2h9KM',
    name: 'Solana Public',
    weight: 1,
  }
]);

export const getJupiterApiUrl = jest.fn().mockReturnValue('https://quote-api.jup.ag/v6');
export const getDefaultSlippage = jest.fn().mockReturnValue(50);
export const getMaxSlippage = jest.fn().mockReturnValue(500);
export const getDefaultPriorityFee = jest.fn().mockReturnValue(10000);
export const getMaxPriorityFee = jest.fn().mockReturnValue(1000000);
export const isDynamicSlippageEnabled = jest.fn().mockReturnValue(true);
export const isSmartPriorityFeesEnabled = jest.fn().mockReturnValue(true);
export const isFeeRecoveryEnabled = jest.fn().mockReturnValue(true);
export const getServiceFeePercentage = jest.fn().mockReturnValue(0.25);
export const getMinSavingsThreshold = jest.fn().mockReturnValue(0.01);
export const isTransactionHistoryEnabled = jest.fn().mockReturnValue(true);
export const isAdvancedAnalyticsEnabled = jest.fn().mockReturnValue(true);
export const getApiTimeout = jest.fn().mockReturnValue(30000);
export const getMaxRetries = jest.fn().mockReturnValue(3);
export const getRetryDelay = jest.fn().mockReturnValue(1000);

export default {
  getServiceWallet,
  getRpcEndpoints,
  getJupiterApiUrl,
  getDefaultSlippage,
  getMaxSlippage,
  getDefaultPriorityFee,
  getMaxPriorityFee,
  isDynamicSlippageEnabled,
  isSmartPriorityFeesEnabled,
  isFeeRecoveryEnabled,
  getServiceFeePercentage,
  getMinSavingsThreshold,
  isTransactionHistoryEnabled,
  isAdvancedAnalyticsEnabled,
  getApiTimeout,
  getMaxRetries,
  getRetryDelay,
};
