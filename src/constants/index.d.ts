/**
 * Déclarations de types pour les constantes du projet
 * 
 * Ce fichier contient les déclarations de types nécessaires pour les constantes
 * utilisées dans le projet Jupiter Swap DApp
 */

import { Token } from '../services/solana';

/**
 * Adresses des tokens principaux
 */
export const SOL_MINT: string;
export const USDC_MINT: string;
export const USDT_MINT: string;

/**
 * Constantes liées à Solana
 */
export const LAMPORTS_PER_SOL: number;
export const SOL_DECIMALS: number;
export const USDC_DECIMALS: number;
export const SOLANA_ADDRESS_REGEX: RegExp;

/**
 * Tokens par défaut
 */
export const DEFAULT_SOL_TOKEN: Token;
export const DEFAULT_USDC_TOKEN: Token;

/**
 * Constantes liées au slippage et aux frais
 */
export const DEFAULT_SLIPPAGE_BPS: number;
export const MAX_SLIPPAGE_BPS: number;
export const DEFAULT_PRIORITY_FEE: number;
export const MAX_PRIORITY_FEE: number;
export const SERVICE_FEE_PERCENTAGE: number;
export const MIN_SAVINGS_THRESHOLD: number;

/**
 * Niveaux de frais prioritaires
 */
export const PRIORITY_FEE_LEVELS: {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
  VERY_HIGH: number;
};

/**
 * URLs des explorateurs
 */
export const EXPLORER_URLS: Record<string, string>;

/**
 * Codes et messages d'erreur
 */
export const ERROR_CODES: Record<string, string>;
export const ERROR_MESSAGES: Record<string, string>;

/**
 * URLs de l'API Jupiter
 */
export const JUPITER_API_BASE_URL: string;
export const JUPITER_API_TIMEOUT: number;
export const JUPITER_TOKENS_API_URL: string;
export const JUPITER_ENDPOINTS: {
  quote: string;
  swap: string;
  tokens: string;
  [key: string]: string;
};
