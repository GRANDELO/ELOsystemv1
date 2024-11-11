const express = require("express");
const router = express.Router();
const mpesaController = require("../controllers/mpesaController");

router.get("/access_token", mpesaController.getAccessTokenHandler);
router.get("/stkpush", mpesaController.stkPushHandler);
router.post("/callback", mpesaController.stkPushCallbackHandler);
router.get("/registerurl", mpesaController.registerURLHandler);
router.get("/confirmation", mpesaController.confirmURLHandler);
router.get("/validation", mpesaController.validateURLHandler);
router.get("/b2curlrequest", mpesaController.b2cRequestHandler);

module.exports = router;
