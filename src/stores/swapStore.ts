/**
 * Store Zustand pour la gestion des swaps dans Jupiter Swap DApp
 * 
 * Ce store centralise la gestion des états liés aux swaps :
 * - Tokens sélectionnés (from/to)
 * - Montants
 * - Slippage
 * - Balances
 * - Quotes
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import { create } from 'zustand';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { appConfig } from '@/utils/config';
import { lamportsToSol } from '@/lib/utils';
import { getJupiterService } from '@/services/jupiter';
import { USDC_MINT } from '@/constants';

// Types pour le store
interface SwapState {
  // Tokens et montants
  fromToken: 'SOL' | 'USDC';
  toToken: 'SOL' | 'USDC';
  fromAmount: number;
  toAmount: number;
  
  // Configuration
  slippage: number;
  
  // Balances
  solBalance: number;
  usdcBalance: number;
  
  // Actions
  setFromToken: (token: 'SOL' | 'USDC') => void;
  setToToken: (token: 'SOL' | 'USDC') => void;
  setFromAmount: (amount: number) => void;
  setToAmount: (amount: number) => void;
  setSlippage: (slippage: number) => void;
  swapTokens: () => void;
  fetchBalances: (walletAddress: string) => Promise<void>;
  fetchQuote: (fromToken: 'SOL' | 'USDC', toToken: 'SOL' | 'USDC', amount: number) => Promise<{ outAmount: number; priceImpact: number } | null>;
}

/**
 * Store Zustand pour la gestion des swaps
 */
export const useSwapStore = create<SwapState>((set, get) => ({
  // État initial
  fromToken: 'SOL',
  toToken: 'USDC',
  fromAmount: 0,
  toAmount: 0,
  slippage: appConfig.slippage.defaultBps,
  solBalance: 0,
  usdcBalance: 0,
  
  // Actions
  setFromToken: (token) => {
    const { toToken } = get();
    
    // Si le même token est sélectionné, inverser les tokens
    if (token === toToken) {
      set({
        fromToken: token,
        toToken: token === 'SOL' ? 'USDC' : 'SOL',
      });
    } else {
      set({ fromToken: token });
    }
  },
  
  setToToken: (token) => {
    const { fromToken } = get();
    
    // Si le même token est sélectionné, inverser les tokens
    if (token === fromToken) {
      set({
        toToken: token,
        fromToken: token === 'SOL' ? 'USDC' : 'SOL',
      });
    } else {
      set({ toToken: token });
    }
  },
  
  setFromAmount: (amount) => {
    set({ fromAmount: amount });
  },
  
  setToAmount: (amount) => {
    set({ toAmount: amount });
  },
  
  setSlippage: (slippage) => {
    set({ slippage });
  },
  
  swapTokens: () => {
    const { fromToken, toToken, fromAmount, toAmount } = get();
    
    set({
      fromToken: toToken,
      toToken: fromToken,
      fromAmount: toAmount,
      toAmount: fromAmount,
    });
  },
  
  fetchBalances: async (walletAddress) => {
    try {
      // Créer une connexion RPC avec vérification de sécurité
      const rpcEndpoint = appConfig.rpcEndpoints[0];
      if (!rpcEndpoint) {
        console.error('Aucun endpoint RPC configuré');
        return;
      }
      const connection = new Connection(rpcEndpoint);
      
      // Récupérer la balance SOL
      const publicKey = new PublicKey(walletAddress);
      const solBalanceRaw = await connection.getBalance(publicKey);
      const solBalance = lamportsToSol(solBalanceRaw);
      
      // Récupérer la balance USDC
      let usdcBalance = 0;
      try {
        const usdcMint = new PublicKey(USDC_MINT);
        const tokenAccount = await getAssociatedTokenAddress(usdcMint, publicKey);
        const tokenAccountInfo = await connection.getTokenAccountBalance(tokenAccount);
        
        if (tokenAccountInfo?.value) {
          usdcBalance = parseFloat(tokenAccountInfo.value.uiAmount?.toString() || '0');
        }
      } catch (error) {
        // Le compte de token n'existe probablement pas encore
        console.warn('Erreur lors de la récupération de la balance USDC:', error);
      }
      
      set({ solBalance, usdcBalance });
    } catch (error) {
      console.error('Erreur lors de la récupération des balances:', error);
      set({ solBalance: 0, usdcBalance: 0 });
    }
  },
  
  fetchQuote: async (fromToken, toToken, amount) => {
    if (amount <= 0) {
      set({ toAmount: 0 });
      return null;
    }
    
    try {
      // Récupérer un devis de Jupiter via le service
      const jupiterService = getJupiterService();
      const quoteParams = {
        inputMint: fromToken === 'SOL' ? 'So11111111111111111111111111111111111111112' : USDC_MINT,
        outputMint: toToken === 'SOL' ? 'So11111111111111111111111111111111111111112' : USDC_MINT,
        amount: amount.toString(),
        slippageBps: appConfig.slippage.defaultBps
      };
      const quoteResult = await jupiterService.getQuote(quoteParams);
      
      if (quoteResult) {
        // Convertir le montant de sortie en nombre
        const outAmount = parseFloat(quoteResult.outAmount);
        // Calculer l'impact de prix (ou utiliser une valeur par défaut si non disponible)
        const priceImpact = quoteResult.priceImpactPct ? parseFloat(quoteResult.priceImpactPct) : 0;
        
        set({ toAmount: outAmount });
        return { outAmount, priceImpact };
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du devis:', error);
      set({ toAmount: 0 });
      return null;
    }
  },
}));
