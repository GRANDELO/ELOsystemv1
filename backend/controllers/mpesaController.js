// controllers/mpesaController.js
const axios = require('axios');
const { consumerKey, consumerSecret, shortCode, passkey } = require('../config/mpesaConfig');

// Function to generate MPesa OAuth Token
const getAccessToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });
  return response.data.access_token;
};

// Function to generate the password (Base64 encoded)
const generatePassword = (shortCode, passkey, timestamp) => {
  const dataToEncode = `${shortCode}${passkey}${timestamp}`;
  const buffer = Buffer.from(dataToEncode);
  return buffer.toString('base64');
};

// Handle STK Push Request
exports.initiateSTKPush = async (req, res) => {
  const { phoneNumber, amount } = req.body;
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14); // Create timestamp
  const password = generatePassword(shortCode, passkey, timestamp);

  try {
    const accessToken = await getAccessToken();

    const requestBody ={
      BusinessShortCode: '174379',
      Password: 'Safaricom999!*!',
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: 100,
      PartyA: '254742243421',
      PartyB: '600000',
      PhoneNumber: '254742243421',
      CallBackURL: 'https://elosystemv1.onrender.com/api/mpesa/mpesa-response',
      AccountReference: 'account_reference',
      TransactionDesc: 'test_payment',
    };

    // Send STK push request
    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.data.ResponseCode === '0') {
      res.json({ message: 'STK Push sent successfully! Please enter your MPesa PIN.' });
    } else {
      res.status(400).json({ message: 'Failed to initiate payment' });
    }
  } catch (error) {
    console.error('Error initiating STK push:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Handle MPesa Callback (Optional)
exports.handleMpesaCallback = (req, res) => {
  const mpesaResponse = req.body;
  
  // Log or process the MPesa response here
  console.log('MPesa Response:', mpesaResponse);

  // Example: Save to database or perform other actions based on the response
  // const transaction = new MpesaTransaction(mpesaResponse);
  // transaction.save();

  res.status(200).json({ message: 'Callback received successfully' });
};
