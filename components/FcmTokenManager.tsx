"use client";

import { useEffect, useRef } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { toast } from 'sonner';
import { saveFcmToken } from '@/action/auth/fcm';
import { useNotificationStore } from '@/store/use-notification-store';

const FcmTokenManager = () => {
    const { addNotification } = useNotificationStore();
    const isTokenFetched = useRef(false);

    // Effect 1: One-time token registration (guarded by ref)
    useEffect(() => {
        if (isTokenFetched.current) return;
        isTokenFetched.current = true;

        const requestPermission = async () => {
            console.log("FCM: Starting requestPermission flow...");
            if (typeof window === 'undefined' || !('Notification' in window)) {
                console.log('FCM: This browser does not support notifications.');
                return;
            }

            try {
                const permission = await Notification.requestPermission();
                console.log("FCM: Permission status:", permission);

                if (permission === 'granted') {
                    if (messaging) {
                        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
                        if (!vapidKey) {
                            console.error("FCM: NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing!");
                        }

                        // Register FCM Service Worker with a specific scope to avoid PWA conflict
                        console.log("FCM: Registering Service Worker...");
                        const registration = await navigator.serviceWorker.register(
                            '/firebase-messaging-sw.js',
                            { scope: '/firebase-cloud-messaging-push-scope' }
                        );
                        console.log("FCM: Service Worker registered:", registration);

                        console.log("FCM: Fetching token with registered SW...");
                        const token = await getToken(messaging, {
                            vapidKey: vapidKey || "BGyaEUZo9ca8EzDhZnlI-Hf-xbs-ScnaLRSNQrVwFwaO6Pw1s4eDqWwfOtkfAWSGBIQv2O5UdEJscL8k4j2YTHQ",
                            serviceWorkerRegistration: registration,
                        });

                        if (token) {
                            console.log('FCM: Token generated:', token);
                            await saveFcmToken(token);
                            console.log("FCM: Token successfully saved to server.");
                        } else {
                            console.warn('FCM: No registration token available.');
                        }
                    } else {
                        console.error("FCM: Messaging object is undefined.");
                    }
                } else {
                    console.log('FCM: Notification permission denied.');
                }
            } catch (error) {
                console.error('FCM: Error during flow:', error);
            }
        };

        requestPermission();
    }, []);

    // Effect 2: Foreground message listener (always active, properly cleaned up)
    useEffect(() => {
        if (!messaging) {
            console.warn("FCM: Cannot set up onMessage listener because messaging is undefined.");
            return;
        }

        console.log("FCM: Setting up foreground message listener...");
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('FCM: Foreground message received!', payload);

            // Add to local store for real-time bell update
            addNotification({
                id: payload.messageId || Math.random().toString(),
                title: payload.notification?.title || 'New Notification',
                message: payload.notification?.body || '',
                link: payload.data?.link || null,
                isRead: false,
                createdAt: new Date(),
            });

            toast(payload.notification?.title || 'New Notification', {
                description: payload.notification?.body,
            });
        });

        return () => {
            console.log("FCM: Unsubscribing from foreground message listener.");
            unsubscribe();
        };
    }, [addNotification]);

    return null;
};

export default FcmTokenManager;
