const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { calculateTrialBalance } = require("../controllers/transactionController");

router.post("/", transactionController.createTransaction);  // Create a new transaction
router.get("/:accountId", transactionController.getTransactionsByAccount);  // Get transactions by account
router.get("/", transactionController.getAllTransactions); 
router.get("/trial-balance", async (req, res) => {
    try {
      const trialBalanceData = await calculateTrialBalance();  // Call the function to calculate the trial balance
      res.json(trialBalanceData);  // Send the calculated trial balance to the frontend
    } catch (error) {
      console.error("Error fetching trial balance:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
module.exports = router;
