import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { getUsernameFromToken } from "../utils/auth";
import './styles/ReviewList.css'; // Import the CSS file

const ReviewList = ({ productId, onReviewAction }) => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const username = getUsernameFromToken();

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(
          `/review/${productId}`
        );
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [productId, onReviewAction]);

  // Automatically change displayed reviews every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 3 >= reviews.length ? 0 : prevIndex + 3
      );
    }, 3000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [reviews]);

  // Slice reviews to show three at a time
  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3);

  return (
    <div className="listrevp-container">
      <h2 className="listrevp-title">Product Reviews</h2>
      {reviews.length === 0 ? (
        <p className="listrevp-no-reviews">Be the first to review this product!</p>
      ) : (
        visibleReviews.map((review) => (
          <div key={review._id} className="listrevp-review-card">
            <div className="listrevp-header">
              <h4 className="listrevp-username">{review.user.username}</h4>
              <p className="listrevp-rating">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </p>
            </div>
            <p className="listrevp-comment">{review.comment}</p>
            {review.user.username === username && (
              <div className="listrevp-actions">
                <button
                  className="listrevp-action-button listrevp-edit-button"
                  onClick={() => onReviewAction("edit", review)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="listrevp-action-button listrevp-delete-button"
                  onClick={() => onReviewAction("delete", review._id)}
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
