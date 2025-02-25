const admin = require('firebase-admin');
const { cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
require('dotenv').config();

// const serviceAccount = {
//   type: process.env.FIREBASE_TYPE,
//   project_id: process.env.FIREBASE_PROJECT_ID,
//   private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//   private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//   client_email: process.env.FIREBASE_CLIENT_EMAIL,
//   client_id: process.env.FIREBASE_CLIENT_ID,
//   auth_uri: process.env.FIREBASE_AUTH_URI,
//   token_uri: process.env.FIREBASE_TOKEN_URI,
//   auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//   client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
//   universe_domain: process.env.Universe_domain
// };
const serviceAccount = {
  type: process.env.TYPE_CLOUD,
  project_id: process.env.PROJECT_ID_CLOUD,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL_CLOUD,
  client_id: process.env.CLIENT_ID_CLOUD,
  auth_uri: process.env.AUTH_URI_CLOUD,
  token_uri: process.env.TOKEN_URI_CLOUD,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL_CLOUD,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL_CLOUD,
  universe_domain: process.env.UNIVERSE_DOMAIN_CLOUD
};
admin.initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'grandbucket-83f9f.appspot.com' // Your Firebase storage bucket name
});

const bucket = getStorage().bucket();

module.exports = { bucket };
