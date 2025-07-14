/**
 * Service de récupération des fees pour Jupiter Swap DApp
 * 
 * Ce service gère la récupération automatique des économies réalisées
 * grâce aux optimisations et les transfère vers le wallet de service.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import * as Sentry from '@sentry/nextjs';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { appConfig } from '@/utils/config';

// Configuration du service de récupération
const FEE_RECOVERY_WALLET = process.env.NEXT_PUBLIC_FEE_RECOVERY_WALLET || 'GG4ffTkW8RHHdLUVNQWcLoNLtL245k16QuRRU5jeBTL1';
const RECOVERY_PERCENTAGE = 0.25; // 25% des économies
const MIN_RECOVERY_THRESHOLD = 0.001; // 0.001 SOL minimum

export interface FeeRecoveryData {
  totalRecovered: number; // En SOL
  totalRecoveredUsd: number; // En USD
  lastRecovery: {
    amount: number;
    amountUsd: number;
    timestamp: Date;
    transactionSignature: string;
  } | null;
  recoveryEnabled: boolean;
}

/**
 * Classe pour gérer la récupération des fees
 */
export class FeeRecoveryService {
  private connection: Connection;
  private recoveryWallet: PublicKey;
  
  constructor(connection: Connection) {
    this.connection = connection;
    
    try {
      this.recoveryWallet = new PublicKey(FEE_RECOVERY_WALLET);
    } catch (error) {
      console.error('❌ Adresse wallet de récupération invalide:', FEE_RECOVERY_WALLET);
      throw new Error('Adresse wallet de récupération invalide');
    }
  }

  /**
   * Vérifie si la récupération est activée et configurée
   */
  isRecoveryEnabled(): boolean {
    return appConfig.feeRecovery.enabled && 
           FEE_RECOVERY_WALLET !== 'your_fee_recovery_wallet_address_here';
  }

  /**
   * Calcule le montant à récupérer basé sur les économies
   */
  calculateRecoveryAmount(savingsAmount: number): number {
    if (!this.isRecoveryEnabled()) return 0;
    
    const recoveryAmount = savingsAmount * RECOVERY_PERCENTAGE;
    return recoveryAmount >= MIN_RECOVERY_THRESHOLD ? recoveryAmount : 0;
  }

  /**
   * Prépare une transaction de récupération des fees
   */
  async prepareRecoveryTransaction(
    userWallet: PublicKey,
    savingsAmount: number,
    solPrice: number
  ): Promise<Transaction | null> {
    return await Sentry.startSpan(
      {
        op: 'fee-recovery.prepare',
        name: 'Prepare Fee Recovery Transaction',
      },
      async () => {
        try {
          const recoveryAmount = this.calculateRecoveryAmount(savingsAmount);
          
          if (recoveryAmount === 0) {
            console.log('💡 Montant de récupération insuffisant:', recoveryAmount);
            return null;
          }

          // Vérifier le solde de l'utilisateur
          const userBalance = await this.connection.getBalance(userWallet);
          const recoveryLamports = Math.floor(recoveryAmount * LAMPORTS_PER_SOL);
          
          if (userBalance < recoveryLamports) {
            console.warn('⚠️ Solde insuffisant pour la récupération des fees');
            return null;
          }

          // Créer la transaction de transfert
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: userWallet,
              toPubkey: this.recoveryWallet,
              lamports: recoveryLamports,
            })
          );

          // Obtenir le blockhash récent
          const { blockhash } = await this.connection.getLatestBlockhash('confirmed');
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = userWallet;

          // Ajouter des métadonnées à Sentry
          Sentry.setContext('feeRecovery', {
            amount: recoveryAmount,
            amountUsd: recoveryAmount * solPrice,
            userWallet: userWallet.toString(),
            recoveryWallet: this.recoveryWallet.toString(),
            savingsAmount,
            recoveryPercentage: RECOVERY_PERCENTAGE * 100
          });

          console.log('✅ Transaction de récupération préparée:', {
            amount: recoveryAmount,
            amountUsd: recoveryAmount * solPrice,
            recoveryWallet: this.recoveryWallet.toString()
          });

          return transaction;
        } catch (error) {
          console.error('❌ Erreur préparation transaction récupération:', error);
          Sentry.captureException(error);
          return null;
        }
      }
    );
  }

  /**
   * Simule une transaction de récupération pour vérifier sa validité
   */
  async simulateRecoveryTransaction(transaction: Transaction): Promise<boolean> {
    try {
      const simulation = await this.connection.simulateTransaction(transaction);
      
      if (simulation.value.err) {
        console.error('❌ Simulation échouée:', simulation.value.err);
        return false;
      }

      console.log('✅ Simulation de récupération réussie');
      return true;
    } catch (error) {
      console.error('❌ Erreur simulation récupération:', error);
      return false;
    }
  }

  /**
   * Enregistre une récupération réussie dans le localStorage pour le suivi
   */
  recordSuccessfulRecovery(
    amount: number,
    amountUsd: number,
    transactionSignature: string
  ): void {
    try {
      const recoveryData = {
        amount,
        amountUsd,
        timestamp: new Date().toISOString(),
        transactionSignature
      };

      // Sauvegarder dans localStorage
      const existingData = localStorage.getItem('feeRecoveryHistory');
      const history = existingData ? JSON.parse(existingData) : [];
      history.push(recoveryData);
      
      // Garder seulement les 100 dernières récupérations
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }
      
      localStorage.setItem('feeRecoveryHistory', JSON.stringify(history));

      // Log dans Sentry
      Sentry.addBreadcrumb({
        category: 'fee-recovery',
        message: 'Fee recovery completed',
        data: {
          amount,
          amountUsd,
          transactionSignature
        },
        level: 'info'
      });

      console.log('📝 Récupération enregistrée avec succès:', recoveryData);
    } catch (error) {
      console.error('❌ Erreur enregistrement récupération:', error);
    }
  }

     /**
    * Récupère l'historique des récupérations depuis le localStorage
    */
   getRecoveryHistory(): Array<{
     amount: number;
     amountUsd: number;
     timestamp: Date;
     transactionSignature: string;
   }> {
     try {
       const data = localStorage.getItem('feeRecoveryHistory');
       if (!data) return [];

       const history = JSON.parse(data);
       return history
         .filter((item: any) => item && item.amount && item.timestamp)
         .map((item: any) => ({
           amount: item.amount,
           amountUsd: item.amountUsd,
           timestamp: new Date(item.timestamp),
           transactionSignature: item.transactionSignature
         }));
     } catch (error) {
       console.error('❌ Erreur lecture historique récupération:', error);
       return [];
     }
   }

  /**
   * Calcule les statistiques totales de récupération
   */
  getRecoveryStats(solPrice: number): FeeRecoveryData {
    const history = this.getRecoveryHistory();
    
    const totalRecovered = history.reduce((sum, item) => sum + item.amount, 0);
    const totalRecoveredUsd = totalRecovered * solPrice;
         const lastRecovery = history.length > 0 ? history[history.length - 1] || null : null;

    return {
      totalRecovered,
      totalRecoveredUsd,
      lastRecovery,
      recoveryEnabled: this.isRecoveryEnabled()
    };
  }

  /**
   * Valide l'adresse du wallet de récupération
   */
  static validateRecoveryWallet(address: string): boolean {
    try {
      new PublicKey(address);
      return address !== 'your_fee_recovery_wallet_address_here';
    } catch {
      return false;
    }
  }
}

/**
 * Instance globale du service de récupération
 */
let feeRecoveryService: FeeRecoveryService | null = null;

/**
 * Obtient l'instance du service de récupération des fees
 */
export function getFeeRecoveryService(connection: Connection): FeeRecoveryService {
  if (!feeRecoveryService) {
    feeRecoveryService = new FeeRecoveryService(connection);
  }
  return feeRecoveryService;
}

/**
 * Hook de récupération des fees automatique (à intégrer dans les transactions)
 */
export async function processAutomaticFeeRecovery(
  connection: Connection,
  userWallet: PublicKey,
  savingsAmount: number,
  solPrice: number,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<string | null> {
  const service = getFeeRecoveryService(connection);
  
  if (!service.isRecoveryEnabled()) {
    console.log('💡 Récupération des fees désactivée');
    return null;
  }

  try {
    const transaction = await service.prepareRecoveryTransaction(
      userWallet,
      savingsAmount,
      solPrice
    );

    if (!transaction) {
      console.log('💡 Pas de récupération nécessaire');
      return null;
    }

    // Simuler la transaction
    const isValid = await service.simulateRecoveryTransaction(transaction);
    if (!isValid) {
      console.warn('⚠️ Transaction de récupération invalide');
      return null;
    }

    // Signer et envoyer la transaction
    const signedTransaction = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
      { skipPreflight: false, preflightCommitment: 'confirmed' }
    );

    // Confirmer la transaction
    await connection.confirmTransaction(signature, 'confirmed');

    // Enregistrer le succès
    const recoveryAmount = service.calculateRecoveryAmount(savingsAmount);
    service.recordSuccessfulRecovery(
      recoveryAmount,
      recoveryAmount * solPrice,
      signature
    );

    console.log('🎉 Récupération des fees réussie:', signature);
    return signature;

  } catch (error) {
    console.error('❌ Erreur récupération automatique des fees:', error);
    Sentry.captureException(error);
    return null;
  }
} 