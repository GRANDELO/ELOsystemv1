const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();


const consumerKey = process.env.SAFARICOM_CONSUMER_KEY;
const consumerSecret = process.env.SAFARICOM_CONSUMER_SECRET;
const businessShortCode = process.env.BUSINESS_SHORT_CODE;
const passkey = process.env.PASS_KEY; // Safaricom-provided passkey for password generation
const callbackURL = process.env.CALLBACK_URL;


const generateTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  const generateAccessToken = async (consumerKey, consumerSecret) => {
    try {
      const response = await axios.get('https://api.safaricom.co.ke/oauth/v1/generate', {
        auth: {
          username: process.env.SAFARICOM_CONSUMER_KEY,
          password: process.env.SAFARICOM_CONSUMER_SECRET,
        },
      });
      return response.data.access_token;
    } catch (error) {
      throw error;
    }
  };

  
  const initiatePayment = async (accessToken, paymentRequest) => {
    try {
      const response = await axios.post(
        'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        paymentRequest,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  

router.post('/lipa', async (req, res) => {
    try {
      const accessToken = await generateAccessToken(consumerKey, consumerSecret);

      const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString('base64');

      const paymentRequest = {
        BusinessShortCode: businessShortCode,
        Password: password, // Generate this using Daraja documentation
        Timestamp: generateTimestamp(),
        TransactionType: 'CustomerPayBillOnline',
        Amount: req.body.amount,
        PartyA: req.body.phone,
        PartyB: businessShortCode,
        PhoneNumber: req.body.phone,
        CallBackURL: callbackURL,
        AccountReference: 'GRANDELO',
        TransactionDesc: 'Payment for Order',
      };
  
      const paymentResponse = await initiatePayment(accessToken, paymentRequest);
  
      res.status(200).json({ message: 'Payment initiated successfully', data: paymentResponse });
    } catch (error) {
      console.error('Error initiating payment:', error);
      res.status(500).json({ message: 'Payment initiation failed' });
    }
  });
  

  router.post('/payment-callback', (req, res) => {
    // Handle payment callback logic here
    // Verify the payment and update your application's records
    res.status(200).send('Payment received and processed.');
  });
  
  module.exports = router;