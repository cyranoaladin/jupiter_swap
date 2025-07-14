/**
 * Déclarations de types pour le service RPC Manager
 * 
 * Ce fichier contient les déclarations de types nécessaires pour le service RPC Manager
 */

import { Connection, ConnectionConfig, Commitment } from '@solana/web3.js';

/**
 * Statut de santé d'un endpoint RPC
 */
export interface EndpointHealth {
  url: string;
  isHealthy: boolean;
  averageLatency: number;
  successRate: number;
  consecutiveErrors: number;
  lastChecked: number;
  lastError?: number;
  lastErrorMessage?: string;
}

/**
 * Métriques de performance d'un endpoint
 */
export interface EndpointMetrics {
  totalRequests: number;
  successfulRequests: number;
  totalResponseTime: number;
  lastUpdated: number;
}

/**
 * Configuration du gestionnaire RPC
 */
export interface RpcManagerConfig {
  timeout: number;
  maxConsecutiveErrors: number;
  healthCheckInterval: number;
  quarantineDuration: number;
  commitment: Commitment;
}

/**
 * Gestionnaire RPC intelligent avec fallback et monitoring
 */
export class RpcManager {
  constructor(config?: Partial<RpcManagerConfig>);
  
  /**
   * Exécute une requête avec fallback automatique
   */
  executeWithFallback<T>(operation: (connection: Connection) => Promise<T>, maxRetries?: number): Promise<T>;
  
  /**
   * Récupère la connexion principale (meilleur endpoint)
   */
  getPrimaryConnection(): Connection;
  
  /**
   * Récupère toutes les connexions disponibles
   */
  getAllConnections(): Connection[];
  
  /**
   * Récupère les métriques de santé de tous les endpoints
   */
  getHealthMetrics(): EndpointHealth[];
  
  /**
   * Force une vérification de santé immédiate
   */
  forceHealthCheck(): Promise<void>;
  
  /**
   * Arrête le monitoring de santé
   */
  destroy(): void;
}

/**
 * Récupère l'instance singleton du gestionnaire RPC
 */
export function getRpcManager(): RpcManager;

/**
 * Initialise le gestionnaire RPC avec une configuration personnalisée
 */
export function initializeRpcManager(config?: Partial<RpcManagerConfig>): RpcManager;

/**
 * Détruit l'instance singleton du gestionnaire RPC
 */
export function destroyRpcManager(): void;
