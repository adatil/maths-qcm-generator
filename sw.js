// Service Worker pour QCM Maths Generator
// Permet le fonctionnement hors-ligne (PWA)

const CACHE_NAME = 'qcm-maths-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/qcm-data/generated_questions.json'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression du cache obsolète:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourne la version mise en cache si elle existe
        if (response) {
          return response;
        }
        
        // Sinon, fait la requête réseau
        return fetch(event.request).then((response) => {
          // Vérifier si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Cloner la réponse pour la mettre en cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // En cas d'erreur réseau, retourner une page d'erreur basique
          if (event.request.destination === 'document') {
            return new Response(
              `<!DOCTYPE html>
              <html lang="fr">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hors ligne - QCM Maths</title>
                <style>
                  body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                  }
                  .offline-container {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 2rem;
                    border-radius: 1rem;
                    backdrop-filter: blur(10px);
                  }
                  h1 { font-size: 2rem; margin-bottom: 1rem; }
                  p { font-size: 1.1rem; margin-bottom: 2rem; }
                  button {
                    background: #3B82F6;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    cursor: pointer;
                  }
                </style>
              </head>
              <body>
                <div class="offline-container">
                  <h1>📡 Vous êtes hors ligne</h1>
                  <p>Cette page n'est pas disponible hors ligne.</p>
                  <p>Vérifiez votre connexion internet et réessayez.</p>
                  <button onclick="window.location.reload()">🔄 Réessayer</button>
                </div>
              </body>
              </html>`,
              {
                headers: {
                  'Content-Type': 'text/html; charset=utf-8'
                }
              }
            );
          }
        });
      })
  );
});

// Gestion des messages depuis l'application principale
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});