import React, { useState } from "react";

const ProductDetails = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to download the current image
  const downloadImage = () => {
    if (product?.images?.length > 0) {
      const imageUrl = product.images[currentImageIndex];
      const link = document.createElement("a");

      // Set the href to the image URL
      link.href = imageUrl;

      // Set the download attribute to specify the filename for the image
      link.setAttribute('download', `product-image-${currentImageIndex + 1}.jpg`);

      // Append the link to the DOM and click it to trigger the download
      link.click();
    }
  };

  return (
    <div>
      <div className="product-image-container">
        {product?.images?.length > 0 ? (
          <img
            src={product.images[currentImageIndex]}
            alt={`product-image-${currentImageIndex}`}
            className="product-image"
          />
        ) : (
          <p className="no-image-text">No images available for this product.</p>
        )}
      </div>

      {/* Download button */}
      {product?.images?.length > 0 && (
        <button
          onClick={downloadImage}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Download Image
        </button>
      )}
    </div>
  );
};

export default ProductDetails;
