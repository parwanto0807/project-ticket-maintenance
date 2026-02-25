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
            if (typeof window === 'undefined' || !('Notification' in window)) {
                console.log('This browser does not support notifications.');
                return;
            }

            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Notification permission granted.');

                    if (messaging) {
                        const token = await getToken(messaging, {
                            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, // We'll need this from the user eventually
                        });

                        if (token) {
                            console.log('FCM Token:', token);
                            await saveFcmToken(token);
                        } else {
                            console.log('No registration token available. Request permission to generate one.');
                        }
                    }
                } else {
                    console.log('Unable to get permission to notify.');
                }
            } catch (error) {
                console.error('An error occurred while retrieving token:', error);
            }
        };

        requestPermission();

        if (messaging) {
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Foreground message received:', payload);

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

            return () => unsubscribe();
        }
    }, [addNotification]);

    return null;
};

export default FcmTokenManager;
