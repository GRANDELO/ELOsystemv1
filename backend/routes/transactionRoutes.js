const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.post("/", transactionController.createTransaction);  // Create a new transaction
router.get("/:accountId", transactionController.getTransactionsByAccount);  // Get transactions by account

module.exports = router;
