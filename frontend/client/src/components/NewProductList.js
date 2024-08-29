import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
//import Footer from './Footer';
import './styles/NewProductList.css';

const NewProductList = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    return newProducts
      .filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.category.toLowerCase().includes(searchTerm.toLowerCase());
        const bMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.category.toLowerCase().includes(searchTerm.toLowerCase());
        return (aMatch === bMatch) ? 0 : aMatch ? -1 : 1;
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredProducts = filterAndSortProducts();

  return (
    <div className="product-list">
      <input
        type="text"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={handleSearch}
        className="product-search"
      />
      <div className="product-cards">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.imageUrl || 'path/to/placeholder.jpg'} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <h4>Ksh {product.price}</h4>
            <button onClick={() => handleProductClick(product)}>View Details</button>
          </div>
        ))}
      </div>
      <ProductModal
        product={selectedProduct}
        show={isModalOpen}
        handleClose={closeModal}
      />

    </div>
  );
};

export default NewProductList;
