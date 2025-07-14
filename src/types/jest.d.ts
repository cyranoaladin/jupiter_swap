/**
 * Déclarations de types pour Jest
 * 
 * Ce fichier contient les déclarations de types nécessaires pour les tests Jest
 * afin de résoudre correctement les imports de modules
 */

// Déclaration pour permettre l'import des services
declare module '@/services/rpc-manager' {
  import { Connection, Commitment } from '@solana/web3.js';
  
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
  
  export interface EndpointMetrics {
    totalRequests: number;
    successfulRequests: number;
    totalResponseTime: number;
    lastUsed: number;
  }
  
  export interface RpcManagerConfig {
    timeout: number;
    maxConsecutiveErrors: number;
    healthCheckInterval: number;
    quarantineDuration: number;
    commitment: Commitment;
  }
  
  export class RpcManager {
    executeWithFallback<T>(operation: (connection: Connection) => Promise<T>, maxRetries?: number): Promise<T>;
    getPrimaryConnection(): Connection;
    getAllConnections(): Connection[];
    getHealthMetrics(): EndpointHealth[];
    forceHealthCheck(): Promise<void>;
    destroy(): void;
  }
  
  export function getRpcManager(): RpcManager;
  export function initializeRpcManager(config?: Partial<RpcManagerConfig>): RpcManager;
  export function destroyRpcManager(): void;
}

declare module '@/services/solana' {
  import { 
    PublicKey, 
    Transaction, 
    VersionedTransaction, 
    TransactionSignature,
    Commitment,
    Signer
  } from '@solana/web3.js';
  // Définition des types utilisés dans les services
  export interface TokenBalance {
    token: Token;
    amount: number;
    rawAmount: string;
    decimals: number;
    usdValue?: number;
    lastUpdated?: number;
  }

  export interface Token {
    address: string;
    chainId?: number;
    name: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
    tags?: string[];
    verified?: boolean;
    mint: string;
  }

  export interface TransactionResult {
    signature: string;
    status: 'confirmed' | 'finalized' | 'processed' | 'failed';
    confirmationBlock?: number;
    confirmationTime?: number;
    error?: string;
  }

  export interface TransactionStatus {
    status: 'confirmed' | 'finalized' | 'processed' | 'failed';
    confirmationBlock?: number;
    confirmationTime?: number;
    error?: string;
  }
  
  export interface SolanaServiceConfig {
    commitment: Commitment;
    confirmationTimeout: number;
    maxRetries: number;
    retryDelay: number;
  }
  
  export class SolanaService {
    getBalance(publicKey: PublicKey): Promise<number>;
    getTokenBalance(publicKey: PublicKey, tokenMint: string | Token): Promise<TokenBalance>;
    getAllTokenBalances(publicKey: PublicKey): Promise<TokenBalance[]>;
    sendTransaction(transaction: Transaction | VersionedTransaction, signers?: Signer[]): Promise<TransactionResult>;
    confirmTransaction(signature: TransactionSignature): Promise<TransactionStatus>;
    getTokenAccountAddress(owner: PublicKey, mint: string): Promise<PublicKey>;
    simulateTransaction(transaction: Transaction | VersionedTransaction): Promise<boolean>;
  }
  
  export function getSolanaService(config?: Partial<SolanaServiceConfig>): SolanaService;
}

declare module '@/services/swap' {
  import { PublicKey, VersionedTransaction } from '@solana/web3.js';
  // Réutilisation des types déjà définis plus haut
  // import type { Token, TransactionResult } from '@/types';

  export interface OptimizationResult {
    slippageSavings: number;
    slippageSavingsUsd?: number;
    priorityFeeSavings: number;
    priorityFeeSavingsUsd?: number;
    totalSavingsUsd?: number;
    totalSavings?: number;
    serviceFee?: number;
    confidenceScore?: number;
    feeRecoveryInstructions?: any[];
  }
  
  export enum SwapStage {
    INIT = 'init',
    QUOTE = 'quote',
    PREPARE = 'prepare',
    SIGN = 'sign',
    SUBMIT = 'submit',
    CONFIRM = 'confirm',
    COMPLETE = 'complete',
    FAILED = 'failed'
  }
  
  export interface SwapParams {
    inputToken: Token;
    outputToken: Token;
    inputAmount: number;
    userPublicKey: PublicKey;
    slippageBps?: number;
    priorityFee?: number;
    useOptimization?: boolean;
    slippageConfig?: {
      baseSlippage?: number;
      optimizationFactor?: number;
      maxSlippageBps?: number;
      enableDynamicOptimization?: boolean;
      marketConditionWeight?: number;
      liquidityDepthWeight?: number;
      minConfidenceLevel?: number;
    };
    priorityFeeConfig?: {
      strategy: string;
    };
    enableOptimizations?: boolean;
    onProgress?: (stage: SwapStage, data?: any) => void;
  }
  
  export interface SwapResult {
    signature: string;
    inputAmount: number;
    outputAmount: number;
    inputToken: Token;
    outputToken: Token;
    optimizationResult?: OptimizationResult;
    optimization?: {
      feeRecoveryInstructions: any[];
      slippageSavings?: number;
      priorityFeeSavings?: number;
      slippageSavingsUsd?: number;
      priorityFeeSavingsUsd?: number;
      totalSavingsUsd?: number;
    };
    transaction?: {
      signature: string;
      status: string;
      confirmationBlock?: number;
      confirmationTime?: number;
    };
    stage: SwapStage;
    error?: Error;
  }
  
  export class SwapService {
    getQuote(params: SwapParams): Promise<any>;
    prepareTransaction(params: SwapParams): Promise<VersionedTransaction>;
    executeSwap(params: SwapParams): Promise<SwapResult>;
    getSwapStatus(signature: string): Promise<SwapStage>;
    calculateSwapSavings(
      originalSlippageBps: number,
      optimizedSlippageBps: number,
      originalPriorityFee: number,
      optimizedPriorityFee: number,
      swapAmount: number,
      outputAmount: number,
      solPrice: number
    ): Promise<any>;
  }
  
  export function getSwapService(): SwapService;
export function executeSwap(params: SwapParams): Promise<SwapResult>;
}

declare module '@/constants' {
  import type { Token } from '@/types';
  
  export const SOL_MINT: string;
  export const USDC_MINT: string;
  export const USDT_MINT: string;
  export const LAMPORTS_PER_SOL: number;
  export const SOL_DECIMALS: number;
  export const USDC_DECIMALS: number;
  export const DEFAULT_SOL_TOKEN: Token;
  export const DEFAULT_USDC_TOKEN: Token;
  export const DEFAULT_SLIPPAGE_BPS: number;
  export const MAX_SLIPPAGE_BPS: number;
  export const DEFAULT_PRIORITY_FEE: number;
  export const MAX_PRIORITY_FEE: number;
  export const SERVICE_FEE_PERCENTAGE: number;
  export const MIN_SAVINGS_THRESHOLD: number;
  export const SOLANA_ADDRESS_REGEX: RegExp;
  export const ERROR_CODES: Record<string, string>;
  export const ERROR_MESSAGES: Record<string, string>;
  export const JUPITER_API_BASE_URL: string;
  export const JUPITER_API_TIMEOUT: number;
  export const JUPITER_TOKENS_API_URL: string;
  export const EXPLORER_URLS: Record<string, string>;
  export const JUPITER_ENDPOINTS: {
    quote: string;
    swap: string;
    tokens: string;
    [key: string]: string;
  };
  export const PRIORITY_FEE_LEVELS: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    VERY_HIGH: number;
  };
  export const JUPITER_API_BASE_URL: string;
  export const JUPITER_API_TIMEOUT: number;
  export const MAX_SLIPPAGE_BPS: number;
  export const DEFAULT_PRIORITY_FEE: number;
  export const MAX_PRIORITY_FEE: number;
  export const SERVICE_FEE_PERCENTAGE: number;
  export const MIN_SAVINGS_THRESHOLD: number;
  export const EXPLORER_URLS: Record<string, string>;
}
