/**
 * Configuration Sentry côté serveur pour Jupiter Swap DApp
 * 
 * Ce fichier configure Sentry pour le monitoring des erreurs côté serveur
 * et active les fonctionnalités de tracing et logging.
 * 
 * @author Manus AI
 * @version 1.2.0
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // DSN Sentry pour Jupiter Swap DApp
  dsn: "https://80d91dc80e6c3ff4e76337383d689f3d@o4509651751731200.ingest.de.sentry.io/4509651758415952",
  
  // Configuration de l'environnement
  environment: process.env.SENTRY_ENVIRONMENT || 'production',
  release: process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
  
  // Configuration de la performance
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 0.5, // Échantillonnage plus élevé en dev
  
  // Activer les logs structurés
  _experiments: {
    enableLogs: true,
  },
  
  // Intégrations spécifiques au serveur
  integrations: [
    // Intégration des logs console dans Sentry
    Sentry.consoleLoggingIntegration({ levels: ['log', 'error', 'warn'] }),
    // Autres intégrations seront automatiquement découvertes
  ],
  
  // Configuration des tags par défaut
  initialScope: {
    tags: {
      app: 'jupiter-swap-dapp',
      version: process.env.NEXT_PUBLIC_VERSION || 'dev',
      solanaNetwork: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
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
