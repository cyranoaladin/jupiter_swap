/**
 * Constantes pour Jupiter Swap DApp
 * 
 * Ce fichier contient toutes les constantes utilisées dans l'application.
 * Les constantes sont organisées par catégorie pour faciliter la maintenance.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import type { Token } from '@/types';

// =============================================================================
// CONSTANTES BLOCKCHAIN SOLANA
// =============================================================================

/**
 * Adresse du mint SOL (token natif Solana)
 */
const SOL_MINT = 'So11111111111111111111111111111111111111112';

/**
 * Adresse du mint USDC sur Solana
 */
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

/**
 * Adresse du mint USDT sur Solana
 */
const USDT_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

/**
 * Nombre de lamports dans 1 SOL
 */
const LAMPORTS_PER_SOL = 1_000_000_000;

/**
 * Nombre de décimales pour SOL
 */
const SOL_DECIMALS = 9;

/**
 * Nombre de décimales pour USDC
 */
const USDC_DECIMALS = 6;

/**
 * Taille maximale d'une transaction Solana en octets
 */
export const MAX_TRANSACTION_SIZE = 1232;

/**
 * Adresse du wallet de service pour les Platform Fees
 */
export const SERVICE_WALLET_ADDRESS = 'GG4ffTkW8RHHdLUVNQWcLoNLtL245k16QuRRU5jeBTL1';

/**
 * Nombre maximum de comptes par transaction
 */
export const MAX_ACCOUNTS_PER_TRANSACTION = 64;

// =============================================================================
// TOKENS PAR DÉFAUT
// =============================================================================

/**
 * Token SOL par défaut
 */
const DEFAULT_SOL_TOKEN: Token = {
  address: SOL_MINT,
  chainId: 101,
  decimals: SOL_DECIMALS,
  name: 'Solana',
  symbol: 'SOL',
  logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  tags: ['native'],
  extensions: {
    coingeckoId: 'solana',
  },
};

/**
 * Token USDC par défaut
 */
const DEFAULT_USDC_TOKEN: Token = {
  address: USDC_MINT,
  chainId: 101,
  decimals: USDC_DECIMALS,
  name: 'USD Coin',
  symbol: 'USDC',
  logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  tags: ['stablecoin'],
  extensions: {
    coingeckoId: 'usd-coin',
  },
};

/**
 * Liste des tokens populaires
 */
const POPULAR_TOKENS: Token[] = [
  DEFAULT_SOL_TOKEN,
  DEFAULT_USDC_TOKEN,
  // Autres tokens populaires peuvent être ajoutés ici
];

// =============================================================================
// CONSTANTES JUPITER
// =============================================================================

/**
 * URL de base de l'API Jupiter v6
 */
const JUPITER_API_BASE_URL = 'https://quote-api.jup.ag/v6';

/**
 * URL de l'API de tokens Jupiter
 */
const JUPITER_TOKENS_API_URL = 'https://token.jup.ag/strict';

/**
 * Endpoints de l'API Jupiter
 */
const JUPITER_ENDPOINTS = {
  quote: `${JUPITER_API_BASE_URL}/quote`,
  swap: `${JUPITER_API_BASE_URL}/swap`,
  price: `${JUPITER_API_BASE_URL}/price`,
  tokens: JUPITER_TOKENS_API_URL,
  indexedRouteMap: `${JUPITER_API_BASE_URL}/indexed-route-map`,
};

/**
 * Timeout pour les requêtes à l'API Jupiter (en ms)
 */
const JUPITER_API_TIMEOUT = 30_000;

/**
 * Nombre maximum de tentatives pour les requêtes Jupiter
 */
export const JUPITER_MAX_RETRIES = 3;

/**
 * Délai entre les tentatives de requêtes Jupiter (en ms)
 */
export const JUPITER_RETRY_DELAY = 1000;

// =============================================================================
// CONSTANTES SLIPPAGE
// =============================================================================

/**
 * Slippage par défaut en points de base (1 BPS = 0.01%)
 * 50 BPS = 0.5%
 */
const DEFAULT_SLIPPAGE_BPS = 50;

/**
 * Slippage minimum en points de base
 * 10 BPS = 0.1%
 */
const MIN_SLIPPAGE_BPS = 10;

/**
 * Slippage maximum en points de base
 * 500 BPS = 5%
 */
const MAX_SLIPPAGE_BPS = 500;

/**
 * Presets de slippage en points de base
 */
const SLIPPAGE_PRESETS = [10, 25, 50, 100, 200, 300] as const;

/**
 * Labels pour les presets de slippage
 */
const SLIPPAGE_PRESET_LABELS = {
  10: '0.1%',
  25: '0.25%',
  50: '0.5%',
  100: '1%',
  200: '2%',
  300: '3%',
};

/**
 * Temps de confirmation pour différents niveaux de priority fee
 */
export const PRIORITY_FEE_CONFIRMATION_TIMES = {
  LOW: 20000, // 20 secondes
  MEDIUM: 10000, // 10 secondes
  HIGH: 5000, // 5 secondes
  VERY_HIGH: 2000, // 2 secondes
};

// =============================================================================
// CONSTANTES PRIORITY FEES
// =============================================================================

/**
 * Priority fee par défaut en lamports
 * 10,000 lamports = ~0.00001 SOL
 */
const DEFAULT_PRIORITY_FEE = 10_000;

/**
 * Priority fee minimum en lamports
 */
const MIN_PRIORITY_FEE = 1_000;

/**
 * Priority fee maximum en lamports
 */
const MAX_PRIORITY_FEE = 1_000_000;

/**
 * Niveaux de priority fees en lamports
 */
const PRIORITY_FEE_LEVELS = {
  LOW: 5_000,
  MEDIUM: 10_000,
  HIGH: 50_000,
  VERY_HIGH: 100_000,
};

/**
 * Labels pour les niveaux de priority fees
 */
const PRIORITY_FEE_LABELS = {
  LOW: 'Basse',
  MEDIUM: 'Moyenne',
  HIGH: 'Élevée',
  VERY_HIGH: 'Très élevée',
};

// =============================================================================
// CONSTANTES DE CONFIGURATION
// =============================================================================

/**
 * Pourcentage de frais de service (0.25%)
 */
const SERVICE_FEE_PERCENTAGE = 0.25;

/**
 * Seuil minimum d'économies pour afficher les optimisations (en USD)
 */
const MIN_SAVINGS_THRESHOLD = 0.01;

/**
 * Montant minimum pour un swap (en USD)
 */
const MIN_SWAP_AMOUNT = 0.001;

/**
 * Montant maximum pour un swap (en USD)
 */
const MAX_SWAP_AMOUNT = 1000;

/**
 * Intervalle de rafraîchissement des soldes (en ms)
 */
export const BALANCE_REFRESH_INTERVAL = 30000; // 30 secondes

/**
 * Intervalle de rafraîchissement des quotes (en ms)
 */
export const QUOTE_REFRESH_INTERVAL = 10000; // 10 secondes

/**
 * Durée de mise en cache des tokens (en ms)
 */
export const TOKEN_CACHE_DURATION = 3600000; // 1 heure

// =============================================================================
// CONSTANTES UI
// =============================================================================

/**
 * Délai de debounce pour les inputs (en ms)
 */
const INPUT_DEBOUNCE_DELAY = 500;

/**
 * Durée des animations (en ms)
 */
const ANIMATION_DURATION = 300;

/**
 * Durée d'affichage des toasts (en ms)
 */
const TOAST_DURATION = 5_000;

/**
 * Nombre maximum d'éléments dans l'historique
 */
export const MAX_HISTORY_ITEMS = 50;

/**
 * Nombre d'éléments par page dans l'historique
 */
export const HISTORY_ITEMS_PER_PAGE = 10;

// =============================================================================
// CONSTANTES DE VALIDATION
// =============================================================================

/**
 * Regex pour valider une adresse Solana
 */
const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Regex pour valider un montant
 */
const AMOUNT_REGEX = /^\d*\.?\d*$/;

/**
 * Nombre maximum de décimales autorisées
 */
const MAX_DECIMAL_PLACES = 9;

/**
 * Précision pour l'affichage des montants
 */
export const AMOUNT_PRECISION = 6;

// =============================================================================
// CONSTANTES D'ERREUR
// =============================================================================

/**
 * Codes d'erreur
 */
export const ERROR_CODES: Record<string, string> = {
  // Erreurs réseau
  NETWORK_ERROR: 'NETWORK_ERROR',
  RPC_ERROR: 'RPC_ERROR',
  API_TIMEOUT: 'API_TIMEOUT',
  
  // Erreurs wallet
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  WALLET_CONNECTION_FAILED: 'WALLET_CONNECTION_FAILED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  
  // Erreurs transaction
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  TRANSACTION_TIMEOUT: 'TRANSACTION_TIMEOUT',
  SIGNATURE_REJECTED: 'SIGNATURE_REJECTED',
  
  // Erreurs validation
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  AMOUNT_TOO_SMALL: 'AMOUNT_TOO_SMALL',
  AMOUNT_TOO_LARGE: 'AMOUNT_TOO_LARGE',
  
  // Erreurs Jupiter
  QUOTE_FAILED: 'QUOTE_FAILED',
  NO_ROUTE_FOUND: 'NO_ROUTE_FOUND',
  SLIPPAGE_TOO_HIGH: 'SLIPPAGE_TOO_HIGH',
  
  // Erreurs génériques
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  FEATURE_DISABLED: 'FEATURE_DISABLED',
};

/**
 * Messages d'erreur par défaut
 */
export const ERROR_MESSAGES: Record<string, string> = {
  'NETWORK_ERROR': 'Erreur de connexion réseau',
  'RPC_ERROR': 'Erreur de connexion à Solana',
  'API_TIMEOUT': 'Délai d\'attente dépassé',
  'WALLET_NOT_CONNECTED': 'Wallet non connecté',
  'WALLET_CONNECTION_FAILED': 'Échec de connexion au wallet',
  'INSUFFICIENT_BALANCE': 'Solde insuffisant',
  'TRANSACTION_FAILED': 'Transaction échouée',
  'TRANSACTION_TIMEOUT': 'Délai de transaction dépassé',
  'SIGNATURE_REJECTED': 'Signature rejetée',
  'INVALID_AMOUNT': 'Montant invalide',
  'INVALID_ADDRESS': 'Adresse invalide',
  'AMOUNT_TOO_SMALL': 'Montant trop petit',
  'AMOUNT_TOO_LARGE': 'Montant trop grand',
  'QUOTE_FAILED': 'Impossible d\'obtenir un quote',
  'NO_ROUTE_FOUND': 'Aucune route trouvée',
  'SLIPPAGE_TOO_HIGH': 'Slippage trop élevé',
  'UNKNOWN_ERROR': 'Erreur inconnue',
  'FEATURE_DISABLED': 'Fonctionnalité désactivée',
};

// =============================================================================
// CONSTANTES ANALYTICS
// =============================================================================

/**
 * Événements pour l'analytics
 */
const ANALYTICS_EVENTS = {
  // Événements wallet
  WALLET_CONNECTED: 'wallet_connected',
  WALLET_DISCONNECTED: 'wallet_disconnected',
  
  // Événements transaction
  TRANSACTION_STARTED: 'transaction_started',
  TRANSACTION_SUCCEEDED: 'transaction_succeeded',
  TRANSACTION_FAILED: 'transaction_failed',
  
  // Événements swap
  SWAP_STARTED: 'swap_started',
  SWAP_COMPLETED: 'swap_completed',
  SWAP_FAILED: 'swap_failed',
  
  // Événements quote
  QUOTE_REQUESTED: 'quote_requested',
  QUOTE_RECEIVED: 'quote_received',
  QUOTE_FAILED: 'quote_failed',
  
  // Événements optimisation
  OPTIMIZATION_APPLIED: 'optimization_applied',
  SAVINGS_CALCULATED: 'savings_calculated',
  
  // Événements interface
  TOKEN_SELECTED: 'token_selected',
  SETTINGS_CHANGED: 'settings_changed',
  EXPERT_MODE_TOGGLED: 'expert_mode_toggled',
} as const;

// =============================================================================
// CONSTANTES DE DÉVELOPPEMENT
// =============================================================================

/**
 * Indique si l'application est en mode développement
 */
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

/**
 * Indique si l'application est en mode production
 */
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Indique si les logs de debug sont activés
 */
const DEBUG_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGS === 'true' || IS_DEVELOPMENT;

/**
 * Mode de simulation (pour le développement)
 */
export const SIMULATION_MODE = false;

// =============================================================================
// CONSTANTES D'URLS
// =============================================================================

/**
 * URLs des explorateurs blockchain
 */
const EXPLORER_URLS = {
  solscan: 'https://solscan.io',
  solanaFM: 'https://solana.fm',
  explorer: 'https://explorer.solana.com',
};

/**
 * URLs de documentation
 */
const DOCUMENTATION_URLS = {
  jupiter: 'https://docs.jup.ag/',
  solana: 'https://docs.solana.com/',
  wallets: 'https://docs.solana.com/wallet-guide',
};

/**
 * URLs des réseaux sociaux
 */
const SOCIAL_URLS = {
  twitter: 'https://twitter.com/',
  discord: 'https://discord.gg/',
  github: 'https://github.com/',
};

// =============================================================================
// EXPORTS
// =============================================================================

export {
  // Constantes blockchain
  SOL_MINT,
  USDC_MINT,
  USDT_MINT,
  LAMPORTS_PER_SOL,
  SOL_DECIMALS,
  USDC_DECIMALS,
  
  // Tokens par défaut
  DEFAULT_SOL_TOKEN,
  DEFAULT_USDC_TOKEN,
  POPULAR_TOKENS,
  
  // Constantes Jupiter
  JUPITER_API_BASE_URL,
  JUPITER_TOKENS_API_URL,
  JUPITER_ENDPOINTS,
  JUPITER_API_TIMEOUT,
  
  // Constantes slippage
  DEFAULT_SLIPPAGE_BPS,
  MIN_SLIPPAGE_BPS,
  MAX_SLIPPAGE_BPS,
  SLIPPAGE_PRESETS,
  SLIPPAGE_PRESET_LABELS,
  
  // Constantes priority fees
  DEFAULT_PRIORITY_FEE,
  MIN_PRIORITY_FEE,
  MAX_PRIORITY_FEE,
  PRIORITY_FEE_LEVELS,
  PRIORITY_FEE_LABELS,
  
  // Constantes configuration
  SERVICE_FEE_PERCENTAGE,
  MIN_SAVINGS_THRESHOLD,
  MIN_SWAP_AMOUNT,
  MAX_SWAP_AMOUNT,
  
  // Constantes UI
  INPUT_DEBOUNCE_DELAY,
  ANIMATION_DURATION,
  TOAST_DURATION,
  
  // Constantes validation
  SOLANA_ADDRESS_REGEX,
  AMOUNT_REGEX,
  MAX_DECIMAL_PLACES,
  
  // Constantes erreur (déjà exportées directement)
  
  // Constantes analytics
  ANALYTICS_EVENTS,
  
  // Constantes développement
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  DEBUG_ENABLED,
  
  // URLs
  EXPLORER_URLS,
  DOCUMENTATION_URLS,
  SOCIAL_URLS,
};
