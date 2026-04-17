import { useState, useEffect } from 'react';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const checkSupport = () => {
      // Check if browser supports service workers and Push API
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setIsSupported(false);
        return;
      }
      setIsSupported(true);
      setPermission(Notification.permission);
    };
    checkSupport();
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        registerServiceWorker();
        return true;
      }
    } catch (e) {
      console.error('Failed to request push notification permission:', e);
    }
    return false;
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker Registered');
      } catch (e) {
        console.error('Service Worker registration failed:', e);
      }
    }
  };

  // Local simulated push for testing before sending to backend
  const sendLocalTestNotification = async () => {
    if (permission === 'granted' && 'serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification('F1 Stats Update!', {
        body: 'This is a test web push notification from your new .in domain configuration.',
        icon: '/apple-touch-icon.png',
        badge: '/favicon.svg',
        data: { url: window.location.href }
      });
    } else {
      console.warn("Notifications not granted or service worker missing.");
    }
  };

  return { isSupported, permission, requestPermission, sendLocalTestNotification };
}
