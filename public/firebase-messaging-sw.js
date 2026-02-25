importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

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

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icons/icon-192x192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
