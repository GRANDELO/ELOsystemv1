import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUsernameFromToken } from '../utils/auth';
const ProductPage = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const user = getUsernameFromToken();
  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/review/${productId}`);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [productId]);

  // Add a review
  const handleAddReview = async () => {
    if (!user) {
      alert("Please log in to add a review.");
      return;
    }

    try {
      await axios.post("https://elosystemv1.onrender.com/api/review/add", {
        productId,
        userId: user, // Get user ID from your authentication system
        rating,
        comment,
      });
      setRating(0);
      setComment("");
      alert("Review added!");
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to add review.");
    }
  };

  return (
    <div>
      <h1>Product Name</h1>

      {/* Display the product's average rating */}
      <h3>Average Rating: </h3>

      {/* Display reviews */}
      <div>
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id}>
              <h4>{review.userId.username}</h4>
              <p>Rating: {review.rating}</p>
              <p>{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Add a review */}
      <h2>Add a Review</h2>
      <select onChange={(e) => setRating(Number(e.target.value))} value={rating}>
        <option value={0}>Select Rating</option>
        {[1, 2, 3, 4, 5].map((star) => (
          <option key={star} value={star}>
            {star} Star{star > 1 && "s"}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Write your review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={handleAddReview}>Submit Review</button>
    </div>
  );
};

export default ProductPage;
