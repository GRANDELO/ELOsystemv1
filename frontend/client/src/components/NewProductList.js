import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import axiosInstance from './axiosInstance';
import './styles/NewProductList.css';

const NewProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageIndexes, setImageIndexes] = useState({});

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

            return (
              <div key={product._id} className="product-card">
                <div className="product-image-wrapper">
                  <img src={imageSrc} alt={product.name} className="product-image" />
                  {product.isNew && <span className="product-badge new-badge">New</span>}
                  {product.isOnSale && <span className="product-badge sale-badge">Sale</span>}
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <h4>Ksh {product.price}</h4>
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
