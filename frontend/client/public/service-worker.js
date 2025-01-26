self.addEventListener('push', function (event) {
    const data = event.data.json(); // Assuming the payload is a JSON object

    const options = {
        body: data.body || 'You have a new message!', // Default message if body is missing
        icon: '/logo(1).ico',       //data.icon ||   // Customizable icon based on payload
        badge:  '/bell.png',    //data.badge ||  // Badge image
        actions: [
            { action: 'view', title: 'View', icon: '/images/view.png' }, // Add relevant actions
            { action: 'dismiss', title: 'Dismiss', icon: '/images/dismiss.png' }
        ],
        tag: data.tag || 'general-notification',      // Group similar notifications
        renotify: true,                               // Re-alert the user if a notification with the same tag is sent
        requireInteraction: true,                     // Keep the notification on screen until interacted with
        data: {
            url: data.url || '/',                     // URL to open when the notification is clicked
            id: data.id || 'default'                  // Pass any other custom data you want to use
        },
        vibrate: [200, 100, 200]                      // Vibration pattern: on, off, on
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'New Notification', options)
    );
});

// Handle notification click events
self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    // Open the URL or take action based on notification data or action type
    event.waitUntil(
        (async () => {
            if (event.action === 'view') {
                // Navigate to the URL specified in the data if "View" is clicked
                const clientsArr = await clients.matchAll({ type: 'window', includeUncontrolled: true });
                const client = clientsArr.find(c => c.url === event.notification.data.url);

                if (client) {
                    client.focus();
                } else {
                    clients.openWindow(event.notification.data.url);
                }
            }
            // Add additional logic for other actions here if needed
        })()
    );
});
