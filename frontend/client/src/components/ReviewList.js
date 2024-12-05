import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUsernameFromToken } from '../utils/auth';

const ReviewList = ({ productId, onReviewAction }) => {
  const [reviews, setReviews] = useState([]);
  const username = getUsernameFromToken();

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://elosystemv1.onrender.com/api/review/${productId}`
        );
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [productId, onReviewAction]); // Re-fetch on review actions (add/edit/delete)

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id}>
            <h4>{review.user.username}</h4>
            <p>Rating: {review.rating}</p>
            <p>{review.comment}</p>
            {review.user.username === username && ( // Replace "Teekay" with current user's username
              <div>
                <button onClick={() => onReviewAction("edit", review)}>Edit</button>
                <button onClick={() => onReviewAction("delete", review._id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
