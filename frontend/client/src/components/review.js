import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUsernameFromToken } from "../utils/auth";
import AddEditReview from "./AddEditReview";
import { useLocation, useNavigate } from "react-router-dom";
import Prodectrev from "./NewProductDetail";
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
      sessionStorage.setItem('currentpage', `review?productId=${productId}`);
      const interval = setInterval(() => {
        navigate("/");
      }, 3000); // Change the image every 3 seconds
      return () => clearInterval(interval);
    }

    if (productId) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(
            `https://elosystemv1.onrender.com/api/review/product/${productId}`
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
      await axios.delete(
        `https://elosystemv1.onrender.com/api/review/delete/${reviewId}`
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
    <div>
      <h1>Product Reviews</h1>
      {/* Add/Edit Review Form */}
      <Prodectrev
        id={productId}
      />
      <AddEditReview
        productId={productId}
        reviewToEdit={reviewToEdit}
        currentUser={currentUser}
        onReviewActionComplete={handleReviewActionComplete}
      />
    </div>
  );
};

export default ProductPage;
