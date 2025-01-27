const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

router.post("/", accountController.createAccount);  // Create a new account
router.get("/", accountController.getAccounts);     // Get all accounts

module.exports = router;
