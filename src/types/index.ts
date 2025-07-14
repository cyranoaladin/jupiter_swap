/**
 * Types TypeScript pour Jupiter Swap DApp
 * 
 * Ce fichier contient toutes les définitions de types utilisées dans l'application.
 * Les types sont organisés par catégorie pour faciliter la maintenance et la réutilisation.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import { PublicKey } from '@solana/web3.js';

// =============================================================================
// TYPES DE BASE ET UTILITAIRES
// =============================================================================

/**
 * Type pour les adresses Solana (string ou PublicKey)
 */
export type SolanaAddress = string | PublicKey;

/**
 * Type pour les montants (number ou string pour éviter les erreurs de précision)
 */
export type Amount = number | string;

/**
 * Type pour les timestamps Unix
 */
export type Timestamp = number;

/**
 * Type pour les signatures de transaction
 */
export type TransactionSignature = string;

/**
 * Statut d'une opération asynchrone
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

// =============================================================================
// TYPES POUR LES TOKENS
// =============================================================================

/**
 * Interface pour un token Solana
 */
export interface Token {
  /** Adresse du mint du token */
  address: string;
  /** ID de la chaîne (101 pour Solana mainnet) */
  chainId?: number;
  /** Nom du token */
  name: string;
  /** Symbole du token (ex: SOL, USDC) */
  symbol: string;
  /** Nombre de décimales */
  decimals: number;
  /** URL du logo du token */
  logoURI?: string;
  /** Tags associés au token */
  tags?: string[];
  /** Indique si le token est vérifié */
  verified?: boolean;
  /** Prix actuel en USD (optionnel) */
  priceUsd?: number;
  /** Variation de prix sur 24h (optionnel) */
  priceChange24h?: number;
  /** Extensions pour des métadonnées supplémentaires */
  extensions?: Record<string, any>;
}

/**
 * Interface pour le solde d'un token
 */
export interface TokenBalance {
  /** Token concerné */
  token: Token;
  /** Montant brut (en unités de base) */
  rawAmount: string;
  /** Montant formaté (en unités décimales) */
  amount: number;
  /** Valeur en USD (optionnel) */
  usdValue?: number;
  /** Timestamp de la dernière mise à jour */
  lastUpdated: Timestamp;
}

// =============================================================================
// TYPES POUR JUPITER API
// =============================================================================

/**
 * Paramètres pour obtenir un quote Jupiter
 */
export interface QuoteParams {
  /** Mint du token d'entrée */
  inputMint: string;
  /** Mint du token de sortie */
  outputMint: string;
  /** Montant d'entrée en unités de base */
  amount: string;
  /** Slippage maximum en basis points (ex: 50 = 0.5%) */
  slippageBps?: number;
  /** Activation du slippage dynamique */
  dynamicSlippage?: boolean;
  /** Plateformes à exclure */
  excludeDexes?: string[];
  /** Plateformes à inclure uniquement */
  onlyDirectRoutes?: boolean;
  /** Montant maximum de comptes dans la transaction */
  maxAccounts?: number;
}

/**
 * Réponse de l'API Jupiter pour un quote
 */
export interface QuoteResponse {
  /** Mint du token d'entrée */
  inputMint: string;
  /** Montant d'entrée */
  inAmount: string;
  /** Mint du token de sortie */
  outputMint: string;
  /** Montant de sortie */
  outAmount: string;
  /** Montant de sortie avec slippage */
  otherAmountThreshold: string;
  /** Type de swap (ExactIn ou ExactOut) */
  swapMode: 'ExactIn' | 'ExactOut';
  /** Slippage en basis points */
  slippageBps: number;
  /** Informations sur la plateforme */
  platformFee?: {
    amount: string;
    feeBps: number;
  };
  /** Impact sur le prix */
  priceImpactPct: string;
  /** Informations sur les routes */
  routePlan: RoutePlan[];
  /** Score de confiance (0-100) */
  contextSlot?: number;
  /** Timestamp du quote */
  timeTaken?: number;
}

/**
 * Plan de route pour un swap Jupiter
 */
export interface RoutePlan {
  /** Informations sur l'échange */
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  /** Pourcentage de la route */
  percent: number;
}

/**
 * Réponse pour la construction d'une transaction de swap
 */
export interface SwapTransactionResponse {
  /** Transaction sérialisée */
  swapTransaction: string;
  /** Dernière hauteur de bloc valide */
  lastValidBlockHeight?: number;
  /** Instructions de setup (optionnel) */
  setupInstructions?: string[];
  /** Instructions de cleanup (optionnel) */
  cleanupInstructions?: string[];
  /** Tables de lookup d'adresses */
  addressLookupTableAddresses?: string[];
  /** Comptes dynamiques */
  dynamicSlippageReport?: {
    slippageBps: number;
    otherAmountThreshold: string;
  };
}

// =============================================================================
// TYPES POUR LES OPTIMISATIONS
// =============================================================================

/**
 * Configuration pour le slippage dynamique
 */
export interface DynamicSlippageConfig {
  /** Slippage maximum autorisé en basis points */
  maxSlippageBps: number;
  /** Activation de l'optimisation dynamique */
  enableDynamicOptimization: boolean;
  /** Pondération des conditions de marché */
  marketConditionWeight: number;
  /** Pondération de la profondeur de liquidité */
  liquidityDepthWeight: number;
  /** Niveau de confiance minimum requis */
  minConfidenceLevel: number;
}

/**
 * Configuration pour les priority fees
 */
export interface PriorityFeeConfig {
  /** Stratégie de calcul des fees */
  strategy: 'auto' | 'low' | 'medium' | 'high' | 'custom';
  /** Fee personnalisé en microlamports */
  customFeeMicroLamports?: number;
  /** Temps de confirmation cible en secondes */
  targetConfirmationTime?: number;
  /** Budget maximum pour les fees */
  maxFeeBudget?: number;
}

/**
 * Conditions du réseau Solana
 */
export interface NetworkConditions {
  /** Niveau de congestion */
  congestionLevel: 'low' | 'medium' | 'high' | 'critical';
  /** Temps de confirmation moyen en secondes */
  averageConfirmationTime: number;
  /** Priority fees recommandés par niveau */
  recommendedPriorityFees: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  /** Niveau de confiance de l'estimation (0-1) */
  confidence: number;
  /** Timestamp de la dernière mise à jour */
  lastUpdated: Timestamp;
}

/**
 * Résultat d'optimisation
 */
export interface OptimizationResult {
  /** Économies sur le slippage */
  slippageSavings: {
    /** Slippage original en basis points */
    originalSlippageBps: number;
    /** Slippage optimisé en basis points */
    optimizedSlippageBps: number;
    /** Économies en montant de token */
    savingsAmount: string;
    /** Économies en USD */
    savingsUsd: number;
  };
  /** Économies sur les priority fees */
  priorityFeeSavings: {
    /** Fee standard en lamports */
    standardFeeLamports: number;
    /** Fee optimisé en lamports */
    optimizedFeeLamports: number;
    /** Économies en lamports */
    savingsLamports: number;
    /** Économies en USD */
    savingsUsd: number;
  };
  /** Économies totales */
  totalSavings: {
    /** Montant total économisé en USD */
    totalUsd: number;
    /** Pourcentage d'économies */
    savingsPercentage: number;
  };
  /** Montant dirigé vers le wallet de service */
  serviceFee: {
    /** Montant en USD */
    amountUsd: number;
    /** Pourcentage du total des économies */
    percentage: number;
  };
  /** Niveau de confiance de l'optimisation */
  confidenceScore: number;
}

// =============================================================================
// TYPES POUR LES TRANSACTIONS
// =============================================================================

/**
 * Statut d'une transaction
 */
export type TransactionStatus = 
  | 'preparing'
  | 'signing'
  | 'sending'
  | 'confirming'
  | 'confirmed'
  | 'failed'
  | 'cancelled';

/**
 * Résultat d'une transaction
 */
export interface TransactionResult {
  /** Signature de la transaction */
  signature: TransactionSignature;
  /** Statut de la transaction */
  status: TransactionStatus;
  /** Bloc de confirmation */
  confirmationBlock?: number;
  /** Temps de confirmation en secondes */
  confirmationTime?: number;
  /** Erreur éventuelle */
  error?: string;
  /** Détails de l'erreur */
  errorDetails?: {
    code: number;
    message: string;
    logs?: string[];
  };
}

/**
 * Historique d'une transaction
 */
export interface HistoricalTransaction {
  /** ID unique de la transaction */
  id: string;
  /** Signature de la transaction */
  signature: TransactionSignature;
  /** Timestamp de la transaction */
  timestamp: Timestamp;
  /** Type de transaction */
  type: 'swap' | 'transfer' | 'other';
  /** Token d'entrée */
  inputToken: Token;
  /** Montant d'entrée */
  inputAmount: string;
  /** Token de sortie */
  outputToken: Token;
  /** Montant de sortie */
  outputAmount: string;
  /** Statut de la transaction */
  status: TransactionStatus;
  /** Fees payés */
  fees: {
    /** Priority fee en lamports */
    priorityFee: number;
    /** Fees de transaction en lamports */
    transactionFee: number;
    /** Fees de plateforme */
    platformFee?: number;
  };
  /** Optimisations appliquées */
  optimizations?: OptimizationResult;
  /** Slippage réel */
  actualSlippage?: number;
  /** Prix d'exécution */
  executionPrice?: number;
  /** URL de l'explorateur */
  explorerUrl?: string;
}

// =============================================================================
// TYPES POUR LA CONFIGURATION
// =============================================================================

/**
 * Configuration de l'application
 */
export interface AppConfig {
  /** Liste des endpoints RPC */
  rpcEndpoints: string[];
  /** URL de l'API Jupiter */
  jupiterApiUrl: string;
  /** Timeout pour les requêtes API */
  apiTimeout: number;
  /** Timeout pour les requêtes RPC */
  rpcTimeout: number;
  /** Timeout pour les transactions */
  transactionTimeout: number;
  /** Timeout pour les websockets */
  websocketTimeout: number;
  
  /** Configuration des retries */
  maxRetryAttempts: number;
  retryDelay: number;
  exponentialBackoff: boolean;
  
  /** Configuration du health check RPC */
  rpcHealthCheck: {
    enabled: boolean;
    interval: number;
    maxFailures: number;
  };
  
  /** URL de l'explorateur blockchain */
  explorerUrl: string;
  /** Configuration du slippage */
  slippage: {
    /** Slippage par défaut en basis points */
    defaultBps: number;
    /** Slippage maximum en basis points */
    maxBps: number;
    /** Slippage minimum en basis points */
    minBps: number;
    /** Presets de slippage */
    presets: number[];
  };
  /** Configuration des priority fees */
  priorityFee: {
    /** Fee par défaut */
    default: number;
    /** Fee maximum */
    max: number;
    /** Multiplicateur pour les fees dynamiques */
    multiplier: number;
    /** Stratégie par défaut */
    strategy: 'auto' | 'low' | 'medium' | 'high' | 'custom';
    /** Niveaux de fees */
    levels: {
      low: number;
      medium: number;
      high: number;
    };
  };
  /** Fees de plateforme en basis points */
  platformFeeBps: number;
  /** Adresse du wallet de service */
  serviceWallet: string;
  /** Configuration de la récupération des fees */
  feeRecovery: {
    /** Activation de la récupération */
    enabled: boolean;
    /** Wallet de service */
    serviceWallet: string;
    /** Pourcentage de récupération */
    recoveryPercentage: number;
    /** Seuil minimum en USD */
    minThreshold: number;
  };
  /** Feature flags */
  featureFlags: {
    /** Activation des optimisations */
    optimizationEnabled: boolean;
    /** Activation des priority fees */
    priorityFeesEnabled: boolean;
    /** Activation de l'historique */
    historyEnabled: boolean;
    /** Activation des analytics */
    analyticsEnabled: boolean;
  };
  
  /** Configuration des optimisations */
  optimizations: {
    /** Activation des optimisations */
    enabled: boolean;
    /** Type d'optimisation */
    type: 'standard' | 'advanced';
  };
  
  /** Configuration de la simulation de transaction */
  simulateTransaction: boolean;
}

// =============================================================================
// TYPES POUR L'INTERFACE UTILISATEUR
// =============================================================================

/**
 * État de l'interface de swap
 */
export interface SwapState {
  /** Token d'entrée */
  inputToken: Token | null;
  /** Token de sortie */
  outputToken: Token | null;
  /** Montant d'entrée */
  inputAmount: string;
  /** Montant de sortie */
  outputAmount: string;
  /** Quote actuel */
  currentQuote: QuoteResponse | null;
  /** Statut du chargement du quote */
  quoteStatus: AsyncStatus;
  /** Slippage en basis points */
  slippage: number;
  /** Configuration des priority fees */
  priorityFeeConfig: PriorityFeeConfig;
  /** Activation des optimisations */
  optimizationsEnabled: boolean;
  /** Dernière erreur */
  lastError: string | null;
  /** Dernière optimisation appliquée */
  lastOptimization: OptimizationResult | null;
  /** Statut du swap */
  swapStatus: AsyncStatus;
  /** Résultat du swap */
  swapResult: TransactionResult | null;
}

/**
 * État du wallet
 */
export interface WalletState {
  /** Wallet connecté */
  connected: boolean;
  /** Adresse publique */
  publicKey: PublicKey | null;
  /** Nom du wallet */
  walletName: string | null;
  /** Soldes des tokens */
  balances: Record<string, TokenBalance>;
  /** Statut de chargement des soldes */
  balancesLoading: boolean;
  /** Dernière mise à jour des soldes */
  lastBalanceUpdate: Timestamp | null;
}

/**
 * Paramètres utilisateur
 */
export interface UserSettings {
  /** Slippage par défaut */
  defaultSlippage: number;
  /** Stratégie de priority fee par défaut */
  defaultPriorityFeeStrategy: PriorityFeeConfig['strategy'];
  /** Activation des optimisations automatiques */
  autoOptimizationsEnabled: boolean;
  /** Activation des notifications */
  notificationsEnabled: boolean;
  /** Mode expert activé */
  expertModeEnabled: boolean;
  /** Thème de l'interface */
  theme: 'light' | 'dark' | 'auto';
  /** Devise d'affichage */
  displayCurrency: 'USD' | 'EUR' | 'SOL';
  /** Langue de l'interface */
  language: 'en' | 'fr' | 'es' | 'de';
}

// =============================================================================
// TYPES POUR LES ERREURS
// =============================================================================

/**
 * Types d'erreurs de l'application
 */
export type ErrorType = 
  | 'network'
  | 'wallet'
  | 'transaction'
  | 'validation'
  | 'api'
  | 'unknown';

/**
 * Interface pour les erreurs de l'application
 */
export interface AppError {
  /** Type d'erreur */
  type: ErrorType;
  /** Code d'erreur */
  code: string;
  /** Message d'erreur */
  message: string;
  /** Détails additionnels */
  details?: Record<string, any>;
  /** Timestamp de l'erreur */
  timestamp: Timestamp;
  /** Stack trace (en développement) */
  stack?: string;
}

// =============================================================================
// TYPES POUR LES ANALYTICS
// =============================================================================

/**
 * Métriques d'utilisation
 */
export interface UsageMetrics {
  /** Nombre total de swaps */
  totalSwaps: number;
  /** Volume total en USD */
  totalVolumeUsd: number;
  /** Économies totales réalisées */
  totalSavingsUsd: number;
  /** Temps moyen de transaction */
  averageTransactionTime: number;
  /** Taux de succès des transactions */
  successRate: number;
  /** Dernière mise à jour */
  lastUpdated: Timestamp;
}

/**
 * Données pour les graphiques
 */
export interface ChartData {
  /** Données de volume par jour */
  dailyVolume: Array<{
    date: string;
    volume: number;
    savings: number;
  }>;
  /** Répartition par token */
  tokenDistribution: Array<{
    token: string;
    percentage: number;
    volume: number;
  }>;
  /** Évolution des économies */
  savingsEvolution: Array<{
    date: string;
    slippageSavings: number;
    feeSavings: number;
    totalSavings: number;
  }>;
}

// Tous les types sont déjà exportés directement avec le mot-clé export dans leurs déclarations

