require('dotenv').config();
const admin = require('firebase-admin');
const { cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); // Update this path accordingly

admin.initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'grandelo.appspot.com' // Your Firebase storage bucket name
});

const bucket = getStorage().bucket();

module.exports = { bucket };
