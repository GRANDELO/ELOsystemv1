import axiosInstance from "./axiosInstance";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const NewProductDetails =  ({ id }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // For image cycling

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(
          `/products/${id}`
        );
        console.log("Product data:", response.data);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Error fetching product");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Rotate through images if the product has multiple images
    if (product?.images?.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }
  }, [product]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const imageSrc = product.images?.[currentImageIndex] || "/default-image.jpg"; // Fallback image

  return (
    <div>
      <div key={product._id} className="product-details-container">
      <div className="product-image-containe">
            {product?.images?.length > 0 ? (
              <img
                src={product.images[currentImageIndex]}
                alt={`product-image-${currentImageIndex}`}
                className="product-imager"
              />
            ) : (
              <p className="no-image-text">No images available for this product.</p>
            )}
          </div>
        <h3>{product.name}</h3>
        <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>
      </div>
    </div>
  );
};

export default NewProductDetails;
