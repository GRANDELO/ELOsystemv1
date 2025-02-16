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

exports.footerSubscribe =  async( req, res) => {
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

exports.NewsLetter = async (req, res) => {
    const {subject, content} = req.body;
    const file = req.file;

    console.log('Received request in NewsLetter:');
    console.log('Request Body:', req.body); // Log the entire request body
    console.log('Uploaded File:', file ? file.originalname : 'No file uploaded'); // Log file details if provided


    try{
        const fileUrl = file ? await uploadFile(file) : null; 
        const newNewsletter = new Newsletter({subject, content, fileUrl});

        await newNewsletter.save();
        res.status(201).json({ message: 'Newsletter created successfully' });
    }catch (error){
        res.status(500).json({ message: 'Server error' });
    }
};

exports.SendNewsletter = async (req, res) =>  {
    const { subject, content } = req.body;
    try {
        const subscribers = await Subscriber.find();
        console.log('Sending to subscribers:', subscribers.length);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        subscribers.forEach((subscriber) => {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: subscriber.email, 
                subject,
                html: content
            };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error){
                console.log(error);
            }else {
                console.log("Email sent: " +info.response)
            }

        });
    });
    res.status(200).json({ message: 'Newsletter sent successfully' });
    }catch(error){
        res.status(500).json({ message: 'Server error' });
    }
};


