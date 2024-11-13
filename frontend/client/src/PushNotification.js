import axios from 'axios';
import React, { useEffect, useState } from 'react';

const publicVapidKey = 'BNK_K1aaB3ntQ_lInFtrXC01vHCZ4lLTCBS37fgOXMzbApF6Y5-mRQ2aIXXTzKpzdn_Rl9uARa8I5gCiz6kqWGE'; // Replace with your actual public VAPID key

const PushNotification = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);

          // Check if already subscribed
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

  // Function to request notification permission from the user
  const requestNotificationPermission = () => {
    // Check if permission is already granted or denied
    if (Notification.permission === 'default') {
      // Show the notification permission prompt
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
          setPermissionRequested(true);
        } else if (permission === 'denied') {
          console.log('Notification permission denied');
          setPermissionRequested(true);
        }
      });
    }
  };

  // Function to subscribe the user to push notifications
  const subscribeUser = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      // Send subscription to backend to store it
      await axios.post('https://elosystemv1.onrender.com/api/pushnotifications/subscribe', newSubscription);

      setIsSubscribed(true);
      setSubscription(newSubscription);
      console.log('User is subscribed:', newSubscription);
    }
  };

  // Function to unsubscribe the user from notifications
  const unsubscribeUser = async () => {
    if (subscription) {
      await axios.post('https://elosystemv1.onrender.com/api/pushnotifications/unsubscribe', { endpoint: subscription.endpoint });
      setIsSubscribed(false);
      setSubscription(null);
      console.log('User unsubscribed');
    }
  };

  return (
    <div>
      <h1>Push Notifications</h1>
      {!isSubscribed ? (
        <>
          <button onClick={requestNotificationPermission}>Allow Notifications</button>
          {/* Once permission is granted, show the subscribe button */}
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

// Helper function to convert the VAPID key to UInt8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default PushNotification;
