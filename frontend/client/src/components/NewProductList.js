import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import './styles/NewProductList.css';

const NewProductList = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await axios.get('https://elosystemv1.onrender.com/api/newproducts');
        setNewProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  const categorizeProducts = () => {
    const categories = {};
    newProducts.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });
    return categories;
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const categorizedProducts = categorizeProducts();

  return (
    <div className="product-list">
      {Object.keys(categorizedProducts).map(category => (
        <div key={category} className="product-category">
          <h2>{category}</h2>
          <div className="product-cards">
            {categorizedProducts[category].map(product => (
              <div key={product._id} className="product-card">
                <img src={product.imageUrl || 'path/to/placeholder.jpg'} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <h4>Ksh {product.price}</h4>
                <button onClick={() => handleProductClick(product)}>View Details</button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <ProductModal
        product={selectedProduct}
        show={isModalOpen}
        handleClose={closeModal}
      />
    </div>
  );
};

export default NewProductList;