"use client";

import { useEffect, useRef, useState } from 'react';
import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { toast } from 'sonner';
import { saveFcmToken } from '@/action/auth/fcm';
import { useNotificationStore } from '@/store/use-notification-store';

const FcmTokenManager = () => {
    const { addNotification } = useNotificationStore();
    const isTokenFetched = useRef(false);
    const [messagingReady, setMessagingReady] = useState(false);

    // Effect 1: Register SW, fetch token, and mark messaging as ready
    useEffect(() => {
        if (isTokenFetched.current) return;
        isTokenFetched.current = true;

        const init = async () => {
            console.log("FCM: Starting init flow...");
            if (typeof window === 'undefined' || !('Notification' in window)) {
                console.log('FCM: This browser does not support notifications.');
                return;
            }

            try {
                const permission = await Notification.requestPermission();
                console.log("FCM: Permission status:", permission);

                if (permission === 'granted' && messaging) {
                    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
                    if (!vapidKey) {
                        console.error("FCM: NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing!");
                    }

                    // Register FCM Service Worker with specific scope
                    console.log("FCM: Registering Service Worker...");
                    const registration = await navigator.serviceWorker.register(
                        '/firebase-messaging-sw.js',
                        { scope: '/firebase-cloud-messaging-push-scope' }
                    );
                    console.log("FCM: Service Worker registered:", registration);

                    // Wait for SW to be active
                    if (registration.installing) {
                        await new Promise<void>((resolve) => {
                            registration.installing!.addEventListener('statechange', (e) => {
                                if ((e.target as ServiceWorker).state === 'activated') {
                                    resolve();
                                }
                            });
                        });
                    }

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

                    // Mark messaging as ready AFTER getToken binds the SW
                    setMessagingReady(true);
                    console.log("FCM: Messaging ready for onMessage listener.");
                } else {
                    console.log('FCM: Permission denied or messaging unavailable.');
                }
            } catch (error) {
                console.error('FCM: Error during init:', error);
            }
        };

        init();
    }, []);

    // Effect 2: Set up onMessage ONLY AFTER getToken has bound the SW to messaging
    useEffect(() => {
        if (!messagingReady || !messaging) {
            return;
        }

        console.log("FCM: Setting up foreground message listener...");
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('FCM: Foreground message received!', payload);

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
    }, [messagingReady, addNotification]);

    return null;
};

export default FcmTokenManager;
