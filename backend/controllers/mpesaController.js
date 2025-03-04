const axios = require("axios");
const moment = require("moment");
require('dotenv').config();
const fs = require("fs");
const Order = require('../models/Order');
const PendingJob = require('../models/PendingJob'); 
//const getAccessToken = require("../utils/accessToken");


// Get Access Token Function
async function getAccessToken() {
  const consumer_key = process.env.SAFARICOM_CONSUMER_KEY;
  const consumer_secret = process.env.SAFARICOM_CONSUMER_SECRET;
  const url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = "Basic " + Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: auth,
      },
    });
    return response.data.access_token;
  } catch (error) {
    throw error;
  }
}


// Access Token Route Handler
exports.getAccessTokenHandler = async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    res.send("😀 Your access token is " + accessToken);
  } catch (error) {
    console.log(error);
    res.status(500).send("❌ Failed to get access token");
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
      throw new Error(`Failed to initiate payment: ${error.message}`);
  }
};

const initiateurlreg = async (accessToken, paymentRequest) => {
  try {
      const response = await axios.post(
          'https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl',
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

// STK Push Handler
exports.stkPushHandler = async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const passkey = process.env.PASS_KEY;
    const businessShortCode = process.env.BUSINESS_SHORT_CODE;
    const businessTill = process.env.REGISTER_BUSINESS_SHORT_CODE;
    
    const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString('base64');




    const paymentRequest = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: req.body.amount,
      PartyA: req.body.phone, // Phone number to receive the STK push
      PartyB: businessTill,
      PhoneNumber: req.body.phone,
      CallBackURL: "https://elosystemv1.onrender.com/api/newpay/callback",
      AccountReference: "BAZELINK INK",
      TransactionDesc: 'Payment for Order',
    };

    const paymentResponse = await initiatePayment(accessToken, paymentRequest);
    const orderid = req.body.orderid;
    const orderReference = req.body.orderReference; 


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
    console.log(error);
    res.status(500).send("❌ STK Push request failed");
  }
};


// STK Push Callback Handler
exports.stkPushCallbackHandler = async (req, res) => {
  const json = JSON.stringify(req.body);
  const callbackData = req.body.Body.stkCallback;
  try {
      await PendingJob.create({ callbackData, processed: false }); // Save unprocessed job
      res.status(200).json({ message: 'Callback received and queued for processing.' });
  } catch (error) {
      console.error("Failed to queue job:", error);
      res.status(500).json({ message: 'Error queuing callback for processing' });
  }
 
};

// Register URL for C2B Handler
exports.registerURLHandler = async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const url = "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    const regRequest = {
      ShortCode: process.env.REGISTER_BUSINESS_SHORT_CODE,
      ResponseType: "Complete",
      ConfirmationURL: "https://elosystemv1.onrender.com/api/newpay/confirmation",
      ValidationURL: "https://elosystemv1.onrender.com/api/newpay/validation",
    }
    const regResponse = await initiateurlreg(accessToken, regRequest);
    res.status(200).send("✅ Register URL request successful");
  } catch (error) {
    console.log(error);
    res.status(500).send("❌ Register URL request failed");
  }
};

// Confirmation URL Handler
exports.confirmURLHandler = (req, res) => {
  console.log("All transactions will be sent to this URL");
  console.log(req.body);
  res.status(200).send("Confirmation received");
};

// Validation URL Handler
exports.validateURLHandler = (req, res) => {
  console.log("Validating payment");
  console.log(req.body);
  res.status(200).send("Validation received");
};

// B2C (Auto Withdrawal) Handler
exports.b2cRequestHandler = async (req, res) => {
  try {
//https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest
    const accessToken = await getAccessToken();
    const securityCredential = process.env.SECURITYCREDENTIAL; // Your Security Credential here
    const url = "https://api.safaricom.co.ke/mpesa/b2c/v3/paymentrequest";
    const response = await axios.post(url, {
      OriginatorConversationID: "b5376178-678c-449e-b866-2580c7ef3f75",
      InitiatorName: "BAZELINK",
      SecurityCredential: securityCredential,
      CommandID: "BusinessPayment",
      Amount: "1",
      PartyA: process.env.BUSINESS_SHORT_CODE,
      PartyB: "254742243421", // Phone number to receive funds
      Remarks: "Withdrawal",
      QueueTimeOutURL: "https://elosystemv1.onrender.com/api/newpay/b2c/queue",
      ResultURL: "https://elosystemv1.onrender.com/api/newpay/b2c/result",
      Occasion: "Withdrawal",
    }, {
      headers: { Authorization: "Bearer " + accessToken }
    });
    console.log(response.data);
    res.status(200).send("✅ Register URL request successful");
  } catch (error) {
    console.log(error);
    res.status(500).send("❌ B2C request failed");
  }
};

exports.b2cRequestHandler = async (Amount, Phonenumber) => {
    try {
      const accessToken = await getAccessToken();
      const securityCredential = process.env.SECURITYCREDENTIAL; // Your Security Credential here
      const url = "https://api.safaricom.co.ke/mpesa/b2c/v3/paymentrequest";
      const response = await axios.post(url, {
        InitiatorName: "BAZELINK",
        SecurityCredential: securityCredential,
        CommandID: "PromotionPayment",
        Amount: Amount,
        PartyA: process.env.REGISTER_BUSINESS_SHORT_CODE,
        PartyB: Phonenumber, // Phone number to receive funds
        Remarks: "Withdrawal",
        QueueTimeOutURL: "https://elosystemv1.onrender.com/api/newpay/b2c/queue",
        ResultURL: "https://elosystemv1.onrender.com/api/newpay/b2c/result",
        Occasion: "Withdrawal",
      }, {
        headers: { Authorization: "Bearer " + accessToken }
      });
  
      return "Payment done succesfully";
    } catch (error) {
      console.log(error);
      console.log("❌ B2C request failed");
      return "❌ B2C request failed";
    }
  };
  

exports.queue = (req, res) => {
    console.log("All queue transactions will be sent to this URL");
    console.log(req.body);
    res.status(200).send("Confirmation queue received");
  };

  exports.result = (req, res) => {
    console.log("All result transactions will be sent to this URL");
    console.log(req.body);
    res.status(200).send("Confirmation result received");
  };