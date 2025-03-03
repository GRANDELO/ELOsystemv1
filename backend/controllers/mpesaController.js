const axios = require("axios");
const moment = require("moment");
require('dotenv').config();
const fs = require("fs");
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

// STK Push Handler
exports.stkPushHandler = async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const passkey = process.env.PASS_KEY;
    const businessShortCode = process.env.BUSINESS_SHORT_CODE;
    const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString('base64');




    const response = await axios.post(url, {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: "1",
      PartyA: "254742243421", // Phone number to receive the STK push
      PartyB: 4976686,
      PhoneNumber: "254742243421",
      CallBackURL: "https://elosystemv1.onrender.com/api/newmpesa/callback",
      AccountReference: "BAZELINK",
      TransactionDesc: 'Payment for Order',
    }, {
      headers: { Authorization: "Bearer " + accessToken }
    });

    res.send("😀 Request is successful. Please enter M-Pesa PIN to complete the transaction");
  } catch (error) {
    console.log(error);
    res.status(500).send("❌ STK Push request failed");
  }
};


// STK Push Callback Handler
exports.stkPushCallbackHandler = (req, res) => {
  const json = JSON.stringify(req.body);
  fs.writeFile("stkcallback.json", json, "utf8", (err) => {
    if (err) console.log(err);
    console.log("STK Push Callback JSON saved.");
  });
  res.status(200).send("Callback received");
};

// Register URL for C2B Handler
exports.registerURLHandler = async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    const response = await axios.post(url, {
      ShortCode: process.env.REGISTER_BUSINESS_SHORT_CODE,
      ResponseType: "Complete",
      ConfirmationURL: "https://elosystemv1.onrender.com/api/newpay/confirmation",
      ValidationURL: "https://elosystemv1.onrender.com/api/newpay/validation",
    }, {
      headers: { Authorization: "Bearer " + accessToken }
    });
    res.status(200).json(response.data);
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
    const accessToken = await getAccessToken();
    const securityCredential = process.env.SECURITYCREDENTIAL; // Your Security Credential here
    const url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
    const response = await axios.post(url, {
      InitiatorName: "BAZELINK",
      SecurityCredential: securityCredential,
      CommandID: "PromotionPayment",
      Amount: "1",
      PartyA: process.env.REGISTER_BUSINESS_SHORT_CODE,
      PartyB: "254742243421", // Phone number to receive funds
      Remarks: "Withdrawal",
      QueueTimeOutURL: "https://elosystemv1.onrender.com/api/newpay/b2c/queue",
      ResultURL: "https://elosystemv1.onrender.com/api/newpay/b2c/result",
      Occasion: "Withdrawal",
    }, {
      headers: { Authorization: "Bearer " + accessToken }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send("❌ B2C request failed");
  }
};

exports.b2cRequestHandler = async (Amount, Phonenumber) => {
    try {
      const accessToken = await getAccessToken();
      const securityCredential = process.env.SECURITYCREDENTIAL; // Your Security Credential here
      const url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
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