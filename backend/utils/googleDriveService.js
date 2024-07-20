/*/ services/googleDriveService.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Load client secrets from a local file.
const credentials = JSON.parse(fs.readFileSync('../config/client_secret_1046055573406-gdb206a2e0dn6spnhmv1593g4gvp28il.apps.googleusercontent.com.json'));

const oAuth2Client = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
 );

oAuth2Client.setCredentials({ refresh_token: credentials.refresh_token });

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

const uploadFile = async (filePath, mimeType) => {
  try {
    const fileMetadata = {
      name: path.basename(filePath),
      parents: ['1oKU1sNq2cNzCabKF0T5ETld-nAqkmfB6'], // Specify folder ID to upload the file to a specific folder
    };
    const media = {
      mimeType,
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    return response.data.webViewLink;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
};

module.exports = {
  uploadFile,
};*/
