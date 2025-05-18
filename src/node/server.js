const express = require('express');
// const https = require('https');
const fs = require('fs');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const key = fs.readFileSync(__dirname + '/rootCA-key.pem');
const cert = fs.readFileSync(__dirname + '/rootCA.pem');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// const server = https.createServer({ key: key, cert: cert }, app);

const vapidKeys = {
    publicKey: 'BG_2pYgz6vFUTXGxyQjoEKYNg6vmU-JBgmWs8xkuEpNcz_b7eKATOZokLxifu0qlQm_Qlx3xf-i1hyZIEEVF59E',
    privateKey: 'Oa3KYje1UyLDRidPBI-PA6jwa0a36yxtJ1gKTLrtJj0'
};

webpush.setVapidDetails(
    'mailto:lewis@braillest.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
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
    subscriptions.push(subscription);
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
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(3000, '0.0.0.0', () => console.log('Server started on port 3000'));
