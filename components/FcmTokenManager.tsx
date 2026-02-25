"use client";

import { useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { toast } from 'sonner';
import { saveFcmToken } from '@/action/auth/fcm';
import { useNotificationStore } from '@/store/use-notification-store';

const FcmTokenManager = () => {
    const { addNotification } = useNotificationStore();

    useEffect(() => {
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
                            console.error("FCM: NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing! This is required for production notifications. Please check your .env or hosting environment variables.");
                        }

                        console.log("FCM: Messaging initialized, fetching token...");
                        const token = await getToken(messaging, {
                            vapidKey: vapidKey || undefined,
                        });

                        if (token) {
                            console.log('FCM: Token generated:', token);
                            await saveFcmToken(token);
                            console.log("FCM: Token successfully saved to server.");
                        } else {
                            console.warn('FCM: No registration token available.');
                        }
                    } else {
                        console.error("FCM: Messaging object is undefined in FcmTokenManager.");
                    }
                } else {
                    console.log('FCM: Notification permission denied or not granted.');
                }
            } catch (error) {
                console.error('FCM: Error during token retrieval:', error);
            }
        };

        requestPermission();

        if (messaging) {
            console.log("FCM: Setting up foreground message listener...");
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('FCM: Foreground message received!', payload);

                // Add to local store for real-time bell update
                addNotification({
                    id: payload.messageId || Math.random().toString(),
                    title: payload.notification?.title || 'New Notification',
                    message: payload.notification?.body || '',
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
        } else {
            console.warn("FCM: Cannot set up onMessage listener because messaging is undefined.");
        }
    }, [addNotification]);

    return null;
};

export default FcmTokenManager;
