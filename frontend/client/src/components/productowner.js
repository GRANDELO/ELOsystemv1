import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModalowner';
import axiosInstance from './axiosInstance'; // Use axios instance instead of axios
import './styles/NewProductList.css';

const NewProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState(sessionStorage.getItem('username') || '');
  const [imageIndexes, setImageIndexes] = useState({});

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

  const filterAndSortProducts = () => {
    // Filter products based on the username and search term
    return products
      .filter((product) => {
        const matchesUsername = product.username === username; // Only show products belonging to this username
        const matchesSearchTerm =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesUsername && matchesSearchTerm;
      })
      .sort((a, b) => {
        // Sort based on search relevance
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

      {/* Display products in a single grid */}
      <div className="product-cards">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const currentImageIndex = imageIndexes[product._id] || 0; // Get current image index
            const imageSrc = product.images && product.images.length > 0 ? product.images[currentImageIndex] : null;

            // Calculate discount and new price if discount is true
            const hasDiscount = product.discount === true;
            const discountAmount = hasDiscount ? (product.price * product.discountpersentage) / 100 : 0;
            const newPrice = hasDiscount ? product.price - discountAmount : product.price;

            return (
              <div key={product._id} className="product-card">
                <div className="product-image-wrapper">
                  {imageSrc ? (
                    <img src={imageSrc} alt={product.name} className="product-image" />
                  ) : (
                    <p>No images available for this product.</p>
                  )}
                  
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {product.lable && <span className={`product-badge label-badge`}>{product.lable}</span>}
                <div className="product-prices">
                  {hasDiscount ? (
                    <>
                      <h4 className="old-price">
                        <s>Ksh {product.price.toFixed(2)}</s>
                      </h4>
                      <h4 className="new-price">Ksh {newPrice.toFixed(2)}</h4>
                      <p className="discount-amount">
                        Save Ksh {discountAmount.toFixed(2)} ({product.discountpersentage}% off)
                      </p>
                    </>
                  ) : (
                    <h4>Ksh {product.price}</h4>
                  )}
                </div>
                <p>In stock {product.quantity}</p>
                <button className="view-details-btn" onClick={() => handleProductClick(product)}>
                  View Details
                </button>
              </div>
            );
          })
        ) : (
          <p>No products found for {username}</p>
        )}
      </div>

      {/* Modal for selected product */}
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
