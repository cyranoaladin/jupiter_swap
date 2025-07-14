/**
 * Instrumentation client pour Sentry
 * 
 * Ce fichier configure Sentry pour le monitoring des erreurs côté client
 * et exporte les fonctions nécessaires pour le monitoring des transitions de route.
 * 
 * @author Manus AI
 * @version 1.2.0
 */

import * as Sentry from '@sentry/nextjs';

// Vérification de la disponibilité d'une DSN valide
const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isSentryEnabled = sentryDsn && sentryDsn !== '' && !sentryDsn.includes('dev-dsn');

// Initialisation conditionnelle de Sentry uniquement si une DSN valide est disponible
if (isSentryEnabled) {
  Sentry.init({
    // DSN configuré dans les variables d'environnement
    dsn: sentryDsn,
    environment: process.env.SENTRY_ENVIRONMENT || 'production',
    
    // Configuration de la performance
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.3, // Échantillonnage plus élevé en dev
  
    // Configuration des releases
    release: process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
    
    // Configuration des breadcrumbs
    maxBreadcrumbs: 50,
    
    // Activer les logs structurés
    _experiments: {
      enableLogs: true,
    },
    
    // Ignorer certaines erreurs
    ignoreErrors: [
      // Erreurs de connexion réseau
      'Network request failed',
      'Failed to fetch',
      'NetworkError',
      'The network connection was lost',
      'The Internet connection appears to be offline',
      // Erreurs de l'utilisateur
      'User denied transaction signature',
      'User rejected the request',
      'Transaction was not confirmed',
      // Erreurs de chargement de ressources
      'Loading chunk',
      'Loading CSS chunk',
      'ResizeObserver loop limit exceeded',
      'Script error',
      'ChunkLoadError',
    ],
  
    // Filtrage des IPs
    allowUrls: [
      // Uniquement les erreurs de notre domaine et des CDNs
      /https?:\/\/([^/]+\.)?jupiter-swap\.com/,
      /https?:\/\/([^/]+\.)?vercel\.app/,
      /https?:\/\/([^/]+\.)?netlify\.app/,
    ],
    
    // Configuration des tags par défaut
    initialScope: {
      tags: {
        app: 'jupiter-swap-dapp',
        version: process.env.NEXT_PUBLIC_VERSION || 'dev',
      },
    },
    
    // Ajout des intégrations recommandées par le wizard Sentry
    integrations: [
      Sentry.replayIntegration(),
      // Intégration des logs console dans Sentry
      Sentry.consoleLoggingIntegration({ levels: ['log', 'error', 'warn'] }),
    ],
    
    // Configuration des replays
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Configuration des hooks avant envoi
    beforeSend(event, hint) {
      // Ne pas envoyer d'erreurs en développement local
      if (
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')
      ) {
        console.error('Sentry error (not sent in dev):', hint.originalException || event);
        return null;
      }
      
      // Nettoyer les données sensibles
      if (event.request && event.request.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      
      // Ajouter des informations contextuelles
      if (typeof window !== 'undefined') {
        event.tags = {
          ...event.tags,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          networkType: (navigator as any).connection ? (navigator as any).connection.effectiveType : 'unknown',
          solanaNetwork: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
        };
      }
      
      // Filtrer les erreurs de contenu bloqué par les extensions navigateur
      let errorMessage = '';
      if (hint.originalException && typeof hint.originalException === 'object' && 
          'message' in hint.originalException && typeof hint.originalException.message === 'string') {
        errorMessage = hint.originalException.message.toLowerCase();
      }
      
      if (
        errorMessage.includes('content blocked') || 
        errorMessage.includes('extension') ||
        errorMessage.includes('adblock')
      ) {
        return null;
      }
      
      return event;
    },
  });
}

// Exporter Sentry pour une utilisation dans l'application si nécessaire
export default Sentry;

/**
 * Fonctions pour le monitoring des transitions de route
 * Ces fonctions peuvent être utilisées dans l'application pour suivre les performances de navigation
 * 
 * Note: Ces fonctions sont actuellement désactivées en attendant une implémentation complète
 * du monitoring des performances de navigation.
 */

// Export du hook requis par Sentry pour l'instrumentation des navigations
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

// Implémentation future pour le monitoring des transitions de route
const monitorRouteTransitions = (): void => {
  // Cette fonction sera implémentée dans une future version
  // pour suivre les performances de navigation entre les routes
};

// Export pour documentation, à implémenter dans une future version
export { monitorRouteTransitions };