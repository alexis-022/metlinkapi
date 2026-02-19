self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker Active');
});

// Listener for future push events
self.addEventListener('push', (event) => {
    const title = 'Push Notification';
    const options = {
        body: event.data ? event.data.text() : 'New Update!',
    };
    event.waitUntil(self.registration.showNotification(title, options));
});
