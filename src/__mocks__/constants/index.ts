/**
 * Mock des constantes du projet
 * 
 * Ce fichier contient les mocks des constantes utilisées dans les tests
 */

// Tokens
export const SOL_MINT = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

// Paramètres de swap
export const DEFAULT_SLIPPAGE_BPS = 50;
export const MAX_SLIPPAGE_BPS = 500;
export const DEFAULT_PRIORITY_FEE = 10000;
export const MAX_PRIORITY_FEE = 1000000;

// Paramètres d'optimisation
export const ENABLE_DYNAMIC_SLIPPAGE = true;
export const ENABLE_SMART_PRIORITY_FEES = true;
export const ENABLE_FEE_RECOVERY = true;
export const SERVICE_FEE_PERCENTAGE = 0.25;
export const MIN_SAVINGS_THRESHOLD = 0.01;

// Wallet de service pour la récupération des économies
export const SERVICE_WALLET = 'test-service-wallet';

// RPC Endpoints
export const RPC_ENDPOINTS = [
  {
    url: 'https://mainnet.helius-rpc.com/?api-key=d94d81dd-f2a1-40f7-920d-0dfaf3aaf032',
    name: 'Helius Primary',
    weight: 3,
  },
  {
    url: 'https://solana-mainnet.g.alchemy.com/v2/UvOk23LRlqGz1m58VCEd3PJ2ZOX2h9KM',
    name: 'Alchemy',
    weight: 2,
  },
  {
    url: 'https://eclipse.helius-rpc.com/',
    name: 'Helius Eclipse',
    weight: 1,
  }
];

// API Jupiter
export const JUPITER_API_BASE_URL = 'https://quote-api.jup.ag/v6';

// Timeouts et retries
export const API_TIMEOUT = 30000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000;

// Analytics et monitoring
export const ENABLE_TRANSACTION_HISTORY = true;
export const ENABLE_ADVANCED_ANALYTICS = true;

const mockConstants = {
  SOL_MINT,
  USDC_MINT,
  DEFAULT_SLIPPAGE_BPS,
  MAX_SLIPPAGE_BPS,
  DEFAULT_PRIORITY_FEE,
  MAX_PRIORITY_FEE,
  ENABLE_DYNAMIC_SLIPPAGE,
  ENABLE_SMART_PRIORITY_FEES,
  ENABLE_FEE_RECOVERY,
  SERVICE_FEE_PERCENTAGE,
  MIN_SAVINGS_THRESHOLD,
  SERVICE_WALLET,
  RPC_ENDPOINTS,
  JUPITER_API_BASE_URL,
  API_TIMEOUT,
  MAX_RETRIES,
  RETRY_DELAY,
  ENABLE_TRANSACTION_HISTORY,
  ENABLE_ADVANCED_ANALYTICS,
};
export default mockConstants;
