// This script acts as a middle man between browser and server.
// Its purpose is to intercept events between the two in such a manner that a browser can retain some functionality during a server downtime
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

const DEBUG = true;

addEventListener("activate", (event) => {
    if (DEBUG) console.info("service-worker::activate", event);
});

addEventListener("backgroundfetchabort", (event) => {
    if (DEBUG) console.info("service-worker::backgroundfetchabort", event);
});

addEventListener("backgroundfetchclick", (event) => {
    if (DEBUG) console.info("service-worker::backgroundfetchclick", event);
});

addEventListener("backgroundfetchfail", (event) => {
    if (DEBUG) console.info("service-worker::backgroundfetchfail", event);
});

addEventListener("backgroundfetchsuccess", (event) => {
    if (DEBUG) console.info("service-worker::backgroundfetchsuccess", event);
});

addEventListener("canmakepayment", (event) => {
    if (DEBUG) console.info("service-worker::canmakepayment", event);
});

addEventListener("contentdelete", (event) => {
    if (DEBUG) console.info("service-worker::contentdelete", event);
});

addEventListener("cookiechange", (event) => {
    if (DEBUG) console.info("service-worker::cookiechange", event);
});

self.addEventListener("fetch", (event) => {
    if (DEBUG) console.info("service-worker::fetch", event);

    // if (event.request.url.contains("/_wdt/")) {

    // }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("install", (event) => {
    if (DEBUG) console.info("service-worker::install", event);

    event.waitUntil(
        caches.open("symfony-pwa-cache").then((cache) => {
            return cache.addAll([
                "/",
                // "/offline",
                "background.js",
                "icon.png",
                "manifest.json",
                "mobile-preview.png",
                "notification-badge.png",
                "service-butler.js",
                "service-worker.js",
                "tablet-preview.png",
            ]);
        })
    );
});

self.addEventListener("message", (event) => {
    if (DEBUG) console.info("service-worker::message", event);
});

self.addEventListener("messageerror", (event) => {
    if (DEBUG) console.info("service-worker::messageerror", event);
});

self.addEventListener("notificationclick", (event) => {
  console.log("On notification click: ", event.notification.tag);
  event.notification.close();

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({type: "window"}).then((clientList) => {
        for (const client of clientList) {
            if (client.url.contains("https://localhost") && "focus" in client) {
                return client.focus();
            }
        }

        if (clients.openWindow) {
            return clients.openWindow("/");
        }
    }));
});

self.addEventListener("notificationclose", (event) => {
    if (DEBUG) console.info("service-worker::notificationclose", event);
});

self.addEventListener("paymentrequest", (event) => {
    if (DEBUG) console.info("service-worker::paymentrequest", event);
});

self.addEventListener("periodicsync", (event) => {
    if (DEBUG) console.info("service-worker::periodicsync", event);

    if (event.tag === 'check-notifications') {

        console.log('check notifications periodic sync was called');

        // event.waitUntil(function());
    }
});

self.addEventListener("push", event => {
    if (DEBUG) console.info("service-worker::push", event);

    const data = event.data ? event.data.json() : {};
    self.registration.showNotification(data.title, {
        title: "new message",
        actions: [
            {
                action: "",
                title: "",
                icon: "icon.png"
            }
        ],
        badge: "notification-badge.png",
        body: data.body,
        dir: "rtl",
        icon: "notification-badge.png",
        image: "notification-badge.png",
        lang: "en-US",
        renotify: false,
        requireInteraction: true,
        silent: false,
        tag: "test-notification",
        timestamp: Date.now(),
        // vibrate: []
    });
});

self.addEventListener("pushsubscriptionchange", (event) => {
    if (DEBUG) console.info("service-worker::pushsubscriptionchange", event);
});

self.addEventListener("sync", (event) => {
    if (DEBUG) console.info("service-worker::sync", event);
});
