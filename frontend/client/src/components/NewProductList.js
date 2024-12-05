import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import Review from './review';
import axiosInstance from './axiosInstance';
import ReviewList from "./ReviewList";
import AddEditReview from "./AddEditReview";
import axios from 'axios';
import { getUsernameFromToken } from '../utils/auth';

import './styles/NewProductList.css';

const NewProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageIndexes, setImageIndexes] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(false);
  
  const [reviews, setReviews] = useState([]);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const currentUser = getUsernameFromToken(); // Replace with getUsernameFromToken();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const updateImageIndexes = () => {
      setImageIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        products.forEach((product) => {
          if (product.images && product.images.length > 1) {
            // Rotate through images for each product
            const currentIndex = prevIndexes[product._id] || 0;
            newIndexes[product._id] = (currentIndex + 1) % product.images.length;
          }
        });
        return newIndexes;
      });
    };

    const intervalId = setInterval(updateImageIndexes, 4000); // Update every 4 seconds

    // Clear the interval when component unmounts or products change
    return () => clearInterval(intervalId);
  }, [products]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleReviewAction = (action, data) => {
    if (action === "edit") {
      setEditingReview(data); // Pass review data to edit
    } else if (action === "delete") {
      handleDeleteReview(data); // Pass review ID to delete
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `https://elosystemv1.onrender.com/api/review/delete/${reviewId}`
      );
      alert("Review deleted successfully!");
      setRefreshReviews((prev) => !prev); // Trigger refresh
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review.");
    }
  };

  const handleReviewActionComplete = () => {
    setEditingReview(null);
    setRefreshReviews((prev) => !prev); // Trigger refresh
  };
  
  const filterAndSortProducts = () => {
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aMatch =
          a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.category.toLowerCase().includes(searchTerm.toLowerCase());
        const bMatch =
          b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.category.toLowerCase().includes(searchTerm.toLowerCase());
        return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
      });
  };



  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  const filteredProducts = filterAndSortProducts();

  // Helper function to calculate price after discount
  const calculateDiscountedPrice = (product) => {
    const discountAmount = product.discount
      ? (product.price * product.discountpersentage) / 100
      : 0;
    const discountedPrice = product.discount ? product.price - discountAmount : product.price;
    return {
      discountedPrice: discountedPrice.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
    };
  };

  

  return (
    <div className="product-list">
      <header className="product-list-header">
        <input
          type="text"
          placeholder="Search for products or categories..."
          value={searchTerm}
          onChange={handleSearch}
          className="product-search"
        />
      </header>

      <div className="product-cards">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const currentImageIndex = imageIndexes[product._id] || 0;
            const imageSrc = product.images ? product.images[currentImageIndex] : product.image;
            const { discountedPrice, discountAmount } = calculateDiscountedPrice(product);

            return (
              <div key={product._id} className="product-card">
                <div className="product-image-wrapper">
                  <img src={imageSrc} alt={product.name} className="product-image" />
                  {product.isNew && <span className="product-badge new-badge">New</span>}
                  {product.isOnSale && <span className="product-badge sale-badge">Sale</span>}
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {product.lable && <span className={`product-badge label-badge`}>{product.lable}</span>}
                <div className="product-prices">
                  {product.discount ? (
                    <>
                      <h4 className="old-price">
                        <s>Ksh {product.price.toFixed(2)}</s>
                      </h4>
                      <h4 className="new-price">Ksh {discountedPrice}</h4>
                      <p className="discount-amount">
                        Save Ksh {discountAmount} ({product.discountpersentage}% off)
                      </p>
                    </>
                  ) : (
                    <h4>Ksh {product.price.toFixed(2)}</h4>
                  )}
                </div>
                <ReviewList
                    productId={product._id} 
                    onReviewAction={handleReviewAction} 
                 />
                <AddEditReview
                        productId={product._id}
                        reviewToEdit={reviewToEdit}
                        currentUser={currentUser}
                        onReviewActionComplete={handleReviewActionComplete}
                />
                {/*<Review
                productId={product._id}
                />*/}
                <button className="view-details-btn" onClick={() => handleProductClick(product)}>
                  View Details
                </button>
              </div>
            );
          })
        ) : (
          <p>No products found</p>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          show={isModalOpen}
          handleClose={closeModal}
        />
      )}
    </div>
  );
};

export default NewProductList;
