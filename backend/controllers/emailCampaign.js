const Subscriber = require('../models/email');
const Newsletter = require('../models/newsLetter');
const User = require('../models/User');
const sendEmail = require('../services/emailService');
const EmailTemplate = require('../models/EmailTemplate')
const cron = require('node-cron');
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

const createSellerReminderTemplate = async () => {
    const template = new EmailTemplate({
        type: 'seller-reminder',
        subject: '🚀 Boost Your Sales: Post Your Products Today!',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://drive.google.com/uc?export=view&id=1rvKAcuOqBLrsBE9IVogGXxcviClHtb2B" alt="Bazelink Logo" style="width: 150px; height: auto;">
                </div>
                <h1 style="font-size: 24px; color: #007bff; text-align: center;">Hello [Username],</h1>
                <p style="font-size: 16px; text-align: center;">We noticed you haven’t posted any products yet. Don’t miss out on the opportunity to <strong>boost your sales</strong> and reach thousands of potential buyers!</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="font-size: 20px; color: #333; margin-bottom: 10px;">Why Post Your Products?</h2>
                    <ul style="font-size: 14px; color: #555; list-style-type: disc; padding-left: 20px;">
                        <li>🚀 <strong>Increase Visibility</strong>: Reach thousands of active buyers.</li>
                        <li>💰 <strong>Boost Sales</strong>: Turn your inventory into revenue.</li>
                        <li>📈 <strong>Grow Your Business</strong>: Expand your customer base.</li>
                    </ul>
                </div>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="https://www.partner.bazelink.co.ke" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block;">
                        Post Your Products Now
                    </a>
                </div>
                <p style="font-size: 14px; color: #777; text-align: center;">If you have any questions, feel free to contact our support team at <a href="mailto:Bazelink.ltd@gmail.com" style="color: #007bff; text-decoration: none;">Bazelink.ltd@gmail.com</a>.</p>
                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
                    <p>Best regards,<br/><strong>The Bazelink Team</strong></p>
                </div>
            </div>
        `,
    });
//https://drive.google.com/file/d/1rvKAcuOqBLrsBE9IVogGXxcviClHtb2B/view?usp=sharing
    await template.save();
    console.log('Seller reminder template created');
};

//createSellerReminderTemplate();

const emailSeller = async (req, res) => {
    try {
        const { templateId, customSubject, customHtml, sendTime } = req.body;

        // Fetch all sellers
        const sellers = await User.find({ category: 'Seller' });
        console.log(await User.find({ category: 'Seller' }));

        if (sellers.length === 0) {
            return res.status(404).json({ message: 'No sellers found' });
        }

        // Fetch the template or use custom content
        let subject, html;
        if (templateId) {
            const template = await EmailTemplate.findById(templateId);
            if (!template) {
                return res.status(404).json({ message: 'Template not found' });
            }
            subject = template.subject;
            html = template.html;
        } else if (customSubject && customHtml) {
            subject = customSubject;
            html = customHtml;
        } else {
            return res.status(400).json({ message: 'Template ID or custom content is required' });
        }

        const sendDateTime = new Date(sendTime);
        if (isNaN(sendDateTime.getTime())){
            return res.status(400).json({ message: 'Invalid sendTime format' });
        }

        const now = new Date();
        if (sendDateTime <= now) {
            return res.status(400).json({ message: 'sendTime must be in the future' });
        }

        const cronExpression = `${sendDateTime.getMinutes()} ${sendDateTime.getHours()} ${sendDateTime.getDate()} ${sendDateTime.getMonth() + 1} *`;

        cron.schedule(cronExpression, async () => {
            for (const seller of sellers) {
                const personalizedHtml = html.replace('[Username]', seller.username);
                try {
                    await sendEmail(seller.email, subject, personalizedHtml);
                    console.log(`Email sent to ${seller.email}`);
                } catch (err) {
                    console.error(`Failed to send email to ${seller.email}:`, err);
                }
            }
        });

        // Personalize and send emails
        res.status(200).json({ message: 'Emails scheduled successfully' });

    }catch (error){
        console.error('Error sending emails:', error);
        res.status(500).json({ message: 'Server error', error: error.message });

    }
};

const emailManteinance = async (req, res) => {
    try {

    }catch (error){

    };
}

module.exports = {
    footerSubscribe,
    NewsLetter,
    SendNewsletter,
    emailSeller,
    emailManteinance,
};
