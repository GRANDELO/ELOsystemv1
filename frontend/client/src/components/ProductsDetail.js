import React, { useRef } from "react";
import { toPng } from "html-to-image";

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
      <div
        ref={sectionRef}
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          width: "300px",
          background: "#fff",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>{product.name}</h2>
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
      </div>


      <button
        onClick={downloadSectionAsImage}
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
        Download Details as Image
      </button>
    </div>
  );
};

export default ProductDetails;
