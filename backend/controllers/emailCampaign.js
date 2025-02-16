const Subscriber = require('../models/email');
const Newsletter = require('../models/newsLetter');
require('dotenv').config();
const nodemailer = require('nodemailer');
const { bucket } = require('../config/firebase');
const path = require('path');

async function uploadFile(file) {
  if (!file) return null;

  const fileName = Date.now() + path.extname(file.originalname); // Generate a unique file name
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => reject(err));
    stream.on('finish', async () => {
      // Get the public URL for the uploaded file
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });
    stream.end(file.buffer);
  });
}

const footerSubscribe =  async( req, res) => {
    const{ email } = req.body;

    if (!email) {
        return res.status(400).json({ message : "Email required"})
    }
    try {
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
          return res.status(400).json({ message: 'Email already subscribed' });
        }

        const newEmail = new Subscriber({email});
        await newEmail.save();
        res.status(201).json({ message: 'Subscription successful' });
    } catch(error){
        if (error.code ===11000){
            return res.status(400).json({ message: 'Email already subscribed' });
        }
        res.status(500).json({ message: 'Server error' });
    }

};

const NewsLetter = async (req, res) => {
    const {subject, content} = req.body;
    const file = req.file;
    try{
        const fileUrl = file ? await uploadFile(file) : null; 
        const newNewsletter = new Newsletter({subject, content, fileUrl});

        await newNewsletter.save();
        res.status(201).json({
            message: 'Newsletter created successfully', 
            newsletterId: newNewsletter._id,
        });
    }catch (error){
        res.status(500).json({ message: 'Server error' });
    }
};

const SendNewsletter = async (req, res) =>  {
    
    try {
        const { newsletterId } = req.body;
        const newsletter = await Newsletter.findById(newsletterId);
        if (!newsletter) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }

        const { subject, content, fileUrl } = newsletter;

        const subscribers = await Subscriber.find();
        console.log('Sending to subscribers:', subscribers.length);
        if (subscribers.length === 0) {
            return res.status(400).json({ message: 'No subscribers found' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const emailContent = `
           <h1>${subject}</h1>
           <div>${content}</div>
           ${fileUrl ? `<p>Download the attached file: <a href="${fileUrl}">${fileUrl}</a></p>` : ''}
        `;
        const sendEmailPromises = subscribers.map((subscriber) => {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: subscriber.email,
                subject: subject,
                html: emailContent,
            };

            return transporter.sendMail(mailOptions);
        });

        // Wait for all emails to be sent
        await Promise.all(sendEmailPromises);

        res.status(200).json({ message: 'Newsletter sent successfully' });
    } catch (error) {
        console.error('Error sending newsletter:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    footerSubscribe,
    NewsLetter,
    SendNewsletter,
};
