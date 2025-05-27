// This script sets the table and prepares things for the service worker.

// Register serviceWorker
if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}

// Ask user for notification permission after first click event
document.addEventListener('click', () => {
    Notification.requestPermission().then(function (status) {
        if (status === 'granted') {
            console.log('User granted permission for notifications');
        }
    });
});

// Subscribing to notifications
navigator.serviceWorker.ready.then(registration => {
    return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BGXnK870KdUVX6wPCUD9rFVBwizcsJ3349xziM9QC5wOYHSWHM87PR20gXpEkDaf9YFvFyLfxAtfeSAKDMbCke8'
    });
}).then(subscription => {
    console.log('Subscribed:', JSON.stringify(subscription));

    // Send subscription to your backend server
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/subscribe", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Response:", xhr.responseText);
            } else {
                console.error("Error:", xhr.status, xhr.statusText);
            }
        }
    };
    xhr.send(JSON.stringify(subscription));
});

// Register Periodic Background Sync
navigator.serviceWorker.ready.then(async (swReg) => {
    const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
    if (status.state === 'granted') {
        await swReg.periodicSync.register('check-notifications', {
            minInterval: 60 * 1000, // TODO verify: 15 minutes might actually be the minimum
        });
    }
});
