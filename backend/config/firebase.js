/* firebase.js
const admin = require('firebase-admin');
const { cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require('./grandelo-firebase-adminsdk-lxsyl-d7518e4b02.json'); // Update this path

admin.initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'grandelo.appspot.com' // Update with your Firebase project ID
});

const bucket = getStorage().bucket();

module.exports = { bucket };*/
