import express from 'express';
import {
    confirmPayment,
    initiateSTKPush,
    stkPushCallback
} from "../controllers/controllers.lipanampesa.js";
const router = express.Router()


import { accessToken } from "../middlewares/middlewares.generateAccessToken.js";

router.route('/stkPush').post(accessToken,initiateSTKPush)
router.route('/stkPushCallback/:Order_ID').post(stkPushCallback)
router.route('/confirmPayment/:CheckoutRequestID').post(accessToken,confirmPayment)

export default router
