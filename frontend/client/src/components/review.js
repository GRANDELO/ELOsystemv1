import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { getUsernameFromToken } from "../utils/auth";
import AddEditReview from "./AddEditReview";
import { useLocation, useNavigate } from "react-router-dom";
import Prodectrev from "./NewProductDetail";
import './styles/review.css';

const ProductPage = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");

  const currentUser = getUsernameFromToken(); // Replace with your actual function

  useEffect(() => {
    if (!currentUser) {
      alert("You have to sign in to complete the order.");
      sessionStorage.setItem("currentpage", `review?productId=${productId}`);
      const interval = setInterval(() => {
        navigate("/login");
      }, 3000);
      return () => clearInterval(interval);
    }

    if (productId) {
      const fetchReviews = async () => {
        try {
          const response = await axiosInstance.get(
            `/review/product/${productId}`
          );
          setReviews(response.data);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
      fetchReviews();
    }
  }, [currentUser, navigate, productId, refreshReviews]);

  const handleReviewActionComplete = () => {
    setReviewToEdit(null); // Clear editing state
    setRefreshReviews((prev) => !prev); // Trigger refresh
  };

  const handleEditClick = (review) => {
    setReviewToEdit(review);
  };

  const handleDeleteClick = async (reviewId) => {
    try {
      await axiosInstance.delete(
        `/review/delete/${reviewId}`
      );
      alert("Review deleted successfully!");
      setRefreshReviews((prev) => !prev); // Trigger refresh
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review.");
    }
  };

  if (!currentUser) {
    return null; // Avoid rendering if user is not logged in
  }

  return (
    <div className="revp-container">
      <h1 className="revp-header">Product Reviews</h1>

      {/* Add/Edit Review Form */}
      <div className="revp-add-edit-container">
        <Prodectrev id={productId} />
        <AddEditReview
          productId={productId}
          reviewToEdit={reviewToEdit}
          currentUser={currentUser}
          onReviewActionComplete={handleReviewActionComplete}
        />
      </div>

      {/* Reviews List */}
      <ul className="revp-review-list">
        {reviews.map((review) => (
          <li key={review._id} className="revp-review-item">
            <h2 className="revp-review-title">{review.title}</h2>
            <p className="revp-review-content">{review.content}</p>
            <p className="revp-review-author">
              Reviewed by: {review.author || "Anonymous"}
            </p>
            <div className="revp-buttons">
              <button
                className="revp-button"
                onClick={() => handleEditClick(review)}
              >
                Edit
              </button>
              <button
                className="revp-button revp-delete-button"
                onClick={() => handleDeleteClick(review._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductPage;
