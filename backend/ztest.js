const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Replace with your actual M-Pesa API credentials
const consumerKey = '8OKHGDGZYgMhBDQ6AGZ9W8AgbZK77VOrSrGZUnRY2Xg0ApFf'; 
const consumerSecret = 'aANM6qu4AGYLODSK7T5I8KCLTM1gs4q8TrghGIAw5XYO2ymljM3tau0QwPpaZKAz'; 

// Replace with your M-Pesa short code
const shortCode = '600988'; 

// Replace with your actual confirmation and validation URLs
const confirmationURL = 'https://mydomain.com/confirmation';
const validationURL = 'https://mydomain.com/validation';

let token = '';

const getToken = async () => {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
        token = response.data.access_token;
        console.log('Access token:', token);
    } catch (error) {
        console.error('Error getting token:', error);
    }
};

const registerURL = async () => {
    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl',
            {
                ShortCode: shortCode,
                ResponseType: 'Completed',
                ConfirmationURL: confirmationURL,
                ValidationURL: validationURL
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log('URL registration response:', response.data);
    } catch (error) {
        console.error('Error registering URL:', error);
    }
};

app.post('/mpesa/confirmation', (req, res) => {
    console.log('Confirmation received:', req.body);
    res.status(200).send('Confirmation received');
});

app.post('/mpesa/validation', (req, res) => {
    console.log('Validation received:', req.body);
    res.status(200).send('Validation received');
});

app.post('/mpesa/simulate', async (req, res) => {
    const { phoneNumber, amount } = req.body;
    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate',
            {
                ShortCode: shortCode,
                CommandID: 'CustomerPayBillOnline',
                Amount: amount,
                Msisdn: phoneNumber,
                BillRefNumber: 'Test'
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        res.status(200).send(response.data);
    } catch (error) {
        console.error('Error simulating C2B transaction:', error);
        res.status(500).send('Error simulating C2B transaction');
    }
});

app.listen(3000, async () => {
    console.log('Server running on port 3000');
    await getToken();
    await registerURL();
});
