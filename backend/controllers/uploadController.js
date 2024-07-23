const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

exports.uploadImage = async (req, res) => {
  const { username, password, caption } = req.body;
  const imagePath = req.file.path;

  console.log('Uploaded file details:', req.file); // Log file details

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/accounts/login/');

    // Log in to Instagram
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForNavigation();

    // Navigate to upload page
    await page.goto('https://www.instagram.com/create/style/');

    // Click on the upload button
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('input[type="file"]')
    ]);

    // Select the file with the absolute path
    await fileChooser.accept([path.resolve(imagePath)]);

    // Add a caption
    await page.waitForSelector('textarea');
    await page.type('textarea', caption);

    // Share the post
    await page.click('button[type="submit"]');

    // Wait for the upload to complete
    await page.waitForNavigation();

    await browser.close();

    // Delete the uploaded file from server
    fs.unlinkSync(imagePath);

    res.json({ message: 'Image uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading image:', error); // Log detailed error
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};
