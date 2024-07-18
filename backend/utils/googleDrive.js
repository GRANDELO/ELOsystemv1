const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

const getAuthenticatedClient = async () => {
  const credentials = require('./credentials.json'); // Your downloaded credentials JSON file

  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
  } else {
    throw new Error('No token found. Please authenticate.');
  }

  return oAuth2Client;
};

const uploadFile = async (filePath, fileName) => {
  const auth = await getAuthenticatedClient();
  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: fileName
  };
  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(filePath)
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, webViewLink'
  });

  return response.data;
};

module.exports = { uploadFile };
