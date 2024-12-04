// routes/review.js

const express = require("express");
const Review = require("../models/Review");
const Product = require("../models/oProduct");
const User = require("../models/User");
const router = express.Router();

// Add a review
router.post("/add", async (req, res) => {
    const { productId, userId, rating, comment } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ username: userId });
      if (!user) {
        return res.status(404).json({ message: "The user doesn't exist." });
      }
  
      // Create and save the review
      const review = new Review({ productId, user: user._id, rating, comment });
      await review.save();
  
      // Fetch all reviews for the product
      const reviews = await Review.find({ productId });
  
      // Calculate average rating
      const avgRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
      // Update product rating
      await Product.findByIdAndUpdate(productId, { rating: avgRating });
  
      res.status(201).json({ message: "Review added successfully!", review });
    } catch (err) {
      res.status(500).json({ message: "Error adding review", error: err.message });
    }
  });

// Get reviews for a product
router.get("/:productId", async (req, res) => {
    const { productId } = req.params;
  
    try {
      const reviews = await Review.find({ productId }).populate("user", "username");
      res.status(200).json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Error fetching reviews", error: err.message });
    }
  });
  
// Update a review
router.put("/edit/:reviewId", async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { rating, comment },
      { new: true }
    );
    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: "Error updating review", error: err.message });
  }
});

// Delete a review
router.delete("/delete/:reviewId", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting review", error: err.message });
  }
});

module.exports = router;
