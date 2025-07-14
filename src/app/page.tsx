/**
 * Page principale de Jupiter Swap DApp
 * 
 * Cette page contient l'interface principale de swap avec :
 * - Interface de trading intuitive
 * - Affichage des optimisations en temps réel
 * - Métriques de performance
 * - Historique des transactions
 * 
 * @author Manus AI
 * @version 1.0.0
 */

'use client';

import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SwapInterface } from '@/components/swap/SwapInterface';
import { OptimizationPanel } from '@/components/analytics/OptimizationPanel';
import { TransactionHistory } from '@/components/analytics/TransactionHistory';
import { NetworkStatus } from '@/components/analytics/NetworkStatus';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// =============================================================================
// COMPOSANTS DE CHARGEMENT
// =============================================================================

/**
 * Composant de chargement pour l'interface de swap
 */
function SwapInterfaceLoading() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header du swap */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
        </div>
        
        {/* Token input */}
        <div className="space-y-4">
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
        </div>
        
        {/* Bouton de swap */}
        <div className="h-12 bg-muted animate-pulse rounded-lg" />
        
        {/* Détails du swap */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </Card>
  );
}

/**
 * Composant de chargement pour les analytics
 */
function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Métriques réseau */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="h-5 w-40 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-muted animate-pulse rounded" />
            <div className="h-16 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </Card>
      
      {/* Optimisations */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </Card>
    </div>
  );
}

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header de l'application */}
      <Header />
      
      {/* Contenu principal */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Titre et description */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Jupiter Swap
              <span className="text-primary ml-2">DeFi Optimisé</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plateforme de trading DeFi avancée avec optimisations automatiques de slippage et priority fees.
              Économisez sur vos swaps SOL/USDC avec Jupiter API v6.
            </p>
          </div>
          
          {/* Interface principale */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale - Interface de swap */}
            <div className="lg:col-span-2">
              <ErrorBoundary
                fallback={
                  <Card className="p-6">
                    <div className="text-center">
                      <p className="text-destructive mb-4">
                        Erreur de chargement de l&apos;interface de swap
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Recharger
                      </button>
                    </div>
                  </Card>
                }
              >
                <Suspense fallback={<SwapInterfaceLoading />}>
                  <SwapInterface />
                </Suspense>
              </ErrorBoundary>
            </div>
            
            {/* Colonne latérale - Analytics et informations */}
            <div className="space-y-6">
              {/* Statut du réseau */}
              <ErrorBoundary
                fallback={
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Impossible de charger le statut du réseau
                    </p>
                  </Card>
                }
              >
                <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}>
                  <NetworkStatus />
                </Suspense>
              </ErrorBoundary>
              
              {/* Panel d'optimisation */}
              <ErrorBoundary
                fallback={
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Impossible de charger les optimisations
                    </p>
                  </Card>
                }
              >
                <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-lg" />}>
                  <OptimizationPanel />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
          
          {/* Section des analytics détaillées */}
          <div className="mt-12">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">Historique</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="mt-6">
                <ErrorBoundary
                  fallback={
                    <Card className="p-6">
                      <div className="text-center">
                        <p className="text-muted-foreground">
                          Impossible de charger l&apos;historique des transactions
                        </p>
                      </div>
                    </Card>
                  }
                >
                  <Suspense fallback={<AnalyticsLoading />}>
                    <TransactionHistory />
                  </Suspense>
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-6">
                <ErrorBoundary
                  fallback={
                    <Card className="p-6">
                      <div className="text-center">
                        <p className="text-muted-foreground">
                          Impossible de charger les analytics avancées
                        </p>
                      </div>
                    </Card>
                  }
                >
                  <Suspense fallback={<AnalyticsLoading />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Métriques de performance */}
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Performance</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Temps moyen de swap</span>
                            <span className="font-medium">2.3s</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Taux de succès</span>
                            <span className="font-medium text-green-600">99.2%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Économies moyennes</span>
                            <span className="font-medium text-primary">$0.12</span>
                          </div>
                        </div>
                      </Card>
                      
                      {/* Métriques d'optimisation */}
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Optimisations</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Slippage optimisé</span>
                            <span className="font-medium">0.3%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Priority fees</span>
                            <span className="font-medium">Auto</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Économies totales</span>
                            <span className="font-medium text-primary">$24.67</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Suspense>
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Footer de l'application */}
      <Footer />
    </div>
  );
}

