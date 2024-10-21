import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import axiosInstance from './axiosInstance'; // Use axios instance instead of axios
import './styles/NewProductList.css';

const NewProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');  // Use axios instance
        setProducts(response.data.products);  // Assuming products are inside response.data.products
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categorizeProducts = () => {
    const categories = {};
    products.forEach(product => {
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterAndSortProducts = (categoryProducts) => {
    return categoryProducts
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

  const categorizedProducts = categorizeProducts();

  return (
    <div className="product-list">
      <input
        type="text"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={handleSearch}
        className="product-search"
      />

      {/* Display categorized products */}
      {Object.keys(categorizedProducts).map(category => {
        const filteredProducts = filterAndSortProducts(categorizedProducts[category]);

        return (
          <div key={category} className="product-category">
            <h2>{category}</h2>
            <div className="product-cards">
              {filteredProducts.map(product => (
                <div key={product._id} className="product-card">
                   <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <h4>Ksh {product.price}</h4>
                  <button onClick={() => handleProductClick(product)}>View Details</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

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
