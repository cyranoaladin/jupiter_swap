/**
 * Layout principal de l'application Jupiter Swap
 * 
 * Ce composant définit la structure de base de l'application avec :
 * - Configuration des métadonnées SEO
 * - Providers globaux (Wallet, React Query, Theme)
 * - Gestion des erreurs globales
 * - Monitoring et analytics
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from '@/components/ui/toaster';
import { validateConfig } from '@/utils/config';
import '@/styles/globals.css';

// =============================================================================
// CONFIGURATION DES FONTS
// =============================================================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// =============================================================================
// MÉTADONNÉES SEO
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: 'Jupiter Swap - DeFi Trading Optimisé',
    template: '%s | Jupiter Swap',
  },
  description: 'Plateforme de trading DeFi avancée avec optimisations automatiques de slippage et priority fees. Économisez sur vos swaps SOL/USDC avec Jupiter API v6.',
  keywords: [
    'Jupiter',
    'Solana',
    'DeFi',
    'Swap',
    'Trading',
    'SOL',
    'USDC',
    'Optimisation',
    'Slippage',
    'Priority Fees',
  ],
  authors: [{ name: 'Jupiter Swap Team' }],
  creator: 'Jupiter Swap',
  publisher: 'Jupiter Swap',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://jupiter-swap.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'Jupiter Swap - DeFi Trading Optimisé',
    description: 'Plateforme de trading DeFi avancée avec optimisations automatiques. Économisez sur vos swaps avec Jupiter API v6.',
    siteName: 'Jupiter Swap',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jupiter Swap - DeFi Trading Optimisé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jupiter Swap - DeFi Trading Optimisé',
    description: 'Plateforme de trading DeFi avancée avec optimisations automatiques.',
    images: ['/og-image.png'],
    creator: '@JupiterSwap',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || null,
  },
  category: 'finance',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f14' },
  ],
};

// =============================================================================
// COMPOSANT LAYOUT PRINCIPAL
// =============================================================================

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Valider la configuration au démarrage
  if (typeof window === 'undefined') {
    try {
      validateConfig();
    } catch (error) {
      console.error('❌ Erreur de configuration:', error);
    }
  }

  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect aux domaines externes pour optimiser les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://quote-api.jup.ag" />
        <link rel="preconnect" href="https://token.jup.ag" />
        
        {/* Favicon et icônes */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload des ressources critiques */}
        
        {/* DNS Prefetch pour les endpoints RPC */}
        <link rel="dns-prefetch" href="//mainnet.helius-rpc.com" />
        <link rel="dns-prefetch" href="//rpc.ankr.com" />
                    <link rel="dns-prefetch" href="//mainnet.helius-rpc.com" />
        
        {/* Meta tags pour PWA */}
        <meta name="application-name" content="Jupiter Swap" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Jupiter Swap" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#9945ff" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Scripts de monitoring et analytics */}
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                        page_title: document.title,
                        page_location: window.location.href,
                      });
                    `,
                  }}
                />
              </>
            )}
            
            {/* Analytics supplémentaires à implémenter ultérieurement */}
          </>
        )}
      </head>
      
      <body className={`${inter.className} antialiased`}>
        {/* Providers globaux pour l'application */}
        <Providers>
          {/* Structure principale de l'application */}
          <div className="relative min-h-screen bg-background">
            {/* Gradient de fond */}
            <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/20 pointer-events-none" />
            
            {/* Contenu principal */}
            <div className="relative z-10">
              {children}
            </div>
            
            {/* Composant de notifications toast */}
            <Toaster />
          </div>
        </Providers>
        
        {/* Scripts de performance et monitoring */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Web Vitals */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  // Web Vitals monitoring
                  function sendToAnalytics(metric) {
                    if (typeof gtag !== 'undefined') {
                      gtag('event', metric.name, {
                        event_category: 'Web Vitals',
                        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                        event_label: metric.id,
                        non_interaction: true,
                      });
                    }
                  }
                  
                  // Chargement de web-vitals via script standard
                  (function() {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.js';
                    script.onload = function() {
                      // Utilisation de web-vitals après chargement
                      if (window.webVitals) {
                        const { onCLS, onFID, onFCP, onLCP, onTTFB } = window.webVitals;
                        onCLS(sendToAnalytics);
                        onFID(sendToAnalytics);
                        onFCP(sendToAnalytics);
                        onLCP(sendToAnalytics);
                        onTTFB(sendToAnalytics);
                      }
                    };
                    document.head.appendChild(script);
                  })();
                `,
              }}
            />
            
            {/* Service Worker pour PWA avec stratégie de mise à jour améliorée */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  // Définir une fonction globale pour éviter les problèmes d'hydratation React
                  window.registerServiceWorker = function() {
                    if ('serviceWorker' in navigator) {
                      // Utiliser un délai plus long pour éviter les problèmes d'hydratation
                      setTimeout(function() {
                        try {
                          // Utiliser l'URL relative avec une version fixe pour éviter les problèmes de cache
                          const baseUrl = window.location.origin;
                          const swUrl = baseUrl + '/sw.js?v=1.0.0';
                          
                          navigator.serviceWorker.register(swUrl, {
                            updateViaCache: 'none',
                            scope: '/'
                          }).then(function(registration) {
                            console.log('Service Worker enregistré avec succès:', registration);
                            
                            // Forcer la mise à jour si nécessaire
                            if (registration.waiting) {
                              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                            }
                          }).catch(function(error) {
                            console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
                          });
                          
                          // Gérer les mises à jour
                          navigator.serviceWorker.addEventListener('controllerchange', function() {
                            console.log('Service Worker mis à jour');
                          });
                        } catch (error) {
                          console.error('Erreur lors de l\'initialisation du Service Worker:', error);
                        }
                      }, 2000); // Délai plus long pour éviter les problèmes d'hydratation React
                    }
                  };
                  
                  // Appeler la fonction après le chargement complet de la page
                  if (document.readyState === 'complete') {
                    window.registerServiceWorker();
                  } else {
                    window.addEventListener('load', function() {
                      window.registerServiceWorker();
                    });
                  }
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}

// =============================================================================
// GESTION D'ERREURS GLOBALES
// =============================================================================

/**
 * Composant d'erreur globale pour Next.js 13+
 */
export function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('❌ Erreur globale de l\'application:', error);

  return (
    <html lang="fr" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md mx-auto text-center p-6">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Oups ! Une erreur s&apos;est produite
              </h1>
              <p className="text-muted-foreground mb-6">
                Nous nous excusons pour ce désagrément. L&apos;équipe technique a été notifiée.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Retour à l&#39;accueil
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Détails de l&apos;erreur (développement)
                </summary>
                <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
                  {error.message}
                  {error.stack && (
                    <>
                      {'\n\n'}
                      {error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

