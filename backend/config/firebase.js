const admin = require('firebase-admin');
const { cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require('./grandbucket-83f9f-firebase-adminsdk-un98y-8d45eadfd8.json') // Update this path accordingly

admin.initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'grandbucket-83f9f.appspot.com' // Your Firebase storage bucket name
});

const bucket = getStorage().bucket();

module.exports = { bucket };
