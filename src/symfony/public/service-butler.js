// This script sets the table and prepares things for the service worker.

// Register serviceWorker
if ("serviceWorker" in navigator && "PushManager" in window) {
    navigator.serviceWorker.register("/service-worker.js").then((registration) => {
        console.log("service-butler::serviceWorker registered with scope:", registration.scope);
    }).catch((error) => {
        console.error("service-butler::serviceWorker registration failed:", error);
    });
}

// Ask user for notification permission after first click event
document.addEventListener("click", () => {
    Notification.requestPermission().then((status) => {
        switch (status.state) {
            case "granted":
                console.log("service-butler::notification permission granted");
                break;

            case "prompt":
                console.warn("service-butler::notification permission prompted");
                break;

            case "denied":
                console.error("service-butler::notification permission denied");
                break;
        }
    }).catch((error) => {
        console.error("service-butler::notification error:", error);
    });
});

// Register Periodic Background Sync
navigator.serviceWorker.ready.then(async (swReg) => {

    // Conditional to check if periodic background sync is supported or not
    if ("serviceWorker" in navigator && "periodicSync" in swReg) {
        console.log("service-butler::periodicSync supported");
    } else {
        console.log("service-butler::periodicSync not supported");
    }

    const status = await navigator.permissions.query({ name: "periodic-background-sync" });
    switch (status.state) {
        case "granted":
            try {
                console.log("service-butler::periodicSync adding periodic background sync task");
                await swReg.periodicSync.register("check-notifications", { minInterval: 5 * 1000 });
                console.log("service-butler::periodicSync check-notifications registered");
            } catch {
                console.error("service-butler::periodicSync periodic Sync could not be registered");
            }
            break;

        case "prompt":
            console.log("service-butler::periodicSync permission prompted");
            break;

        case "denied":
            console.error("service-butler::periodicSync permission denied");
            break;
    }
}).catch((error) => {
    console.error("service-butler::periodicSync error:", error);
});

// Subscribing to notifications
navigator.serviceWorker.ready.then((registration) => {
    console.log("service-butler::pushManager subscribing");
    return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BGXnK870KdUVX6wPCUD9rFVBwizcsJ3349xziM9QC5wOYHSWHM87PR20gXpEkDaf9YFvFyLfxAtfeSAKDMbCke8"
    });
}).then((subscription) => {
    console.log("service-butler::pushManager pushing subscription to server");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/subscribe", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("service-butler::pushManager push successful", xhr.responseText);
            } else {
                console.error("service-butler::pushManager error:", xhr.status, xhr.statusText);
            }
        }
    };
    xhr.send(JSON.stringify(subscription));
}).catch((error) => {
    console.error("service-butler::pushManager error:", error);
});
