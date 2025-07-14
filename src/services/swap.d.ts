/**
 * Déclarations de types pour le service Swap
 * 
 * Ce fichier contient les déclarations de types nécessaires pour le service Swap
 * en respectant le typage TypeScript strict requis par les standards du projet
 */

import { PublicKey, VersionedTransaction } from '@solana/web3.js';

/**
 * Informations sur un token
 */
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

/**
 * Balance d'un token
 */
export interface TokenBalance {
  token: Token;
  amount: number;
  rawAmount: string;
  decimals: number;
  usdValue?: number;
  lastUpdated?: number;
}

/**
 * Résultat d'optimisation
 */
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

/**
 * Étapes du processus de swap
 */
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

/**
 * Paramètres pour un swap
 */
export interface SwapParams {
  inputToken: Token;
  outputToken: Token;
  inputAmount: number;
  userPublicKey: PublicKey;
  slippageBps?: number;
  priorityFee?: number;
  useOptimization?: boolean;
  skipSimulation?: boolean;
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

/**
 * Résultat d'un swap
 */
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

/**
 * Service de swap utilisant Jupiter API v6
 */
export class SwapService {
  /**
   * Récupère un devis pour un swap
   */
  getQuote(params: SwapParams): Promise<any>;
  
  /**
   * Prépare une transaction de swap
   */
  prepareTransaction(params: SwapParams): Promise<VersionedTransaction>;
  
  /**
   * Exécute un swap complet
   */
  executeSwap(params: SwapParams): Promise<SwapResult>;
  
  /**
   * Récupère le statut d'un swap
   */
  getSwapStatus(signature: string): Promise<SwapStage>;
  
  /**
   * Calcule les économies réalisées sur un swap
   */
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

/**
 * Récupère l'instance singleton du service Swap
 */
export function getSwapService(): SwapService;

/**
 * Fonction utilitaire pour exécuter un swap
 */
export function executeSwap(params: SwapParams): Promise<SwapResult>;
