// Firebase Messaging Service Worker
// Version: Updated to match firebase SDK v11.x compat
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCrypxi7hQiPU-hV1OGQCMrK607zf52Aqk",
    authDomain: "ticket-maintenance-96997.firebaseapp.com",
    projectId: "ticket-maintenance-96997",
    storageBucket: "ticket-maintenance-96997.firebasestorage.app",
    messagingSenderId: "530521928884",
    appId: "1:530521928884:web:e136e697ee5fce92a053e1",
    measurementId: "G-CP4WNBNQSW"
});

const messaging = firebase.messaging();

// Handle background messages (when app is not in foreground)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    // Only show notification if payload has notification data
    // (Firebase SDK handles foreground messages automatically via onMessage)
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: payload.data || {},
        // Open a URL when clicked
        tag: 'notification-' + Date.now(),
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — open the link from data payload
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click:', event);
    event.notification.close();

    const link = event.notification.data?.link || '/dashboard';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If there's already an open window, focus it
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.focus();
                    client.navigate(link);
                    return;
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow(link);
            }
        })
    );
});
