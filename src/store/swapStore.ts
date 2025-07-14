/**
 * Store Zustand pour la gestion de l'état du swap
 * 
 * Ce store centralise toute la logique d'état pour l'interface de swap,
 * incluant la sélection des tokens, les montants, les quotes et les optimisations.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import { create } from 'zustand';
import { PublicKey } from '@solana/web3.js';
import { 
  SwapState, 
  Token, 
  QuoteResponse, 
  PriorityFeeConfig,
  TransactionStatus
} from '@/types';
import { SwapStage } from '@/services/swap';
import { getSwapService } from '@/services/swap';
// Constants will be used later when implementing token selection

/**
 * Interface pour les actions du store de swap
 */
interface SwapActions {
  // Actions de sélection de tokens
  setInputToken: (token: Token | null) => void;
  setOutputToken: (token: Token | null) => void;
  swapTokens: () => void;
  
  // Actions de montant
  setInputAmount: (amount: string) => void;
  setOutputAmount: (amount: string) => void;
  
  // Actions de quote et swap
  fetchQuote: (userPublicKey: PublicKey) => Promise<QuoteResponse | null>;
  executeSwap: (userPublicKey: PublicKey) => Promise<boolean>;
  
  // Actions de configuration
  setSlippage: (slippage: number) => void;
  setPriorityFeeConfig: (config: PriorityFeeConfig) => void;
  toggleOptimizations: () => void;
  
  // Actions d'état
  resetState: () => void;
  setError: (error: string | null) => void;
}

/**
 * État initial du swap
 */
const initialState: SwapState = {
  inputToken: null,
  outputToken: null,
  inputAmount: '',
  outputAmount: '',
  currentQuote: null,
  quoteStatus: 'idle',
  slippage: 50, // 0.5% par défaut
  priorityFeeConfig: {
    strategy: 'auto'
  },
  optimizationsEnabled: true,
  lastError: null,
  lastOptimization: null,
  swapStatus: 'idle',
  swapResult: null
};

/**
 * Store Zustand pour le swap
 */
export const useSwapStore = create<SwapState & SwapActions>((set, get) => ({
  ...initialState,

  // Actions de sélection de tokens
  setInputToken: (token) => set({ inputToken: token, inputAmount: '', outputAmount: '', currentQuote: null }),
  
  setOutputToken: (token) => set({ outputToken: token, outputAmount: '', currentQuote: null }),
  
  swapTokens: () => {
    const { inputToken, outputToken, inputAmount, outputAmount } = get();
    set({ 
      inputToken: outputToken, 
      outputToken: inputToken,
      inputAmount: outputAmount,
      outputAmount: inputAmount,
      currentQuote: null
    });
  },
  
  // Actions de montant
  setInputAmount: (amount) => {
    set({ inputAmount: amount, outputAmount: '', currentQuote: null });
  },
  
  setOutputAmount: (amount) => {
    set({ outputAmount: amount, inputAmount: '', currentQuote: null });
  },
  
  // Actions de quote et swap
  fetchQuote: async (userPublicKey) => {
    const { inputToken, outputToken, inputAmount, slippage, optimizationsEnabled } = get();
    
    if (!inputToken || !outputToken || !inputAmount || parseFloat(inputAmount) <= 0) {
      return null;
    }
    
    set({ quoteStatus: 'loading', lastError: null });
    
    try {
      const swapService = getSwapService();
      const params = {
        inputToken,
        outputToken,
        inputAmount: parseFloat(inputAmount),
        userPublicKey,
        slippageConfig: {
          maxSlippageBps: slippage,
          enableDynamicOptimization: optimizationsEnabled,
          marketConditionWeight: 0.7,
          liquidityDepthWeight: 0.3,
          minConfidenceLevel: 0.5
        },
        priorityFeeConfig: get().priorityFeeConfig,
        enableOptimizations: optimizationsEnabled
      };
      
      // Obtenir un quote optimisé
      const quoteResponse = await swapService.getQuote(params);
      
      set({ 
        currentQuote: quoteResponse, 
        quoteStatus: 'success',
        outputAmount: quoteResponse ? 
          (parseFloat(quoteResponse.outAmount) / Math.pow(10, outputToken.decimals)).toString() : 
          ''
      });
      
      return quoteResponse;
    } catch (error) {
      console.error('Erreur lors de la récupération du quote:', error);
      set({ 
        quoteStatus: 'error', 
        lastError: error instanceof Error ? error.message : 'Erreur lors de la récupération du quote'
      });
      return null;
    }
  },
  
  executeSwap: async (userPublicKey): Promise<boolean> => {
    const { inputToken, outputToken, inputAmount, currentQuote, slippage, priorityFeeConfig, optimizationsEnabled } = get();
    
    if (!inputToken || !outputToken || !inputAmount || !currentQuote) {
      set({ lastError: 'Informations de swap incomplètes' });
      return false;
    }
    
    set({ swapStatus: 'loading', lastError: null });
    
    try {
      const swapService = getSwapService();
      const params = {
        inputToken,
        outputToken,
        inputAmount: parseFloat(inputAmount),
        userPublicKey,
        slippageConfig: {
          maxSlippageBps: slippage,
          enableDynamicOptimization: optimizationsEnabled,
          marketConditionWeight: 0.7,
          liquidityDepthWeight: 0.3,
          minConfidenceLevel: 0.5
        },
        priorityFeeConfig,
        enableOptimizations: optimizationsEnabled,
        onProgress: (stage: SwapStage, data?: any) => console.log(`Swap stage: ${stage}`, data)
      };
      
      // Exécuter le swap
      const result = await swapService.executeSwap(params);
      
      set({ 
        swapStatus: 'success',
        swapResult: result.transaction ? {
          signature: result.transaction.signature,
          status: result.transaction.status as TransactionStatus,
          ...(result.transaction.confirmationBlock !== undefined && { confirmationBlock: result.transaction.confirmationBlock }),
          ...(result.transaction.confirmationTime !== undefined && { confirmationTime: result.transaction.confirmationTime }),
        } : null,
        lastOptimization: result.optimization ? {
          slippageSavings: {
            originalSlippageBps: 0,
            optimizedSlippageBps: 0,
            savingsAmount: '0',
            savingsUsd: result.optimization.slippageSavingsUsd || 0
          },
          priorityFeeSavings: {
            standardFeeLamports: 0,
            optimizedFeeLamports: 0,
            savingsLamports: 0,
            savingsUsd: result.optimization.priorityFeeSavingsUsd || 0
          },
          totalSavings: {
            totalUsd: result.optimization.totalSavingsUsd || 0,
            savingsPercentage: 0
          },
          serviceFee: {
            amountUsd: 0,
            percentage: 0
          },
          confidenceScore: 0.95
        } : null
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'exécution du swap:', error);
      set({ 
        swapStatus: 'error', 
        lastError: error instanceof Error ? error.message : 'Erreur lors de l\'exécution du swap'
      });
      return false;
    }
  },
  
  // Actions de configuration
  setSlippage: (slippage) => set({ slippage }),
  
  setPriorityFeeConfig: (config) => set({ priorityFeeConfig: config }),
  
  toggleOptimizations: () => set((state) => ({ optimizationsEnabled: !state.optimizationsEnabled })),
  
  // Actions d'état
  resetState: () => set({ ...initialState }),
  
  setError: (error) => set({ lastError: error })
}));