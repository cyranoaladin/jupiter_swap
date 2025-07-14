/**
 * Store Zustand pour la gestion de l'état du wallet
 * 
 * Ce store centralise toute la logique d'état pour le wallet,
 * incluant la connexion, les soldes et les mises à jour.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import { create } from 'zustand';
import { PublicKey } from '@solana/web3.js';
import { WalletState, TokenBalance, Token } from '@/types';
import { getSolanaService } from '@/services/solana';
import { SOL_MINT, USDC_MINT } from '@/constants';

/**
 * Interface pour les actions du store de wallet
 */
interface WalletActions {
  // Actions de connexion
  setConnected: (connected: boolean) => void;
  setPublicKey: (publicKey: PublicKey | null) => void;
  setWalletName: (name: string | null) => void;
  
  // Actions de soldes
  fetchBalances: () => Promise<void>;
  updateBalance: (tokenAddress: string, balance: TokenBalance) => void;
  resetBalances: () => void;
  
  // Actions d'état
  resetState: () => void;
}

/**
 * État initial du wallet
 */
const initialState: WalletState = {
  connected: false,
  publicKey: null,
  walletName: null,
  balances: {},
  balancesLoading: false,
  lastBalanceUpdate: null
};

/**
 * Store Zustand pour le wallet
 */
export const useWalletStore = create<WalletState & WalletActions>((set, get) => ({
  ...initialState,

  // Actions de connexion
  setConnected: (connected) => set({ connected }),
  
  setPublicKey: (publicKey) => set({ publicKey }),
  
  setWalletName: (walletName) => set({ walletName }),
  
  // Actions de soldes
  fetchBalances: async () => {
    const { publicKey, connected } = get();
    
    if (!publicKey || !connected) {
      return;
    }
    
    set({ balancesLoading: true });
    
    try {
      const solanaService = getSolanaService();
      
      // Récupérer les tokens SOL et USDC
      const solToken: Token = {
        address: SOL_MINT,
        name: 'Solana',
        symbol: 'SOL',
        decimals: 9,
        chainId: 101,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
      };
      
      const usdcToken: Token = {
        address: USDC_MINT,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        chainId: 101,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
      };
      
      // Récupérer les soldes
      const [solBalance, usdcBalance] = await Promise.all([
        solanaService.getTokenBalance(publicKey, { ...solToken, mint: solToken.address }),
        solanaService.getTokenBalance(publicKey, { ...usdcToken, mint: usdcToken.address })
      ]);
      
      // Mettre à jour les soldes
      set({
        balances: {
          [SOL_MINT]: {
            ...solBalance,
            lastUpdated: Date.now()
          },
          [USDC_MINT]: {
            ...usdcBalance,
            lastUpdated: Date.now()
          }
        },
        balancesLoading: false,
        lastBalanceUpdate: Date.now()
      });
      
      console.log('Soldes mis à jour:', { SOL: solBalance.amount, USDC: usdcBalance.amount });
    } catch (error) {
      console.error('Erreur lors de la récupération des soldes:', error);
      set({ balancesLoading: false });
    }
  },
  
  updateBalance: (tokenAddress, balance) => {
    set((state) => ({
      balances: {
        ...state.balances,
        [tokenAddress]: balance
      },
      lastBalanceUpdate: Date.now()
    }));
  },
  
  resetBalances: () => set({ balances: {}, lastBalanceUpdate: null }),
  
  // Actions d'état
  resetState: () => set({ ...initialState })
}));

/**
 * Hook pour récupérer le solde d'un token spécifique
 * @param tokenAddress Adresse du token
 * @returns Solde du token ou null si non disponible
 */
export const useTokenBalance = (tokenAddress: string): TokenBalance | null => {
  const balances = useWalletStore((state) => state.balances);
  return balances[tokenAddress] || null;
};

/**
 * Hook pour récupérer les soldes SOL et USDC
 * @returns Soldes SOL et USDC
 */
export const useMainBalances = () => {
  const balances = useWalletStore((state) => state.balances);
  const loading = useWalletStore((state) => state.balancesLoading);
  
  return {
    solBalance: balances[SOL_MINT] || null,
    usdcBalance: balances[USDC_MINT] || null,
    loading
  };
};