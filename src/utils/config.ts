/**
 * Configuration centralisée pour Jupiter Swap DApp
 * 
 * Ce fichier contient toute la configuration de l'application avec :
 * - Validation des variables d'environnement
 * - Configuration par défaut robuste
 * - Gestion des endpoints RPC avec fallback
 * - Configuration des optimisations
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import type { AppConfig } from '@/types';
import {
  JUPITER_API_BASE_URL,
  JUPITER_API_TIMEOUT,
  DEFAULT_SLIPPAGE_BPS,
  MAX_SLIPPAGE_BPS,
  DEFAULT_PRIORITY_FEE,
  MAX_PRIORITY_FEE,
  PRIORITY_FEE_LEVELS,
  SERVICE_FEE_PERCENTAGE,
  MIN_SAVINGS_THRESHOLD,
  EXPLORER_URLS,
} from '@/constants';

// =============================================================================
// VALIDATION DES VARIABLES D'ENVIRONNEMENT
// =============================================================================

/**
 * Valide et récupère une variable d'environnement requise
 */
// Exporté pour permettre son utilisation dans d'autres modules si nécessaire
export function getRequiredEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    console.warn(`⚠️ Variable d'environnement manquante: ${name}`);
    if (!defaultValue) {
      throw new Error(`Variable d'environnement requise manquante: ${name}`);
    }
  }
  return value || '';
}

/**
 * Fonction utilitaire pour récupérer une variable d'environnement optionnelle
 */
const getOptionalEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

/**
 * Fonction utilitaire pour valider la stratégie de priority fee
 */
const validatePriorityFeeStrategy = (strategy: string): 'auto' | 'low' | 'medium' | 'high' | 'custom' => {
  const validStrategies = ['auto', 'low', 'medium', 'high', 'custom'];
  if (validStrategies.includes(strategy)) {
    return strategy as 'auto' | 'low' | 'medium' | 'high' | 'custom';
  }
  console.warn(`Stratégie de priority fee invalide: ${strategy}. Utilisation de 'auto' par défaut.`);
  return 'auto';
};

/**
 * Valide et récupère une variable d'environnement booléenne
 */
function getBooleanEnvVar(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

/**
 * Valide et récupère une variable d'environnement numérique
 */
function getNumberEnvVar(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// =============================================================================
// CONFIGURATION DES ENDPOINTS RPC
// =============================================================================

/**
 * Récupère la clé API Helius avec validation
 */
function getHeliusApiKey(): string | null {
  // Utiliser la vraie clé API fournie dans .env.local
  const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY || 
                 process.env.HELIUS_API_KEY || 
                 'd94d81dd-f2a1-40f7-920d-0dfaf3aaf032';
  
  if (!apiKey || apiKey === 'your_helius_api_key_here') {
    console.warn('⚠️ Helius API key not configured. Using public endpoints only.');
    return null;
  }
  return apiKey;
}

/**
 * Construit l'URL RPC Helius si la clé API est disponible
 */
function buildHeliusRpcUrl(): string | null {
  const apiKey = getHeliusApiKey();
  if (!apiKey) return null;
  
  const network = getOptionalEnvVar('NEXT_PUBLIC_SOLANA_NETWORK', 'mainnet-beta');
  const baseUrl = network === 'devnet' 
    ? 'https://devnet.helius-rpc.com' 
    : 'https://mainnet.helius-rpc.com';
  
  return `${baseUrl}/?api-key=${apiKey}`;
}

/**
 * Liste des endpoints RPC avec priorité et fallbacks
 */
function getRpcEndpoints(): string[] {
  const endpoints: string[] = [];
  
  // 1. Endpoint RPC personnalisé (priorité la plus haute)
  const customRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  if (customRpcUrl && customRpcUrl !== 'your_custom_rpc_url_here') {
    // Validation de l'URL personnalisée
    try {
      new URL(customRpcUrl);
      endpoints.push(customRpcUrl);
    } catch (error) {
      console.warn('⚠️ URL RPC personnalisée invalide:', customRpcUrl);
    }
  }
  
  // 2. Endpoint Helius (si clé API disponible)
  const heliusUrl = buildHeliusRpcUrl();
  if (heliusUrl) {
    endpoints.push(heliusUrl);
  }
  
  // 3. Endpoint Alchemy avec clé API fournie
  const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 
                       process.env.ALCHEMY_API_KEY || 
                       'UvOk23LRlqGz1m58VCEd3PJ2ZOX2h9KM';
  if (alchemyApiKey && alchemyApiKey !== 'your_alchemy_api_key_here') {
    endpoints.push(`https://solana-mainnet.g.alchemy.com/v2/${alchemyApiKey}`);
  }
  
  // 4. Endpoint Eclipse Helius (gratuit, sans clé)
  endpoints.push('https://eclipse.helius-rpc.com/');
  
  // 5. Endpoints de fallback spécifiés dans les variables d'environnement
  const fallbackUrls = process.env.NEXT_PUBLIC_FALLBACK_RPC_URLS;
  if (fallbackUrls) {
    try {
      const parsedUrls = JSON.parse(fallbackUrls);
      if (Array.isArray(parsedUrls)) {
        // Valider chaque URL avant de l'ajouter
        parsedUrls.forEach(url => {
          try {
            new URL(url);
            endpoints.push(url);
          } catch (error) {
            console.warn('⚠️ Invalid fallback RPC URL:', url);
          }
        });
      }
    } catch (error) {
      console.warn('⚠️ Invalid format for NEXT_PUBLIC_FALLBACK_RPC_URLS:', error);
    }
  }
  
  // 5. Ajouter GenesysGo comme fallback supplémentaire (nécessite une clé API)
  const genesysGoApiKey = process.env.NEXT_PUBLIC_GENESYSGO_API_KEY;
  if (genesysGoApiKey && genesysGoApiKey !== 'your_genesysgo_api_key_here') {
    endpoints.push(`https://ssc-dao.genesysgo.net/?api-key=${genesysGoApiKey}`);
  }
  
  // Ajout de l'endpoint Eclipse partagé de Helius comme fallback supplémentaire
  const eclipseUrl = process.env.NEXT_PUBLIC_HELIUS_SHARED_ECLIPSE_URL;
  if (eclipseUrl && eclipseUrl !== 'your_eclipse_url_here') {
    try {
      new URL(eclipseUrl);
      endpoints.push(eclipseUrl);
    } catch (error) {
      console.warn('⚠️ URL Eclipse Helius invalide:', eclipseUrl);
    }
  }
  
  // Validation : au moins un endpoint doit être disponible
  if (endpoints.length === 0) {
    throw new Error('Aucun endpoint RPC valide configuré');
  }
  
  console.log(`✅ ${endpoints.length} endpoint(s) RPC configuré(s):`, endpoints.map(url => {
    // Masquer les clés API dans les logs
    return url.replace(/api-key=[^&]+/, 'api-key=***');
  }));
  
  return endpoints;
}

// =============================================================================
// CONFIGURATION DU WALLET DE SERVICE
// =============================================================================

/**
 * Valide et récupère l'adresse du wallet de service
 */
function getServiceWallet(): string {
  const serviceWallet = getOptionalEnvVar(
    'NEXT_PUBLIC_SERVICE_WALLET',
    'GG4ffTkW8RHHdLUVNQWcLoNLtL245k16QuRRU5jeBTL1' // Wallet par défaut (à remplacer)
  );
  
  // Validation basique de l'adresse Solana
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(serviceWallet)) {
    console.warn('⚠️ Adresse du wallet de service invalide:', serviceWallet);
    throw new Error('Adresse du wallet de service invalide');
  }
  
  // Avertissement si le wallet par défaut est utilisé et qu'on n'est pas en mode production
  if (serviceWallet === 'GG4ffTkW8RHHdLUVNQWcLoNLtL245k16QuRRU5jeBTL1' && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ Utilisation du wallet de service par défaut. Configurez NEXT_PUBLIC_SERVICE_WALLET en production.');
  }
  
  return serviceWallet;
}

// =============================================================================
// CONFIGURATION PRINCIPALE
// =============================================================================

/**
 * Configuration principale de l'application
 * Toutes les valeurs sont validées et ont des fallbacks appropriés
 */
export const appConfig: AppConfig = {
  // Configuration des endpoints RPC
  rpcEndpoints: getRpcEndpoints(),
  
  // Configuration Jupiter API
  jupiterApiUrl: getOptionalEnvVar('NEXT_PUBLIC_JUPITER_API_URL', JUPITER_API_BASE_URL),
  
  // Timeout pour les requêtes API et transactions
  apiTimeout: getNumberEnvVar('NEXT_PUBLIC_API_TIMEOUT', JUPITER_API_TIMEOUT),
  rpcTimeout: getNumberEnvVar('NEXT_PUBLIC_RPC_TIMEOUT', 15000),
  transactionTimeout: getNumberEnvVar('NEXT_PUBLIC_TRANSACTION_TIMEOUT', 180000),
  websocketTimeout: getNumberEnvVar('NEXT_PUBLIC_WEBSOCKET_TIMEOUT', 45000),
  
  // Configuration des retries
  maxRetryAttempts: getNumberEnvVar('NEXT_PUBLIC_MAX_RETRY_ATTEMPTS', 3),
  retryDelay: getNumberEnvVar('NEXT_PUBLIC_RETRY_DELAY', 1000),
  exponentialBackoff: getBooleanEnvVar('NEXT_PUBLIC_EXPONENTIAL_BACKOFF', true),
  
  // Configuration du health check RPC
  rpcHealthCheck: {
    enabled: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_RPC_HEALTH_CHECK', true),
    interval: getNumberEnvVar('NEXT_PUBLIC_RPC_HEALTH_CHECK_INTERVAL', 30000),
    maxFailures: getNumberEnvVar('NEXT_PUBLIC_MAX_RPC_FAILURES', 3),
  },
  
  // URL de l'explorateur blockchain
  explorerUrl: getOptionalEnvVar('NEXT_PUBLIC_EXPLORER_URL', EXPLORER_URLS.solscan),
  
  // Configuration du slippage
  slippage: {
    defaultBps: getNumberEnvVar('NEXT_PUBLIC_DEFAULT_SLIPPAGE_BPS', DEFAULT_SLIPPAGE_BPS),
    maxBps: getNumberEnvVar('NEXT_PUBLIC_MAX_SLIPPAGE_BPS', MAX_SLIPPAGE_BPS),
    minBps: getNumberEnvVar('NEXT_PUBLIC_MIN_SLIPPAGE_BPS', 10),
    presets: [10, 25, 50, 100, 200, 300], // Presets fixes pour la cohérence
  },
  
  // Configuration des priority fees
  priorityFee: {
    default: getNumberEnvVar('NEXT_PUBLIC_DEFAULT_PRIORITY_FEE', DEFAULT_PRIORITY_FEE),
    max: getNumberEnvVar('NEXT_PUBLIC_MAX_PRIORITY_FEE', MAX_PRIORITY_FEE),
    multiplier: getNumberEnvVar('NEXT_PUBLIC_PRIORITY_FEE_MULTIPLIER', 1.5),
    strategy: validatePriorityFeeStrategy(getOptionalEnvVar('NEXT_PUBLIC_PRIORITY_FEE_STRATEGY', 'auto')),
    levels: {
      low: PRIORITY_FEE_LEVELS.LOW,
      medium: PRIORITY_FEE_LEVELS.MEDIUM,
      high: PRIORITY_FEE_LEVELS.HIGH,
    },
  },
  
  // Fees de plateforme (non utilisés actuellement)
  platformFeeBps: 0,
  
  // Wallet de service pour la récupération des économies
  serviceWallet: getServiceWallet(),
  
  // Configuration de la récupération des fees
  feeRecovery: {
    enabled: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_FEE_RECOVERY', true),
    serviceWallet: getServiceWallet(),
    recoveryPercentage: getNumberEnvVar('NEXT_PUBLIC_SERVICE_FEE_PERCENTAGE', SERVICE_FEE_PERCENTAGE),
    minThreshold: getNumberEnvVar('NEXT_PUBLIC_MIN_SAVINGS_THRESHOLD', MIN_SAVINGS_THRESHOLD),
  },
  
  // Feature flags pour activer/désactiver des fonctionnalités
  featureFlags: {
    optimizationEnabled: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_OPTIMIZATIONS', true),
    priorityFeesEnabled: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_PRIORITY_FEES', true),
    historyEnabled: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_HISTORY', true),
    analyticsEnabled: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', true),
  },
  
  // Configuration des optimisations
  optimizations: {
    enabled: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_OPTIMIZATIONS', true),
    type: getOptionalEnvVar('NEXT_PUBLIC_OPTIMIZATION_TYPE', 'standard') as 'standard' | 'advanced',
  },
  
  // Configuration de la simulation de transaction
  simulateTransaction: getBooleanEnvVar('NEXT_PUBLIC_SIMULATE_TRANSACTION', true),
};

// =============================================================================
// CONFIGURATION SPÉCIFIQUE À L'ENVIRONNEMENT
// =============================================================================

/**
 * Configuration pour le développement
 */
export const developmentConfig = {
  enableDebugLogs: true,
  enableReactQueryDevtools: true,
  simulationMode: false,
  mockTransactions: false,
};

/**
 * Configuration pour la production
 */
export const productionConfig = {
  enableDebugLogs: false,
  enableReactQueryDevtools: false,
  simulationMode: false,
  mockTransactions: false,
};

/**
 * Configuration active selon l'environnement
 */
export const envConfig = process.env.NODE_ENV === 'production' 
  ? productionConfig 
  : developmentConfig;

// =============================================================================
// UTILITAIRES DE CONFIGURATION
// =============================================================================

/**
 * Vérifie si une fonctionnalité est activée
 */
export function isFeatureEnabled(feature: keyof typeof appConfig.featureFlags): boolean {
  return appConfig.featureFlags[feature];
}

/**
 * Récupère l'endpoint RPC principal
 */
export function getPrimaryRpcEndpoint(): string {
  return appConfig.rpcEndpoints[0] || '';
}

/**
 * Récupère tous les endpoints RPC de fallback
 */
export function getFallbackRpcEndpoints(): string[] {
  return appConfig.rpcEndpoints.slice(1);
}

/**
 * Construit l'URL de l'explorateur pour une transaction
 */
export function getExplorerUrl(signature: string, cluster?: string): string {
  const baseUrl = appConfig.explorerUrl;
  const clusterParam = cluster && cluster !== 'mainnet-beta' ? `?cluster=${cluster}` : '';
  return `${baseUrl}/tx/${signature}${clusterParam}`;
}

/**
 * Construit l'URL de l'explorateur pour une adresse
 */
export function getExplorerAddressUrl(address: string, cluster?: string): string {
  const baseUrl = appConfig.explorerUrl;
  const clusterParam = cluster && cluster !== 'mainnet-beta' ? `?cluster=${cluster}` : '';
  return `${baseUrl}/address/${address}${clusterParam}`;
}

/**
 * Valide la configuration au démarrage de l'application
 */
export function validateConfig(): void {
  console.log('🔧 Validation de la configuration...');
  
  // Vérification des endpoints RPC
  if (appConfig.rpcEndpoints.length === 0) {
    throw new Error('Aucun endpoint RPC configuré');
  }
  
  // Vérification de l'URL Jupiter API
  try {
    new URL(appConfig.jupiterApiUrl);
  } catch (error) {
    throw new Error(`URL Jupiter API invalide: ${appConfig.jupiterApiUrl}`);
  }
  
  // Vérification du wallet de service
  if (!appConfig.serviceWallet) {
    throw new Error('Wallet de service non configuré');
  }
  
  // Vérification des valeurs de slippage
  if (appConfig.slippage.defaultBps > appConfig.slippage.maxBps) {
    throw new Error('Slippage par défaut supérieur au maximum autorisé');
  }
  
  // Vérification des priority fees
  if (appConfig.priorityFee.default > appConfig.priorityFee.max) {
    throw new Error('Priority fee par défaut supérieur au maximum autorisé');
  }
  
  console.log('✅ Configuration validée avec succès');
  
  // Affichage des informations de configuration en mode développement
  if (process.env.NODE_ENV === 'development') {
    console.log('📋 Configuration active:', {
      rpcEndpoints: appConfig.rpcEndpoints.length,
      jupiterApiUrl: appConfig.jupiterApiUrl,
      serviceWallet: appConfig.serviceWallet.slice(0, 8) + '...',
      featureFlags: appConfig.featureFlags,
    });
  }
}

// =============================================================================
// FIN DU FICHIER
// =============================================================================

