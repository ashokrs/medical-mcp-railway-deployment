// Improved Service Worker for Medical MCP Web Interface
const CACHE_NAME = 'medical-mcp-v2'; // Changed from v1 to v2 to force cache refresh
const STATIC_FILES = [
    '/',
    '/health'
];

// External resources that should be allowed through
const EXTERNAL_DOMAINS = [
    'fonts.googleapis.com',
    'fonts.gstatic.com', 
    'cdnjs.cloudflare.com'
];

// Check if URL is from an external domain we allow
function isAllowedExternalResource(url) {
    try {
        const urlObj = new URL(url);
        return EXTERNAL_DOMAINS.some(domain => urlObj.hostname.includes(domain));
    } catch {
        return false;
    }
}

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching static files');
            return cache.addAll(STATIC_FILES);
        }).then(() => {
            console.log('Service Worker: Installation complete');
            return self.skipWaiting();
        }).catch((error) => {
            console.log('Service Worker: Installation failed', error);
        })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event with improved handling
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = request.url;
    const method = request.method;
    
    // Skip service worker for external font/CSS resources - let browser handle them directly
    if (isAllowedExternalResource(url)) {
        console.log('Service Worker: Allowing external resource:', url);
        return; // Don't intercept, let browser handle normally
    }
    
    // Skip caching for POST requests (API calls) - they can't be cached
    if (method === 'POST') {
        console.log('Service Worker: Skipping POST request:', url);
        return; // Don't intercept POST requests, let them pass through normally
    }
    
    // Handle internal GET requests with caching strategy
    if (url.startsWith(self.location.origin) && method === 'GET') {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache:', url);
                    return cachedResponse;
                }
                
                return fetch(request).then((response) => {
                    // Only cache successful GET responses
                    if (response.status === 200 && method === 'GET') {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            console.log('Service Worker: Caching response:', url);
                            cache.put(request, responseToCache);
                        }).catch((error) => {
                            console.log('Service Worker: Cache put failed:', error);
                        });
                    }
                    return response;
                }).catch(() => {
                    // Return offline message for failed internal requests
                    return new Response('Medical MCP Web Interface - Currently offline', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    });
                });
            })
        );
    }
    // For any other requests (including POST), let them pass through normally
});

console.log('Service Worker: Loaded and ready');