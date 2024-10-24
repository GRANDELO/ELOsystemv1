const express = require('express');
const { confirmPayment, initiateSTKPush, stkPushCallback } = require("../controllers/controllers.lipanampesa.js");
const { accessToken } = require("../middlewares/middlewares.generateAccessToken.js");

const router = express.Router();

router.route('/stkPush').post(accessToken, initiateSTKPush);
router.route('/stkPushCallback/:Order_ID').post(stkPushCallback);
router.route('/confirmPayment/:CheckoutRequestID').post(accessToken, confirmPayment);

module.exports = router;
