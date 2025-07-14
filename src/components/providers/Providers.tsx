/**
 * Providers globaux pour Jupiter Swap DApp
 * 
 * Ce composant regroupe tous les providers nécessaires :
 * - WalletProvider pour la connexion Solana
 * - QueryClient pour la gestion des données
 * - ThemeProvider pour le thème
 * - TooltipProvider pour les tooltips
 * 
 * @author Manus AI
 * @version 1.0.0
 */

'use client';

import { ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  // PhantomWalletAdapter supprimé car déjà enregistré comme wallet standard
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  // Autres wallets non utilisés supprimés pour éviter les erreurs TS6133
} from '@solana/wallet-adapter-wallets';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { appConfig, envConfig } from '@/utils/config';

// Importer les styles CSS du wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

// =============================================================================
// CONFIGURATION REACT QUERY
// =============================================================================

/**
 * Configuration optimisée de React Query pour les données blockchain
 */
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // Cache plus long pour les données statiques (tokens, etc.)
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
      
      // Retry intelligent pour les erreurs réseau
      retry: (failureCount, error: any) => {
        // Ne pas retry pour les erreurs 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry jusqu'à 3 fois pour les autres erreurs
        return failureCount < 3;
      },
      
      // Délai de retry avec backoff exponentiel
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch en arrière-plan quand la fenêtre reprend le focus
      refetchOnWindowFocus: true,
      
      // Refetch quand la connexion réseau est rétablie
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry pour les mutations critiques
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// =============================================================================
// CONFIGURATION WALLET ADAPTER
// =============================================================================

/**
 * Configuration des wallets supportés
 */
function WalletConfigProvider({ children }: { children: ReactNode }) {
  // Déterminer le réseau Solana
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet' 
    ? WalletAdapterNetwork.Devnet 
    : WalletAdapterNetwork.Mainnet) as WalletAdapterNetwork;

  // Endpoint RPC principal
  const endpoint = useMemo(() => appConfig.rpcEndpoints[0] || '', []);

  // Configuration des wallets supportés
  const wallets = useMemo(
    () => {
      // Créer un tableau de wallets supportés
      // Phantom est déjà enregistré comme wallet standard, ne pas l'ajouter explicitement
      return [
        // Wallets populaires en priorité
        new SolflareWalletAdapter({ network }),
        
        // Wallets additionnels - uniquement ceux nécessaires
        new LedgerWalletAdapter(),
      ];
    },
    [network]
  );

  // Fonction de gestion des erreurs RPC implémentée directement dans les callbacks

  return (
    <ConnectionProvider 
      endpoint={endpoint}
      config={{
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000,
        disableRetryOnRateLimit: false,
        // Augmenter le nombre de tentatives pour les requêtes RPC
        httpHeaders: {
          'Content-Type': 'application/json',
        },
      }}
    >
      <WalletProvider 
        wallets={wallets} 
        autoConnect={true}
        onError={(error) => {
          console.error('❤ Erreur wallet:', error);
          
          // Capturer les erreurs pour Sentry si disponible
          if (typeof window !== 'undefined' && (window as any).Sentry) {
            try {
              (window as any).Sentry.captureException(error, {
                tags: {
                  component: 'WalletAdapter',
                  walletType: error.name || 'unknown'
                },
                extra: {
                  message: error.message,
                  stack: error.stack
                }
              });
            } catch (sentryError) {
              console.warn('⚠️ Erreur lors de la capture Sentry:', sentryError);
            }
          }
        }}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// =============================================================================
// CONFIGURATION THEME
// =============================================================================

/**
 * Configuration du thème avec support système
 */
function ThemeConfigProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      themes={['light', 'dark', 'system']}
      storageKey="jupiter-swap-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}

// =============================================================================
// PROVIDER PRINCIPAL
// =============================================================================

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Composant principal regroupant tous les providers
 */
export function Providers({ children }: ProvidersProps) {
  // Créer une instance unique de QueryClient
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeConfigProvider>
        <WalletConfigProvider>
          <TooltipProvider delayDuration={300}>
            {children}
            
            {/* Toaster pour les notifications */}
            <Toaster />
            
            {/* React Query Devtools en développement */}
            {envConfig.enableReactQueryDevtools && (
              <ReactQueryDevtools 
                initialIsOpen={false}
                position="bottom"
                buttonPosition="bottom-right"
              />
            )}
          </TooltipProvider>
        </WalletConfigProvider>
      </ThemeConfigProvider>
    </QueryClientProvider>
  );
}

// =============================================================================
// HOOKS UTILITAIRES
// =============================================================================

/**
 * Hook pour accéder au QueryClient
 */
export function useQueryClient() {
  const { QueryClient } = require('@tanstack/react-query');
  return QueryClient;
}

/**
 * Hook pour vérifier si les providers sont chargés
 */
export function useProvidersReady() {
  // Ici vous pourriez ajouter une logique pour vérifier
  // que tous les providers sont correctement initialisés
  return true;
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Providers;

