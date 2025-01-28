import axiosInstance from './components/axiosInstance';
import React, { useEffect, useState } from 'react';
import { getUsernameFromToken } from './utils/auth';
const publicVapidKey = 'BNK_K1aaB3ntQ_lInFtrXC01vHCZ4lLTCBS37fgOXMzbApF6Y5-mRQ2aIXXTzKpzdn_Rl9uARa8I5gCiz6kqWGE';

const PushNotification = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    // Retrieve the username from session storage
    const username = getUsernameFromToken();
    if (!username) {
      console.error('Username not found in session storage');
      return;
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          registration.pushManager.getSubscription()
            .then(existingSubscription => {
              if (existingSubscription) {
                setIsSubscribed(true);
                setSubscription(existingSubscription);
              }
            })
            .catch(err => console.error('Error checking subscription:', err));
        })
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  }, []);

  const requestNotificationPermission = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setPermissionRequested(true);
        if (permission === 'granted') {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      });
    }
  };

  const subscribeUser = async () => {
    try {
      const username = sessionStorage.getItem('username');
      if (!username) {
        console.error('Username not found in session storage');
        return;
      }

      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await axiosInstance.post('/pushnotifications/subscribe', {
          subscription: newSubscription,
          username,
        });

        setIsSubscribed(true);
        setSubscription(newSubscription);
        console.log('User subscribed:', newSubscription);
      }
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  const unsubscribeUser = async () => {
    try {
      if (subscription) {
        await axiosInstance.post('/pushnotifications/unsubscribe', { endpoint: subscription.endpoint });
        await subscription.unsubscribe();
        setIsSubscribed(false);
        setSubscription(null);
        console.log('User unsubscribed');
      }
    } catch (error) {
      console.error('Unsubscription failed:', error);
    }
  };

  return (
    <div>
      <h1>Push Notifications</h1>
      {!isSubscribed ? (
        <>
          <button onClick={requestNotificationPermission}>Allow Notifications</button>
          {permissionRequested && (
            <button onClick={subscribeUser}>Subscribe to Notifications</button>
          )}
        </>
      ) : (
        <button onClick={unsubscribeUser}>Unsubscribe from Notifications</button>
      )}
    </div>
  );
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default PushNotification;
