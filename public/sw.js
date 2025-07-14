/**
 * Service Worker minimaliste pour Jupiter Swap DApp
 * Version 7.0 - Solution robuste pour éviter les erreurs React et problèmes d'URL
 */

// Nom du cache - incrémenté pour forcer la mise à jour complète
const CACHE_NAME = 'jupiter-swap-cache-v7';

// Ressources essentielles à mettre en cache - liste minimale pour éviter les erreurs
const RESOURCES_TO_CACHE = [
  './',
  './favicon.ico',
  './favicon.svg',
  './logo.svg',
  './logo.png',
  './manifest.json',
];

// Domaines à exclure du cache (API, RPC, etc.)
const EXCLUDED_DOMAINS = [
  'helius-rpc.com',
  'api.helius.xyz',
  'solana.com',
  'sentry.io',
  'jup.ag',
  'quote-api',
];

// Installation du service worker avec activation immédiate
self.addEventListener('install', event => {
  console.log(`Service Worker: Installation démarrée`); 
  
  // Activation immédiate sans attendre la fermeture des pages
  self.skipWaiting();
  
  // Obtenir l'URL de base du Service Worker
  const baseUrl = self.location.href.replace(/\/sw\.js(\?.*)?$/, '');
  
  // Préfixer les ressources avec l'URL de base
  const resourcesToCache = RESOURCES_TO_CACHE.map(resource => {
    // Si la ressource commence par './', remplacer par l'URL de base
    if (resource.startsWith('./')) {
      return baseUrl + resource.substring(1); // Enlever le point
    }
    return baseUrl + resource;
  });
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`Service Worker: Préchargement du cache`);
        return cache.addAll(resourcesToCache).catch(error => {
          console.error('Erreur lors de l\'ajout des ressources au cache:', error);
          // Continuer même en cas d'erreur pour éviter de bloquer l'installation
          return Promise.resolve();
        });
      })
      .catch(error => {
        console.error('Erreur lors de l\'ouverture du cache:', error);
      })
  );
});

// Écouter les messages pour SKIP_WAITING
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Service Worker: Reçu message SKIP_WAITING, activation immédiate');
    self.skipWaiting();
  }
});

// Activation - nettoyage des anciens caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Prendre le contrôle immédiatement
      clients.claim(),
      
      // Supprimer les anciens caches
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames
              .filter(cacheName => cacheName !== CACHE_NAME)
              .map(cacheName => {
                console.log(`Service Worker: Suppression de l'ancien cache ${cacheName}`);
                return caches.delete(cacheName);
              })
          );
        })
    ]).then(() => {
      console.log('Service Worker: Activation terminée avec succès');
    })
  );
});

// Stratégie simple: Bypass pour la plupart des requêtes, cache minimal
self.addEventListener('fetch', event => {
  try {
    // Vérifier si la requête doit être interceptée ou non
    if (shouldBypassFetch(event.request)) {
      // Ne pas intercepter cette requête
      return;
    }
    
    // Pour les requêtes à traiter, utiliser une stratégie simple
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Si trouvé dans le cache, retourner la réponse mise en cache
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Sinon, faire une requête réseau
          return fetch(event.request.clone())
            .then(response => {
              // Vérifier si la réponse est valide
              if (!response || response.status !== 200) {
                return response;
              }
              
              // Ne pas mettre en cache les réponses réseau pour simplifier
              return response;
            })
            .catch(error => {
              console.warn(`Service Worker: Erreur réseau pour ${event.request.url}`, error);
              
              // Pour les navigations, essayer de retourner la page d'accueil
              if (event.request.mode === 'navigate') {
                return caches.match('/').catch(() => {
                  // Si même la page d'accueil n'est pas dans le cache, créer une réponse d'erreur
                  return new Response('Erreur de connexion. Veuillez réessayer.', {
                    status: 503,
                    headers: { 'Content-Type': 'text/plain' }
                  });
                });
              }
              
              // Pour les autres requêtes, créer une réponse d'erreur
              return new Response('Ressource non disponible', {
                status: 504,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
        .catch(error => {
          console.error('Erreur lors du traitement de la requête:', error);
          return new Response('Erreur interne du Service Worker', {
            status: 500,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
  } catch (error) {
    console.error('Erreur critique dans le Service Worker:', error);
  }
});

// Fonction pour déterminer si une requête doit être interceptée ou non
function shouldBypassFetch(request) {
  // Exclure les requêtes non GET
  if (request.method !== 'GET') return true;
  
  try {
    // Analyser l'URL
    const url = new URL(request.url);
    
    // Exclure les requêtes API
    if (url.pathname.startsWith('/api/')) {
      return true;
    }
    
    // Exclure les domaines spécifiques
    if (EXCLUDED_DOMAINS.some(domain => url.hostname.includes(domain))) {
      return true;
    }
    
    // Exclure les requêtes de données (WebSocket, etc.)
    if (request.destination === 'document' || 
        request.destination === 'script' || 
        request.destination === 'style' || 
        request.destination === 'image' || 
        request.destination === 'font') {
      // Traiter uniquement les ressources statiques principales
      return false;
    }
    
    // Exclure par défaut
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'analyse de la requête:', error);
    return true; // Exclure en cas d'erreur
  }
}
