import React, { useState } from "react";
import axios from "axios";
import './styles/AddEditReview.css'; // Import the CSS file

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
          { rating, comment, currentUser}
        );
        alert("Review updated successfully!");
      } else {
        // Add review
        await axios.post("https://elosystemv1.onrender.com/api/review/add", {
          productId,
          userId: currentUser,
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
    <div className="aerevp-container">
      <h2 className="aerevp-title">
        {reviewToEdit ? "Edit Your Review" : "Add a New Review"}
      </h2>
      <div className="aerevp-rating-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`aerevp-star ${
              star <= rating ? "aerevp-star-active" : ""
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        className="aerevp-textarea"
        placeholder="Write your review here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button className="aerevp-button" onClick={handleSubmit}>
        {reviewToEdit ? "Update Review" : "Submit Review"}
      </button>
    </div>
  );
};

export default AddEditReview;
