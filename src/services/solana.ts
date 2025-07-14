/**
 * Service Solana pour interactions blockchain
 * 
 * Ce service gère toutes les interactions avec la blockchain Solana :
 * - Récupération des soldes de tokens
 * - Envoi et confirmation de transactions
 * - Gestion des comptes de tokens associés
 * - Monitoring des transactions en temps réel
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
  TransactionSignature,
  Commitment,
  GetAccountInfoConfig,
  ParsedAccountData,
  Signer,
  RpcResponseAndContext,
  SimulatedTransactionResponse
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  getAccount,
  TokenAccountNotFoundError,
} from '@solana/spl-token';
import type { TokenBalance, Token, TransactionResult, TransactionStatus } from '@/types';
import { getRpcManager } from './rpc-manager';
import { 
  TransactionError, 
  TransactionTimeoutError, 
  logError 
} from './errors';
import { SOL_MINT, LAMPORTS_PER_SOL } from '@/constants';

// =============================================================================
// TYPES ET INTERFACES
// =============================================================================

/**
 * Configuration du service Solana
 */
export interface SolanaServiceConfig {
  /** Commitment level par défaut */
  commitment: Commitment;
  /** Timeout pour les transactions */
  transactionTimeout: number;
  /** Nombre maximum de tentatives de confirmation */
  maxConfirmationAttempts: number;
  /** Intervalle entre les vérifications de confirmation */
  confirmationCheckInterval: number;
}

/**
 * Options pour l'envoi de transaction
 */
export interface SendTransactionOptions {
  /** Skip preflight checks */
  skipPreflight?: boolean;
  /** Preflighted commitment */
  preflightCommitment?: Commitment;
  /** Timeout personnalisé */
  timeout?: number;
  /** Callback de progression */
  onProgress?: (status: TransactionStatus) => void;
}

/**
 * Informations sur un compte de token
 */
export interface TokenAccountInfo {
  /** Adresse du compte */
  address: string;
  /** Mint du token */
  mint: string;
  /** Propriétaire du compte */
  owner: string;
  /** Montant en unités de base */
  amount: string;
  /** Nombre de décimales */
  decimals: number;
  /** Montant formaté */
  uiAmount: number;
}

/**
 * Résultat de simulation de transaction
 */
export interface SimulationResult {
  /** Succès de la simulation */
  success: boolean;
  /** Logs de la simulation */
  logs: string[];
  /** Unités consommées */
  unitsConsumed: number;
  /** Message d'erreur si échec */
  error: string;
}

// =============================================================================
// SERVICE SOLANA PRINCIPAL
// =============================================================================

/**
 * Service pour les interactions avec la blockchain Solana
 */
export class SolanaService {
  private connection: Connection;
  private config: SolanaServiceConfig;

  constructor(config?: Partial<SolanaServiceConfig>) {
    this.config = {
      commitment: 'confirmed',
      transactionTimeout: 60000, // 60 secondes
      maxConfirmationAttempts: 30,
      confirmationCheckInterval: 2000, // 2 secondes
      ...config,
    };

    this.connection = getRpcManager().getPrimaryConnection();
    
    console.log('⛓️ Service Solana initialisé');
  }

  /**
   * Récupère le solde SOL d'une adresse
   */
  public async getSolBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey, this.config.commitment);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('❌ Échec de récupération du solde SOL:', error);
      throw error;
    }
  }

  /**
   * Récupère tous les comptes de tokens d'une adresse
   */
  public async getTokenAccounts(publicKey: PublicKey): Promise<TokenAccountInfo[]> {
    try {
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') },
        this.config.commitment
      );

      return tokenAccounts.value.map(accountInfo => {
        const parsedData = accountInfo.account.data as ParsedAccountData;
        const tokenData = parsedData.parsed.info;
        
        return {
          address: accountInfo.pubkey.toString(),
          mint: tokenData.mint,
          owner: tokenData.owner,
          amount: tokenData.tokenAmount.amount,
          decimals: tokenData.tokenAmount.decimals,
          uiAmount: tokenData.tokenAmount.uiAmount || 0,
        };
      });
    } catch (error) {
      console.error('❌ Échec de récupération des comptes de tokens:', error);
      throw error;
    }
  }

  /**
   * Récupère le solde d'un token spécifique
   */
  public async getTokenBalance(
    publicKey: PublicKey, 
    token: Token
  ): Promise<TokenBalance> {
    try {
      let amount = 0;
      let rawAmount = '0';

      if (token.address === SOL_MINT) {
        // Solde SOL natif
        const balance = await this.getSolBalance(publicKey);
        amount = balance;
        rawAmount = (balance * LAMPORTS_PER_SOL).toString();
      } else {
        // Solde de token SPL
        try {
          const tokenAccountAddress = await getAssociatedTokenAddress(
            new PublicKey(token.address),
            publicKey
          );

          const accountInfo = await getAccount(
            this.connection,
            tokenAccountAddress,
            this.config.commitment
          );

          rawAmount = accountInfo.amount.toString();
          amount = parseFloat(rawAmount) / Math.pow(10, token.decimals);
        } catch (error) {
          if (error instanceof TokenAccountNotFoundError) {
            // Compte de token n'existe pas, solde = 0
            amount = 0;
            rawAmount = '0';
          } else {
            throw error;
          }
        }
      }

      // Calculer la valeur USD si le prix est disponible
      const usdValue = token.priceUsd ? amount * token.priceUsd : 0;

      return {
        token,
        rawAmount,
        amount,
        usdValue,
        lastUpdated: Date.now(),
      };
    } catch (error) {
      console.error(`❌ Échec de récupération du solde ${token.symbol}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les soldes de plusieurs tokens
   */
  public async getMultipleTokenBalances(
    publicKey: PublicKey,
    tokens: Token[]
  ): Promise<Record<string, TokenBalance>> {
    const balances: Record<string, TokenBalance> = {};

    try {
      // Récupérer les soldes en parallèle
      const balancePromises = tokens.map(async (token) => {
        try {
          const balance = await this.getTokenBalance(publicKey, token);
          return { token: token.address, balance };
        } catch (error) {
          console.warn(`⚠️ Impossible de récupérer le solde pour ${token.symbol}:`, error);
          return {
            token: token.address,
            balance: {
              token,
              rawAmount: '0',
              amount: 0,
              lastUpdated: Date.now(),
            } as TokenBalance,
          };
        }
      });

      const results = await Promise.allSettled(balancePromises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          balances[result.value.token] = result.value.balance;
        }
      });

      return balances;
    } catch (error) {
      console.error('❌ Échec de récupération des soldes multiples:', error);
      throw error;
    }
  }

  /**
   * Vérifie si un utilisateur a un solde suffisant
   */
  public async checkSufficientBalance(
    publicKey: PublicKey,
    token: Token,
    requiredAmount: string
  ): Promise<boolean> {
    try {
      const balance = await this.getTokenBalance(publicKey, token);
      const required = BigInt(requiredAmount);
      const available = BigInt(balance.rawAmount);
      
      return available >= required;
    } catch (error) {
      console.error('❌ Échec de vérification du solde:', error);
      return false;
    }
  }

  /**
   * Envoie une transaction legacy
   */
  public async sendTransaction(
    transaction: Transaction,
    signers: Signer[],
    options?: SendTransactionOptions
  ): Promise<TransactionResult> {
    const signature = await this.connection.sendTransaction(transaction, signers, {
      skipPreflight: options?.skipPreflight ?? false,
      preflightCommitment: options?.preflightCommitment ?? this.config.commitment,
    });

    return this.confirmTransaction(signature, options);
  }

  /**
   * Envoie une transaction versionnée
   */
  public async sendVersionedTransaction(
    transaction: VersionedTransaction,
    options?: SendTransactionOptions
  ): Promise<TransactionResult> {
    const signature = await this.connection.sendTransaction(transaction, {
      skipPreflight: options?.skipPreflight ?? false,
      preflightCommitment: options?.preflightCommitment ?? this.config.commitment,
    });

    return this.confirmTransaction(signature, options);
  }

  /**
   * Confirme une transaction et suit son statut
   */
  public async confirmTransaction(
    signature: TransactionSignature,
    options?: SendTransactionOptions
  ): Promise<TransactionResult> {
    const startTime = Date.now();
    const timeout = options?.timeout ?? this.config.transactionTimeout;
    let attempts = 0;

    // Notifier le début de la confirmation
    try {
      options?.onProgress?.('confirming');
    } catch (progressError) {
      console.warn('⚠️ Erreur lors de la notification de progression:', progressError);
      // Continuer l'exécution même si le callback de progression échoue
    }

    try {
      while (attempts < this.config.maxConfirmationAttempts) {
        const elapsed = Date.now() - startTime;
        
        // Vérifier le timeout
        if (elapsed > timeout) {
          throw new TransactionTimeoutError(signature);
        }

        try {
          // Vérifier le statut de la transaction
          const status = await this.connection.getSignatureStatus(signature);
          
          if (status.value) {
            if (status.value.err) {
              // Transaction failed
              throw new TransactionError(
                `Transaction failed: ${JSON.stringify(status.value.err)}`,
                signature
              );
            }

            if (status.value.confirmationStatus === 'confirmed' || 
                status.value.confirmationStatus === 'finalized') {
              // Transaction confirmée
              options?.onProgress?.('confirmed');
              
              return {
                signature,
                status: 'confirmed',
                confirmationBlock: status.value.slot,
                confirmationTime: (Date.now() - startTime) / 1000,
              };
            }
          }

          // Attendre avant la prochaine vérification
          await new Promise(resolve => 
            setTimeout(resolve, this.config.confirmationCheckInterval)
          );
          attempts++;

        } catch (error) {
          if (error instanceof TransactionError || error instanceof TransactionTimeoutError) {
            throw error;
          }
          
          console.warn(`⚠️ Error during confirmation check (attempt ${attempts + 1}):`, error);
          attempts++;
          
          if (attempts >= this.config.maxConfirmationAttempts) {
            throw error;
          }
          
          await new Promise(resolve => 
            setTimeout(resolve, this.config.confirmationCheckInterval)
          );
        }
      }

      // Trop de tentatives
      throw new TransactionTimeoutError(signature);

    } catch (error) {
      try {
        options?.onProgress?.('failed');
      } catch (progressError) {
        console.warn('⚠️ Erreur lors de la notification d\'échec:', progressError);
        // Continuer l'exécution même si le callback de progression échoue
      }
      
      if (error instanceof TransactionError || error instanceof TransactionTimeoutError) {
        throw error;
      }
      
      logError(error, { 
        context: 'Transaction confirmation',
        signature,
        attempts,
        elapsed: Date.now() - startTime 
      });
      
      throw new TransactionError(
        `Échec de confirmation: ${error instanceof Error ? error.message : String(error)}`,
        signature
      );
    }
  }

  /**
   * Récupère les logs d'une transaction
   */
  public async getTransactionLogs(signature: TransactionSignature): Promise<string[]> {
    try {
      const transaction = await this.connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });
      
      return transaction?.meta?.logMessages || [];
    } catch (error) {
      console.warn('⚠️ Impossible de récupérer les logs de transaction:', error);
      return [];
    }
  }

  /**
   * Récupère les détails complets d'une transaction
   */
  public async getTransactionDetails(signature: TransactionSignature) {
    try {
      const transaction = await this.connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
        commitment: 'confirmed',
      });

      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      return {
        signature,
        slot: transaction.slot,
        blockTime: transaction.blockTime,
        fee: transaction.meta?.fee,
        status: transaction.meta?.err ? 'failed' : 'confirmed',
        logs: transaction.meta?.logMessages || [],
        preBalances: transaction.meta?.preBalances || [],
        postBalances: transaction.meta?.postBalances || [],
      };
    } catch (error) {
      console.error('❌ Échec de récupération des détails de transaction:', error);
      throw error;
    }
  }

  /**
   * Simule une transaction avant envoi
   */
  public async simulateTransaction(
    transaction: Transaction | VersionedTransaction
  ): Promise<SimulationResult> {
    try {
      let simulation: RpcResponseAndContext<SimulatedTransactionResponse>;
      
      if (transaction instanceof Transaction) {
        // Pour les transactions legacy
        simulation = await this.connection.simulateTransaction(
          transaction,
          undefined,
          true
        );
      } else {
        // Pour les transactions versionnées
        simulation = await this.connection.simulateTransaction(
          transaction
        );
      }

      return {
        success: !simulation.value.err,
        logs: simulation.value.logs || [],
        unitsConsumed: simulation.value.unitsConsumed || 0,
        error: simulation.value.err ? JSON.stringify(simulation.value.err) : '',
      };
    } catch (error) {
      console.error('❌ Échec de simulation de transaction:', error);
      return {
        success: false,
        logs: [],
        unitsConsumed: 0,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Récupère les informations de compte
   */
  public async getAccountInfo(
    publicKey: PublicKey,
    config?: GetAccountInfoConfig
  ) {
    try {
      return await this.connection.getAccountInfo(publicKey, {
        commitment: this.config.commitment,
        ...config,
      });
    } catch (error) {
      console.error('❌ Échec de récupération des informations de compte:', error);
      throw error;
    }
  }

  /**
   * Récupère la hauteur de bloc actuelle
   */
  public async getCurrentSlot(): Promise<number> {
    try {
      return await this.connection.getSlot(this.config.commitment);
    } catch (error) {
      console.error('❌ Échec de récupération du slot actuel:', error);
      throw error;
    }
  }

  /**
   * Récupère les frais de transaction récents
   */
  public async getRecentPrioritizationFees(): Promise<Array<{
    slot: number;
    prioritizationFee: number;
  }>> {
    try {
      return await this.connection.getRecentPrioritizationFees();
    } catch (error) {
      console.error('❌ Échec de récupération des frais de priorité:', error);
      return [];
    }
  }

  /**
   * Met à jour la configuration du service
   */
  public updateConfig(newConfig: Partial<SolanaServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Configuration Solana mise à jour');
  }

  /**
   * Récupère la configuration actuelle
   */
  public getConfig(): SolanaServiceConfig {
    return { ...this.config };
  }

  /**
   * Récupère la connexion RPC actuelle
   */
  public getConnection(): Connection {
    return this.connection;
  }

  /**
   * Met à jour la connexion RPC
   */
  public updateConnection(): void {
    this.connection = getRpcManager().getPrimaryConnection();
    console.log('🔄 Connexion Solana mise à jour');
  }
}

// =============================================================================
// INSTANCE SINGLETON
// =============================================================================

let solanaServiceInstance: SolanaService | null = null;

/**
 * Récupère l'instance singleton du service Solana
 */
export function getSolanaService(): SolanaService {
  if (!solanaServiceInstance) {
    solanaServiceInstance = new SolanaService();
  }
  return solanaServiceInstance;
}

/**
 * Initialise le service Solana avec une configuration personnalisée
 */
export function initializeSolanaService(config?: Partial<SolanaServiceConfig>): SolanaService {
  solanaServiceInstance = new SolanaService(config);
  return solanaServiceInstance;
}

