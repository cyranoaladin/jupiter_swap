/**
 * Instrumentation serveur pour Sentry
 * 
 * Ce fichier configure Sentry pour le monitoring des erreurs côté serveur
 * et exporte les fonctions nécessaires pour le monitoring des requêtes.
 * 
 * @author Manus AI
 * @version 1.1.0
 */

/**
 * Fonction register appelée par Next.js lors de l'initialisation
 */
export async function register() {
  console.log('🔧 Instrumentation register() - Initialisation Sentry avec vraies données');
  
  try {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('../sentry.server.config');
      console.log('✅ Sentry serveur initialisé');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('../sentry.edge.config');
      console.log('✅ Sentry edge initialisé');
    }
  } catch (error) {
    console.warn('⚠️ Erreur initialisation Sentry:', error);
  }
}

/**
 * Gestionnaire d'erreur pour les requêtes (temporairement simplifié)
 */
export const onRequestError = (error: Error, request: Request) => {
  console.error('❌ Erreur de requête:', error.message, 'URL:', request.url);
};

/**
 * Gestionnaire des requêtes entrantes (temporairement simplifié)
 */
export const onRequest = (request: Request) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📨 Requête:', request.method, request.url);
  }
};

/**
 * Gestionnaire des réponses (temporairement simplifié)
 */
export const onResponse = (_request: Request, response: Response) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📤 Réponse:', response.status);
  }
};
