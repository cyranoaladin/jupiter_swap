/**
 * Déclarations de types pour le service Solana
 * 
 * Ce fichier contient les déclarations de types nécessaires pour le service Solana
 */

import { 
  PublicKey, 
  Transaction, 
  VersionedTransaction, 
  TransactionSignature,
  Commitment,
  Signer
} from '@solana/web3.js';

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
 * Résultat d'une transaction
 */
export interface TransactionResult {
  signature: string;
  status: 'confirmed' | 'finalized' | 'processed' | 'failed';
  confirmationBlock?: number;
  confirmationTime?: number;
  error?: string;
}

/**
 * Statut d'une transaction
 */
export interface TransactionStatus {
  status: 'confirmed' | 'finalized' | 'processed' | 'failed';
  confirmationBlock?: number;
  confirmationTime?: number;
  error?: string;
}

/**
 * Configuration du service Solana
 */
export interface SolanaServiceConfig {
  commitment: Commitment;
  confirmationTimeout: number;
  maxRetries: number;
  retryDelay: number;
}

/**
 * Service Solana pour interagir avec la blockchain
 */
export class SolanaService {
  /**
   * Récupère le solde SOL d'une adresse
   */
  getBalance(publicKey: PublicKey): Promise<number>;
  
  /**
   * Récupère le solde d'un token pour une adresse
   */
  getTokenBalance(publicKey: PublicKey, tokenMint: string | Token): Promise<TokenBalance>;
  
  /**
   * Récupère tous les soldes de tokens pour une adresse
   */
  getAllTokenBalances(publicKey: PublicKey): Promise<TokenBalance[]>;
  
  /**
   * Envoie une transaction sur la blockchain
   */
  sendTransaction(transaction: Transaction | VersionedTransaction, signers?: Signer[]): Promise<TransactionResult>;
  
  /**
   * Confirme une transaction
   */
  confirmTransaction(signature: TransactionSignature): Promise<TransactionStatus>;
  
  /**
   * Récupère l'adresse du compte de token pour un propriétaire et un mint
   */
  getTokenAccountAddress(owner: PublicKey, mint: string): Promise<PublicKey>;
  
  /**
   * Simule une transaction
   */
  simulateTransaction(transaction: Transaction | VersionedTransaction): Promise<boolean>;
}

/**
 * Récupère l'instance singleton du service Solana
 */
export function getSolanaService(config?: Partial<SolanaServiceConfig>): SolanaService;
