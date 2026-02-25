import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCrypxi7hQiPU-hV1OGQCMrK607zf52Aqk",
    authDomain: "ticket-maintenance-96997.firebaseapp.com",
    projectId: "ticket-maintenance-96997",
    storageBucket: "ticket-maintenance-96997.firebasestorage.app",
    messagingSenderId: "530521928884",
    appId: "1:530521928884:web:e136e697ee5fce92a053e1",
    measurementId: "G-CP4WNBNQSW",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let messaging: Messaging | undefined;

if (typeof window !== "undefined") {
    messaging = getMessaging(app);
}

export { app, messaging };
