const QRCode = require('qrcode');

exports.generateQr = async (req, res) => {
    const iosLink = 'https://apps.apple.com/app/id<your-app-id>';
    const androidLink = 'https://play.google.com/store/apps/details?id=<your.package.name>';
    
    // Alternatively, use a unified link if you created one
    const appLink = '<your-unified-link>';
  
    try {
      // Generate the QR code image for the link
      const qrCodeData = await QRCode.toDataURL(appLink);
      
      // Send the QR code as a response
      res.send(`<img src="${qrCodeData}" alt="QR Code for app download" />`);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      res.status(500).send('Error generating QR code');
    }

}