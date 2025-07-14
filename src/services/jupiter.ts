/**
 * Service Jupiter API v6 avec optimisations avancées CONFORMES
 * 
 * CORRECTIONS APPLIQUÉES:
 * - Utilisation native du Dynamic Slippage Jupiter API v6
 * - Implémentation des Platform Fees
 * - Intégration réelle avec le wallet de service
 * - Gestion complète des erreurs de production
 * 
 * @author Manus AI
 * @version 2.0.0 - PRODUCTION READY
 */

import axios, { AxiosInstance } from 'axios';
import { Connection, VersionedTransaction, PublicKey, AddressLookupTableAccount } from '@solana/web3.js';
import type { 
  QuoteResponse, 
  SwapTransactionResponse,
  Token,
  QuoteParams
} from '@/types';
import { appConfig } from '@/utils/config';
import { 
  RetryHandler, 
  RateLimitError, 
  ServerError, 
  QuoteError,
  NoRouteFoundError,
  ApiTimeoutError,
  logError 
} from './errors';
import { getRpcManager } from './rpc-manager';
import { 
  JUPITER_TOKENS_API_URL,
  JUPITER_ENDPOINTS
} from '@/constants';

// =============================================================================
// CONSTANTES CONFORMES JUPITER API V6
// =============================================================================

const DEFAULT_SLIPPAGE_BPS = 50; // 0.5%
const PLATFORM_FEE_BPS = 20; // 0.2% selon le cahier des charges
const SERVICE_WALLET = 'GG4ffTkW8RHHdLUVNQWcLoNLtL245k16QuRRU5jeBTL1';

// =============================================================================
// INTERFACES CONFORMES JUPITER API V6
// =============================================================================

/**
 * Configuration native Jupiter API v6 pour Dynamic Slippage
 */
export interface JupiterDynamicSlippageConfig {
  /** Slippage maximum autorisé */
  maxSlippageBps: number;
  /** Activation du Dynamic Slippage NATIF Jupiter */
  enableDynamicSlippage: boolean;
  /** Niveau de confiance minimum */
  minConfidenceLevel?: number;
}

/**
 * Paramètres conformes Jupiter API v6
 */
export interface JupiterQuoteParams extends QuoteParams {
  /** Platform fee en basis points */
  platformFeeBps?: number;
  /** Wallet pour recevoir les platform fees */
  feeAccount?: string;
  /** Activation du Dynamic Slippage natif */
  dynamicSlippage?: boolean;
  /** Configuration avancée du slippage */
  slippageConfig?: JupiterDynamicSlippageConfig;
}

/**
 * Réponse étendue avec informations d'optimisation
 */
export interface JupiterOptimizedQuoteResponse extends QuoteResponse {
  /** Informations du Dynamic Slippage natif */
  dynamicSlippageReport?: {
    enabled: boolean;
    originalSlippageBps: number;
    optimizedSlippageBps: number;
    confidenceScore: number;
  };
  /** Informations des Platform Fees */
  platformFeeReport?: {
    feeBps: number;
    feeAmount: string;
    feeAccount: string;
  };
}

// =============================================================================
// TYPES ET INTERFACES
// =============================================================================

/**
 * Configuration du service Jupiter
 */
export interface JupiterServiceConfig {
  /** URL de base de l'API */
  baseUrl: string;
  /** Timeout pour les requêtes */
  timeout: number;
  /** Nombre maximum de tentatives */
  maxRetries: number;
  /** Activation du cache */
  enableCache: boolean;
  /** Durée du cache en millisecondes */
  cacheDuration: number;
}

/**
 * Paramètres pour la construction d'une transaction de swap
 */
export interface SwapTransactionParams {
  /** Quote response de Jupiter */
  quoteResponse: QuoteResponse;
  /** Clé publique de l'utilisateur */
  userPublicKey: string;
  /** Activation du wrap/unwrap automatique de SOL */
  wrapAndUnwrapSol?: boolean;
  /** Compte de fees (wallet de service) */
  feeAccount?: string;
  /** Priority fee en microlamports */
  computeUnitPriceMicroLamports?: number;
  /** Limite de compute units */
  computeUnitLimit?: number;
  /** Instructions de setup additionnelles */
  setupInstructions?: string[];
  /** Instructions de cleanup additionnelles */
  cleanupInstructions?: string[];
}

/**
 * Résultat d'optimisation de quote
 */
export interface OptimizedQuoteResult {
  /** Quote optimisé */
  quote: QuoteResponse;
  /** Slippage original demandé */
  originalSlippageBps: number;
  /** Slippage optimisé appliqué */
  optimizedSlippageBps: number;
  /** Économies estimées en tokens de sortie */
  estimatedSavings: string;
  /** Économies estimées en USD */
  estimatedSavingsUsd: number;
  /** Score de confiance de l'optimisation (0-1) */
  confidenceScore: number;
  /** Conditions de marché analysées */
  marketConditions: {
    volatility: number;
    liquidityDepth: number;
    spreadTightness: number;
  };
}

/**
 * Cache entry pour les quotes
 */
interface QuoteCacheEntry {
  quote: QuoteResponse;
  timestamp: number;
  params: QuoteParams;
}

/**
 * Cache entry pour les tokens
 */
interface TokenCacheEntry {
  tokens: Token[];
  timestamp: number;
}

// =============================================================================
// SERVICE JUPITER CONFORME API V6
// =============================================================================

export class JupiterApiService {
  private axiosInstance: AxiosInstance;
  private connection: Connection;
  private config: JupiterServiceConfig;
  private quoteCache: Map<string, QuoteCacheEntry> = new Map();
  private tokenCache: TokenCacheEntry | null = null;

  constructor(config?: Partial<JupiterServiceConfig>) {
    this.config = {
      baseUrl: appConfig.jupiterApiUrl,
      timeout: appConfig.apiTimeout,
      maxRetries: appConfig.maxRetryAttempts,
      enableCache: true,
      cacheDuration: 10000,
      ...config,
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.connection = getRpcManager().getPrimaryConnection();
    this.setupInterceptors();

    console.log('🚀 Service Jupiter API v6 CONFORME initialisé');
  }

  /**
   * Configure les intercepteurs Axios pour le logging et la gestion d'erreurs
   */
  private setupInterceptors(): void {
    // Intercepteur de requête
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`📤 Jupiter API: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logError(error, { context: 'Jupiter API Request' });
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponse
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`📥 Jupiter API: ${response.status} ${response.config.url} (${response.headers['x-response-time'] || 'N/A'})`);
        return response;
      },
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url || 'unknown';
        
        if (status === 429) {
          throw new RateLimitError(
            'Limite de taux Jupiter API atteinte'
          );
        }
        
        if (status >= 500) {
          throw new ServerError(status, url, error.response?.data?.message || error.message);
        }
        
        if (error.code === 'ECONNABORTED') {
          throw new ApiTimeoutError(url, this.config.timeout);
        }
        
        logError(error, { context: 'Jupiter API Response', status, url });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Récupère la liste de tous les tokens supportés par Jupiter
   */
  public async getTokens(forceRefresh = false): Promise<Token[]> {
    // Vérifier le cache si pas de refresh forcé
    if (!forceRefresh && this.tokenCache) {
      const age = Date.now() - this.tokenCache.timestamp;
      if (age < 3600000) { // Cache valide 1 heure
        console.log('📋 Tokens récupérés depuis le cache');
        return this.tokenCache.tokens;
      }
    }

    return RetryHandler.withRetry(async () => {
      try {
        console.log('🔄 Récupération de la liste des tokens...');
        
        const response = await axios.get<Token[]>(JUPITER_TOKENS_API_URL, {
          timeout: this.config.timeout,
        });
        
        const tokens = response.data;
        
        // Mettre à jour le cache
        this.tokenCache = {
          tokens,
          timestamp: Date.now(),
        };
        
        console.log(`✅ ${tokens.length} tokens récupérés`);
        return tokens;
        
      } catch (error) {
        console.error('❌ Échec de récupération des tokens:', error);
        throw this.handleApiError(error, 'getTokens');
      }
    }, { maxAttempts: this.config.maxRetries });
  }

  // Fonction analyzeMarketConditions supprimée car non utilisée

  // Fonction optimizeSlippage supprimée car non utilisée

  /**
   * Récupère un quote basique sans optimisations
   */
  private async getBasicQuote(params: QuoteParams): Promise<QuoteResponse> {
    const response = await this.axiosInstance.get<QuoteResponse>(JUPITER_ENDPOINTS.quote, { 
      params: {
        inputMint: params.inputMint,
        outputMint: params.outputMint,
        amount: params.amount,
        slippageBps: params.slippageBps || DEFAULT_SLIPPAGE_BPS,
        onlyDirectRoutes: params.onlyDirectRoutes || false,
        excludeDexes: params.excludeDexes?.join(','),
        maxAccounts: params.maxAccounts,
      }
    });

    return response.data;
  }

  /**
   * CORRECTION: Récupère un quote avec Dynamic Slippage NATIF Jupiter API v6
   */
  public async getOptimizedQuote(
    params: JupiterQuoteParams
  ): Promise<JupiterOptimizedQuoteResponse> {
    return RetryHandler.withRetry(async () => {
      try {
        console.log(`🔍 Quote avec Dynamic Slippage NATIF Jupiter API v6`);
        
        // Paramètres conformes Jupiter API v6
        const quoteParams = {
          inputMint: params.inputMint,
          outputMint: params.outputMint,
          amount: params.amount,
          slippageBps: params.slippageBps || DEFAULT_SLIPPAGE_BPS,
          
          // CORRECTION: Utilisation native du Dynamic Slippage
          dynamicSlippage: params.dynamicSlippage || true,
          
          // CORRECTION: Ajout des Platform Fees
          platformFeeBps: params.platformFeeBps || PLATFORM_FEE_BPS,
          feeAccount: params.feeAccount || SERVICE_WALLET,
          
          // Options avancées
          onlyDirectRoutes: params.onlyDirectRoutes || false,
          excludeDexes: params.excludeDexes?.join(','),
          maxAccounts: params.maxAccounts || 64,
        };

        const response = await this.axiosInstance.get<JupiterOptimizedQuoteResponse>(
          JUPITER_ENDPOINTS.quote,
          { params: quoteParams }
        );

        const quote = response.data;

        // Calculer les économies réelles basées sur la réponse Jupiter
        const originalSlippageBps = params.slippageBps || DEFAULT_SLIPPAGE_BPS;
        const optimizedSlippageBps = quote.slippageBps;
        const slippageSavings = originalSlippageBps - optimizedSlippageBps;

        // Ajouter les informations d'optimisation
        quote.dynamicSlippageReport = {
          enabled: true,
          originalSlippageBps,
          optimizedSlippageBps,
          confidenceScore: this.calculateConfidenceScore(quote),
        };

        quote.platformFeeReport = {
          feeBps: PLATFORM_FEE_BPS,
          feeAmount: this.calculatePlatformFeeAmount(quote),
          feeAccount: SERVICE_WALLET,
        };

        console.log(`✅ Dynamic Slippage: ${originalSlippageBps} → ${optimizedSlippageBps} bps (économie: ${slippageSavings} bps)`);
        console.log(`💰 Platform Fee: ${PLATFORM_FEE_BPS} bps vers ${SERVICE_WALLET.slice(0, 8)}...`);

        return quote;

      } catch (error) {
        console.error('❌ Échec du quote optimisé:', error);
        throw this.handleApiError(error, 'getOptimizedQuote', {
          inputMint: params.inputMint,
          outputMint: params.outputMint,
          amount: params.amount,
        });
      }
    }, { maxAttempts: this.config.maxRetries });
  }

  /**
   * Récupère un quote standard (avec cache si activé)
   */
  public async getQuote(params: QuoteParams): Promise<QuoteResponse> {
    // Générer une clé de cache
    const cacheKey = this.generateCacheKey(params);
    
    // Vérifier le cache si activé
    if (this.config.enableCache && this.quoteCache.has(cacheKey)) {
      const cached = this.quoteCache.get(cacheKey)!;
      const age = Date.now() - cached.timestamp;
      
      if (age < this.config.cacheDuration) {
        console.log('💾 Quote récupéré depuis le cache');
        return cached.quote;
      } else {
        // Cache expiré, le supprimer
        this.quoteCache.delete(cacheKey);
      }
    }

    return RetryHandler.withRetry(async () => {
      try {
        const quote = await this.getBasicQuote(params);
        
        // Mettre en cache si activé
        if (this.config.enableCache) {
          this.quoteCache.set(cacheKey, {
            quote,
            timestamp: Date.now(),
            params,
          });
          
          // Nettoyer le cache si trop d'entrées
          if (this.quoteCache.size > 100) {
            const oldestKey = this.quoteCache.keys().next().value;
            if (oldestKey) {
              this.quoteCache.delete(oldestKey);
            }
          }
        }
        
        return quote;
        
      } catch (error) {
        throw this.handleApiError(error, 'getQuote', {
          inputMint: params.inputMint,
          outputMint: params.outputMint,
          amount: params.amount,
        });
      }
    }, { maxAttempts: this.config.maxRetries });
  }

  /**
   * CORRECTION: Construction de transaction avec Platform Fees
   */
  public async buildSwapTransaction(
    params: SwapTransactionParams
  ): Promise<SwapTransactionResponse> {
    return RetryHandler.withRetry(async () => {
      try {
        console.log('🔨 Construction transaction avec Platform Fees...');
        
        const requestBody = {
          quoteResponse: params.quoteResponse,
          userPublicKey: params.userPublicKey,
          wrapAndUnwrapSol: params.wrapAndUnwrapSol ?? true,
          
          // CORRECTION: Ajout des Platform Fees
          feeAccount: params.feeAccount || SERVICE_WALLET,
          platformFeeBps: PLATFORM_FEE_BPS,
          
          // Priority fees optimisés
          computeUnitPriceMicroLamports: params.computeUnitPriceMicroLamports,
          computeUnitLimit: params.computeUnitLimit,
          
          // Instructions additionnelles
          setupInstructions: params.setupInstructions,
          cleanupInstructions: params.cleanupInstructions,
        };

        const response = await this.axiosInstance.post<SwapTransactionResponse>(
          JUPITER_ENDPOINTS.swap,
          requestBody
        );

        console.log('✅ Transaction construite avec Platform Fees');
        return response.data;
        
      } catch (error) {
        console.error('❌ Échec construction transaction:', error);
        throw this.handleApiError(error, 'buildSwapTransaction', {
          userPublicKey: params.userPublicKey,
          inputMint: params.quoteResponse.inputMint,
          outputMint: params.quoteResponse.outputMint,
        });
      }
    }, { maxAttempts: this.config.maxRetries });
  }

  /**
   * Désérialise une transaction versionnée
   */
  public async deserializeTransaction(
    serializedTransaction: string
  ): Promise<VersionedTransaction> {
    try {
      const transactionBuffer = Buffer.from(serializedTransaction, 'base64');
      return VersionedTransaction.deserialize(transactionBuffer);
    } catch (error) {
      console.error('❌ Échec de désérialisation de la transaction:', error);
      throw new Error('Impossible de désérialiser la transaction');
    }
  }

  /**
   * Récupère les Address Lookup Tables pour une transaction
   */
  public async getAddressLookupTableAccounts(
    addressLookupTableAddresses: string[]
  ): Promise<AddressLookupTableAccount[]> {
    if (!addressLookupTableAddresses.length) {
      return [];
    }

    try {
      const lookupTableAccounts = await Promise.all(
        addressLookupTableAddresses.map(async (address) => {
          const accountInfo = await this.connection.getAccountInfo(new PublicKey(address));
          if (!accountInfo) {
            throw new Error(`Address Lookup Table non trouvée: ${address}`);
          }
          return new AddressLookupTableAccount({
            key: new PublicKey(address),
            state: AddressLookupTableAccount.deserialize(accountInfo.data),
          });
        })
      );

      return lookupTableAccounts;
    } catch (error) {
      console.error('❌ Échec de récupération des Address Lookup Tables:', error);
      throw error;
    }
  }

  /**
   * Génère une clé de cache pour un quote
   */
  private generateCacheKey(params: QuoteParams): string {
    return `${params.inputMint}-${params.outputMint}-${params.amount}-${params.slippageBps || DEFAULT_SLIPPAGE_BPS}`;
  }

  /**
   * Gère les erreurs de l'API Jupiter
   */
  private handleApiError(error: unknown, operation: string, context?: Record<string, any>): Error {
    // Log l'erreur avec l'opération pour le debugging
    logError(error, { operation, ...context });
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      if (status === 400 && data?.error?.includes('No route found')) {
        return new NoRouteFoundError(
          context?.inputMint || 'unknown',
          context?.outputMint || 'unknown'
        );
      }
      
      if (status === 400) {
        return new QuoteError(
          context?.inputMint || 'unknown',
          context?.outputMint || 'unknown',
          context?.amount || 'unknown',
          data?.error || error.message
        );
      }
    }
    
    return error as Error;
  }

  /**
   * Nettoie les caches
   */
  public clearCache(): void {
    this.quoteCache.clear();
    this.tokenCache = null;
    console.log('🧹 Cache Jupiter nettoyé');
  }

  /**
   * Récupère les statistiques du cache
   */
  public getCacheStats(): { quotes: number; tokens: boolean; networkConditions: boolean } {
    return {
      quotes: this.quoteCache.size,
      tokens: this.tokenCache !== null,
      networkConditions: false,
    };
  }

  /**
   * Calcule le score de confiance basé sur la réponse Jupiter
   */
  private calculateConfidenceScore(quote: JupiterOptimizedQuoteResponse): number {
    // Facteurs pour calculer la confiance
    const priceImpactFactor = 1 - Math.min(0.8, parseFloat(quote.priceImpactPct) / 100);
    const routeComplexityFactor = 1 - Math.min(0.5, quote.routePlan.length / 10);
    const slippageFactor = 1 - Math.min(0.6, quote.slippageBps / 1000);
    
    return Math.max(0.1, Math.min(1.0, (priceImpactFactor + routeComplexityFactor + slippageFactor) / 3));
  }

  /**
   * Calcule le montant des Platform Fees
   */
  private calculatePlatformFeeAmount(quote: JupiterOptimizedQuoteResponse): string {
    const outputAmount = BigInt(quote.outAmount);
    const feeAmount = (outputAmount * BigInt(PLATFORM_FEE_BPS)) / BigInt(10000);
    return feeAmount.toString();
  }
}

// =============================================================================
// INSTANCE SINGLETON
// =============================================================================

let jupiterServiceInstance: JupiterApiService | null = null;

/**
 * Récupère l'instance singleton du service Jupiter
 */
export function getJupiterService(): JupiterApiService {
  if (!jupiterServiceInstance) {
    jupiterServiceInstance = new JupiterApiService();
  }
  return jupiterServiceInstance;
}

/**
 * Initialise le service Jupiter avec une configuration personnalisée
 */
export function initializeJupiterService(config?: Partial<JupiterServiceConfig>): JupiterApiService {
  jupiterServiceInstance = new JupiterApiService(config);
  return jupiterServiceInstance;
}

