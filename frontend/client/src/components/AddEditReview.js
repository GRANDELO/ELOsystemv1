import React, { useState } from "react";
import axios from "axios";

const AddEditReview = ({
  productId,
  reviewToEdit,
  onReviewActionComplete,
  currentUser,
}) => {
  const [rating, setRating] = useState(reviewToEdit?.rating || 0);
  const [comment, setComment] = useState(reviewToEdit?.comment || "");

  const handleSubmit = async () => {
    try {
      if (reviewToEdit) {
        // Edit review
        await axios.put(
          `https://elosystemv1.onrender.com/api/review/edit/${reviewToEdit._id}`,
          { rating, comment }
        );
        alert("Review updated successfully!");
      } else {
        // Add review
        await axios.post("https://elosystemv1.onrender.com/api/review/add", {
          productId,
          userId: currentUser, // Use dynamic user ID
          rating,
          comment,
        });
        alert("Review added successfully!");
      }
      onReviewActionComplete();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review.");
    }
  };

  return (
    <div>
      <h2>{reviewToEdit ? "Edit Review" : "Add a Review"}</h2>
      {/* Rating with stars */}
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{
              cursor: "pointer",
              fontSize: "24px",
              color: star <= rating ? "gold" : "gray",
            }}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Write your review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={handleSubmit}>
        {reviewToEdit ? "Update Review" : "Submit Review"}
      </button>
    </div>
  );
};

export default AddEditReview;
