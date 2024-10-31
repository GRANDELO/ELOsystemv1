const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const Order = require('../models/Order');
const {sendOrderReceiptEmail} = require('../controllers/orderController');

const consumerKey = process.env.SAFARICOM_CONSUMER_KEY;
const consumerSecret = process.env.SAFARICOM_CONSUMER_SECRET;
const businessShortCode = process.env.BUSINESS_SHORT_CODE;
const passkey = process.env.PASS_KEY;
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

const generateAccessToken = async () => {
    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                "Authorization": "Basic " + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
            }
        });
        return response.data.access_token;
    } catch (error) {
        throw new Error(`Failed to generate access token: ${error.message}`);
    }
};

const initiatePayment = async (accessToken, paymentRequest) => {
    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            paymentRequest,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Failed to initiate payment: ${error.message}`);
    }
};

router.post('/lipa', async (req, res) => {
    try {
        const accessToken = await generateAccessToken();
        const timestamp = generateTimestamp();
        const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString('base64');

        const paymentRequest = {
            BusinessShortCode: businessShortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: 1,
            PartyA: req.body.phone,
            PartyB: businessShortCode,
            PhoneNumber: req.body.phone,
            CallBackURL: callbackURL,
            AccountReference: 'GRANDELO',
            TransactionDesc: 'Payment for Order',
        };

        const paymentResponse = await initiatePayment(accessToken, paymentRequest);
        const orderid = req.body.orderid;

        if(orderReference)
            {
                try {
                    const order = await Order.findOne({ orderReference: orderReference });
                    if (!order) {
                        return res.status(404).json({ message: 'Mpesa Order not found' });
                    }
    
                    order.CheckoutRequestID = paymentResponse.CheckoutRequestID;
                    await order.save();
    
                    return res.status(200).json({ message: 'Payment initiated successfully', data: paymentResponse ,CheckoutRequestID: paymentResponse.CheckoutRequestID});
                } catch (error) {
                    console.error('Failed to fetch orders:', error);
                    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
                }
            }


        if (orderid) {
            try {
                const order = await Order.findOne({ orderNumber: orderid });
                if (!order) {
                    return res.status(404).json({ message: 'Mpesa Order not found' });
                }

                order.CheckoutRequestID = paymentResponse.CheckoutRequestID;
                await order.save();

                return res.status(200).json({ message: 'Payment initiated successfully', data: paymentResponse ,CheckoutRequestID: paymentResponse.CheckoutRequestID});
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
            }
        } else {
            return res.status(200).json({ message: 'Payment initiated successfully', data: paymentResponse, CheckoutRequestID: paymentResponse.CheckoutRequestID });
        }

    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ message: 'Payment initiation failed', error: error.message });
    }
});
orderReference
router.post('/paymentcallback', async (req, res) => {
    console.log('....................... stk_confirm .............');
    console.log("Payload Received", req.body.Body.stkCallback);

    const callbackData = req.body.Body.stkCallback;
    const resultCode = callbackData.ResultCode;
    const checkoutId = callbackData.CheckoutRequestID;

    if (resultCode == 0)
        {
            try {
                const order = await Order.findOne({ CheckoutRequestID: checkoutId });
                if (!order) {
                    return res.status(404).json({ message: 'Mpesa Order not found' });
                }
        
                order.paid = true;
                await order.save();
        
                sendOrderReceiptEmail(order.orderNumber);
                console.log("Order paid successfully for ");
                return res.status(200).json({ message: 'Payment successful' });
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
            }
        }

});

module.exports = router;
