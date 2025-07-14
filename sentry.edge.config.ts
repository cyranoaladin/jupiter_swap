/**
 * Configuration Sentry pour l'Edge Runtime pour Jupiter Swap DApp
 * 
 * Ce fichier configure Sentry pour le monitoring des erreurs dans les fonctionnalités Edge
 * (middleware, edge routes, etc.) et active les fonctionnalités de tracing et logging.
 * 
 * @author Manus AI
 * @version 1.2.0
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // DSN configuré dans les variables d'environnement
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  
  // Configuration de l'environnement
  environment: process.env.SENTRY_ENVIRONMENT || 'production',
  release: process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
  
  // Configuration de la performance
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 0.5, // Échantillonnage plus élevé en dev
  
  // Activer les logs structurés
  _experiments: {
    enableLogs: true,
  },
  
  // Intégrations spécifiques à l'Edge
  integrations: [
    // Intégration des logs console dans Sentry
    Sentry.consoleLoggingIntegration({ levels: ['log', 'error', 'warn'] }),
  ],
  
  // Configuration des tags par défaut
  initialScope: {
    tags: {
      app: 'jupiter-swap-dapp',
      version: process.env.NEXT_PUBLIC_VERSION || 'dev',
      solanaNetwork: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
      runtime: 'edge',
    },
  },
  
  // Mode debug désactivé en production
  debug: process.env.NODE_ENV !== 'production',
  
  // Configuration des hooks avant envoi
  beforeSend(event) {
    // Nettoyer les données sensibles
    if (event.request && event.request.headers) {
      delete event.request.headers.Authorization;
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
    }
    
    return event;
  },
});
