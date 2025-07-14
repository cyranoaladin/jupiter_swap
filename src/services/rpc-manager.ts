/**
 * Gestionnaire RPC intelligent pour Jupiter Swap DApp
 * 
 * Ce service gère la connectivité avec la blockchain Solana en utilisant :
 * - Sélection automatique du meilleur endpoint
 * - Fallback intelligent en cas de défaillance
 * - Monitoring de santé des endpoints
 * - Load balancing basé sur les performances
 * - Circuit breaker pour éviter les endpoints défaillants
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import { Connection, ConnectionConfig, Commitment } from '@solana/web3.js';
import { appConfig } from '@/utils/config';
import { RpcError, logError } from './errors';

// =============================================================================
// TYPES ET INTERFACES
// =============================================================================

/**
 * Statut de santé d'un endpoint RPC
 */
export interface EndpointHealth {
  /** URL de l'endpoint */
  url: string;
  /** Indique si l'endpoint est disponible */
  isHealthy: boolean;
  /** Latence moyenne en millisecondes */
  averageLatency: number;
  /** Taux de succès (0-1) */
  successRate: number;
  /** Nombre d'erreurs consécutives */
  consecutiveErrors: number;
  /** Timestamp de la dernière vérification */
  lastChecked: number;
  /** Timestamp de la dernière erreur */
  lastError?: number;
  /** Message de la dernière erreur */
  lastErrorMessage?: string;
}

/**
 * Métriques de performance d'un endpoint
 */
export interface EndpointMetrics {
  /** Nombre total de requêtes */
  totalRequests: number;
  /** Nombre de requêtes réussies */
  successfulRequests: number;
  /** Temps de réponse total cumulé */
  totalResponseTime: number;
  /** Dernière mise à jour des métriques */
  lastUpdated: number;
}

/**
 * Configuration du gestionnaire RPC
 */
export interface RpcManagerConfig {
  /** Timeout pour les requêtes en millisecondes */
  timeout: number;
  /** Nombre maximum d'erreurs consécutives avant de marquer un endpoint comme défaillant */
  maxConsecutiveErrors: number;
  /** Intervalle de vérification de santé en millisecondes */
  healthCheckInterval: number;
  /** Durée de mise en quarantaine d'un endpoint défaillant */
  quarantineDuration: number;
  /** Commitment level par défaut */
  commitment: Commitment;
}

// =============================================================================
// GESTIONNAIRE RPC PRINCIPAL
// =============================================================================

/**
 * Gestionnaire RPC intelligent avec fallback et monitoring
 */
export class RpcManager {
  private endpoints: string[];
  private connections: Map<string, Connection> = new Map();
  private health: Map<string, EndpointHealth> = new Map();
  private metrics: Map<string, EndpointMetrics> = new Map();
  private config: RpcManagerConfig;
  private healthCheckTimer: NodeJS.Timeout | undefined;

  constructor(config?: Partial<RpcManagerConfig>) {
    this.endpoints = appConfig.rpcEndpoints;
    this.config = {
      timeout: appConfig.rpcTimeout,
      maxConsecutiveErrors: appConfig.rpcHealthCheck.maxFailures,
      healthCheckInterval: appConfig.rpcHealthCheck.interval,
      quarantineDuration: 300000, // 5 minutes (valeur fixe)
      commitment: 'confirmed',
      ...config,
    };

    this.initializeEndpoints();
    this.startHealthChecking();
  }

  /**
   * Initialise les endpoints et leurs métriques
   */
  private initializeEndpoints(): void {
    console.log(`🔗 Initialisation de ${this.endpoints.length} endpoint(s) RPC`);

    for (const url of this.endpoints) {
      // Créer la connexion avec configuration optimisée
      const connection = new Connection(url, {
        commitment: this.config.commitment,
        confirmTransactionInitialTimeout: this.config.timeout,
        disableRetryOnRateLimit: false,
        httpHeaders: {
          'Content-Type': 'application/json',
        },
      } as ConnectionConfig);

      this.connections.set(url, connection);

      // Initialiser les métriques de santé
      this.health.set(url, {
        url,
        isHealthy: true,
        averageLatency: 0,
        successRate: 1,
        consecutiveErrors: 0,
        lastChecked: Date.now(),
      });

      // Initialiser les métriques de performance
      this.metrics.set(url, {
        totalRequests: 0,
        successfulRequests: 0,
        totalResponseTime: 0,
        lastUpdated: Date.now(),
      });
    }

    console.log('✅ Endpoints RPC initialisés');
  }

  /**
   * Démarre le monitoring de santé des endpoints
   */
  private startHealthChecking(): void {
    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);

    // Vérification initiale
    this.performHealthCheck();
  }

  /**
   * Effectue une vérification de santé sur tous les endpoints
   */
  private async performHealthCheck(): Promise<void> {
    console.log('🔍 Vérification de santé des endpoints RPC...');

    const healthPromises = this.endpoints.map(async (url) => {
      const startTime = Date.now();
      const health = this.health.get(url)!;

      try {
        const connection = this.connections.get(url)!;
        
        // Test simple : récupérer la dernière hauteur de bloc
        await connection.getSlot();
        
        const latency = Date.now() - startTime;
        
        // Mettre à jour les métriques de santé
        health.isHealthy = true;
        health.averageLatency = (health.averageLatency + latency) / 2;
        health.consecutiveErrors = 0;
        health.lastChecked = Date.now();
        
        console.log(`✅ ${this.maskUrl(url)}: ${latency}ms`);
        
      } catch (error) {
        health.isHealthy = false;
        health.consecutiveErrors++;
        health.lastChecked = Date.now();
        health.lastError = Date.now();
        health.lastErrorMessage = error instanceof Error ? error.message : String(error);
        
        console.warn(`❌ ${this.maskUrl(url)}: ${health.lastErrorMessage}`);
        
        // Marquer comme défaillant si trop d'erreurs consécutives
        if (health.consecutiveErrors >= this.config.maxConsecutiveErrors) {
          console.warn(`🚫 Endpoint ${this.maskUrl(url)} marqué comme défaillant`);
        }
      }
    });

    await Promise.allSettled(healthPromises);
    
    // Afficher le résumé de santé
    this.logHealthSummary();
  }

  /**
   * Masque les clés API dans les URLs pour les logs
   */
  private maskUrl(url: string): string {
    return url.replace(/api-key=[^&]+/, 'api-key=***');
  }

  /**
   * Affiche un résumé de la santé des endpoints
   */
  private logHealthSummary(): void {
    const healthyCount = Array.from(this.health.values()).filter(h => h.isHealthy).length;
    const totalCount = this.health.size;
    
    console.log(`📊 Santé RPC: ${healthyCount}/${totalCount} endpoints disponibles`);
    
    if (healthyCount === 0) {
      console.error('🚨 CRITIQUE: Aucun endpoint RPC disponible !');
    } else if (healthyCount < totalCount) {
      console.warn(`⚠️ ${totalCount - healthyCount} endpoint(s) indisponible(s)`);
    }
  }

  /**
   * Sélectionne le meilleur endpoint disponible
   */
  private selectBestEndpoint(): string {
    const healthyEndpoints = this.endpoints.filter(url => {
      const health = this.health.get(url)!;
      
      // Vérifier si l'endpoint est en quarantaine
      if (!health.isHealthy && health.lastError) {
        const timeSinceError = Date.now() - health.lastError;
        if (timeSinceError < this.config.quarantineDuration) {
          return false; // Encore en quarantaine
        }
        // Sortir de quarantaine et réessayer
        health.isHealthy = true;
        health.consecutiveErrors = 0;
      }
      
      return health.isHealthy;
    });

    if (healthyEndpoints.length === 0) {
      // Aucun endpoint sain, utiliser le premier disponible en mode dégradé
      console.warn('⚠️ Aucun endpoint sain, utilisation en mode dégradé');
      // Vérification que le tableau n'est pas vide et fourniture d'une valeur par défaut
      if (this.endpoints.length === 0) {
        throw new RpcError('NO_ENDPOINTS', 'Aucun endpoint RPC disponible');
      }
      return this.endpoints[0]!;
    }

    // Sélectionner l'endpoint avec la meilleure performance
    let bestEndpoint = healthyEndpoints[0];
    let bestScore = 0;

    for (const url of healthyEndpoints) {
      const health = this.health.get(url)!;
      const metrics = this.metrics.get(url)!;
      
      // Calculer la latence moyenne à partir des métriques disponibles
      const averageLatency = metrics.totalRequests > 0 ? metrics.totalResponseTime / metrics.totalRequests : 0;
      const latencyScore = 1 - (Math.min(averageLatency, 500) / 500);
      const successScore = health.successRate;
      const score = (latencyScore * 0.3) + (successScore * 0.7);
      
      if (score > bestScore) {
        bestScore = score;
        bestEndpoint = url;
      }
    }

    // Nous avons vérifié que healthyEndpoints n'est pas vide, donc bestEndpoint est défini
    return bestEndpoint!;
  }

  /**
   * Met à jour les métriques d'un endpoint après une requête
   */
  private updateMetrics(url: string, success: boolean, responseTime: number): void {
    const metrics = this.metrics.get(url);
    const health = this.health.get(url);
    
    if (!metrics || !health) return;

    metrics.totalRequests++;
    metrics.totalResponseTime += responseTime;
    metrics.lastUpdated = Date.now();

    if (success) {
      metrics.successfulRequests++;
      health.consecutiveErrors = 0;
    } else {
      health.consecutiveErrors++;
    }

    // Recalculer le taux de succès et la latence moyenne
    health.successRate = metrics.successfulRequests / metrics.totalRequests;
    health.averageLatency = metrics.totalResponseTime / metrics.totalRequests;
  }

  /**
   * Exécute une requête avec fallback automatique
   */
  public async executeWithFallback<T>(
    operation: (connection: Connection) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error;
    let attemptCount = 0;

    while (attemptCount < maxRetries) {
      const endpointUrl = this.selectBestEndpoint();
      const connection = this.connections.get(endpointUrl)!;
      const startTime = Date.now();

      try {
        const result = await operation(connection);
        const responseTime = Date.now() - startTime;
        
        // Mettre à jour les métriques de succès
        this.updateMetrics(endpointUrl, true, responseTime);
        
        return result;
        
      } catch (error) {
        const responseTime = Date.now() - startTime;
        lastError = error as Error;
        
        // Mettre à jour les métriques d'échec
        this.updateMetrics(endpointUrl, false, responseTime);
        
        // Marquer l'endpoint comme défaillant si erreur critique
        if (this.isCriticalError(error)) {
          const health = this.health.get(endpointUrl)!;
          health.isHealthy = false;
          health.lastError = Date.now();
          health.lastErrorMessage = lastError.message;
        }
        
        attemptCount++;
        
        if (attemptCount < maxRetries) {
          console.warn(`Tentative ${attemptCount} échouée sur ${this.maskUrl(endpointUrl)}, retry...`);
          // Attendre un peu avant de réessayer
          await new Promise(resolve => setTimeout(resolve, 1000 * attemptCount));
        }
      }
    }

    // Toutes les tentatives ont échoué
    logError(lastError!, { 
      operation: 'RPC request',
      attempts: attemptCount,
      endpoints: this.endpoints.length 
    });
    
    throw new RpcError(
      'multiple endpoints',
      `Échec après ${attemptCount} tentatives sur ${this.endpoints.length} endpoints`
    );
  }

  /**
   * Détermine si une erreur est critique et doit marquer l'endpoint comme défaillant
   */
  private isCriticalError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return message.includes('403') || 
             message.includes('unauthorized') ||
             message.includes('forbidden') ||
             message.includes('invalid api key');
    }
    return false;
  }

  /**
   * Récupère la connexion principale (meilleur endpoint)
   */
  public getPrimaryConnection(): Connection {
    const bestEndpoint = this.selectBestEndpoint();
    return this.connections.get(bestEndpoint)!;
  }

  /**
   * Récupère toutes les connexions disponibles
   */
  public getAllConnections(): Connection[] {
    return Array.from(this.connections.values());
  }

  /**
   * Récupère les métriques de santé de tous les endpoints
   */
  public getHealthMetrics(): EndpointHealth[] {
    return Array.from(this.health.values());
  }

  /**
   * Récupère les métriques de performance de tous les endpoints
   */
  public getPerformanceMetrics(): Map<string, EndpointMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Force une vérification de santé immédiate
   */
  public async forceHealthCheck(): Promise<void> {
    await this.performHealthCheck();
  }

  /**
   * Remet à zéro les métriques d'un endpoint spécifique
   */
  public resetEndpointMetrics(url: string): void {
    const health = this.health.get(url);
    const metrics = this.metrics.get(url);
    
    if (health) {
      health.isHealthy = true;
      health.consecutiveErrors = 0;
      health.averageLatency = 0;
      health.successRate = 1;
      health.lastChecked = Date.now();
      delete health.lastError;
      delete health.lastErrorMessage;
    }
    
    if (metrics) {
      metrics.totalRequests = 0;
      metrics.successfulRequests = 0;
      metrics.totalResponseTime = 0;
      metrics.lastUpdated = Date.now();
    }
  }

  /**
   * Arrête le monitoring de santé
   */
  public destroy(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = undefined;
    }
    
    console.log('🔌 Gestionnaire RPC arrêté');
  }
}

// =============================================================================
// INSTANCE SINGLETON
// =============================================================================

/**
 * Instance singleton du gestionnaire RPC
 * Utilisée dans toute l'application pour maintenir la cohérence
 */
let rpcManagerInstance: RpcManager | null = null;

/**
 * Récupère l'instance singleton du gestionnaire RPC
 */
export function getRpcManager(): RpcManager {
  if (!rpcManagerInstance) {
    rpcManagerInstance = new RpcManager();
  }
  return rpcManagerInstance;
}

/**
 * Initialise le gestionnaire RPC avec une configuration personnalisée
 */
export function initializeRpcManager(config?: Partial<RpcManagerConfig>): RpcManager {
  if (rpcManagerInstance) {
    rpcManagerInstance.destroy();
  }
  rpcManagerInstance = new RpcManager(config);
  return rpcManagerInstance;
}

/**
 * Détruit l'instance singleton du gestionnaire RPC
 */
export function destroyRpcManager(): void {
  if (rpcManagerInstance) {
    rpcManagerInstance.destroy();
    rpcManagerInstance = null;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

// Les classes et types sont déjà exportés dans leurs déclarations

