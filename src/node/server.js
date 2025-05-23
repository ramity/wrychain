const express = require('express');
// const https = require('https');
const fs = require('fs');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const { subscribe } = require('diagnostics_channel');

// const key = fs.readFileSync(__dirname + '/rootCA-key.pem');
// const cert = fs.readFileSync(__dirname + '/rootCA.pem');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// const server = https.createServer({ key: key, cert: cert }, app);

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Where subscription contexts are stored (for now)
let subscriptions = [];

app.get('/', (req, res) => {
    res.send('HTTP server is running!');
});

// The subscribe endpoint
//  - clients post to this endpoint to be added to the subscription list
app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    if (subscriptions.includes(subscription))
    {
        subscriptions.push(subscription);
    }

    res.status(201).json({});
});

// The send-notification endpoint
// - server posts to this endpoint to send notification to all subscriptions
app.post('/send-notification', (req, res) => {
    const notificationPayload = {
        title: "New Notification!",
        body: "This is a test push notification."
    };

    const sendPromises = subscriptions.map(sub => 
        webpush.sendNotification(sub, JSON.stringify(notificationPayload))
    );

    Promise.all(sendPromises)
        .catch(err => {
            console.log(err);
            res.sendStatus(500).json(err);
        });

    res.sendStatus(200)
});

app.listen(3000, '0.0.0.0', () => console.log('Server started on port 3000'));
