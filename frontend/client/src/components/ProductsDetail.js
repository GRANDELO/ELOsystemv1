import React, { useRef } from "react";
import { toPng } from "html-to-image";
import './styles/ProductDetails.css';

const ProductDetails = ({ product }) => {
  const sectionRef = useRef(null);

  const downloadSectionAsImage = () => {
    if (sectionRef.current) {
      toPng(sectionRef.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `${product.name}-details.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error("Error generating image:", err);
        });
    }
  };

  return (
    <div>
      <div ref={sectionRef} className="product-details-container">
        
        <div className="product-details-m">
        <h2>{product.name}</h2>
          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>
          <div className="product-features">
            {product.features && product.features.length > 0 ? (
              <ul>
                <h3>Features:</h3>
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <strong>{feature.type}:</strong> {feature.specification}
                  </li>
                ))}
              </ul>
            ) : (
              ""
            )}
          </div>
          <button onClick={downloadSectionAsImage} className="download-button">
            Download Details as Image
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
