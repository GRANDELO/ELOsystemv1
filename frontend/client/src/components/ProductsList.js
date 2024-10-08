import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import './styles/productlist.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const categorizedProducts = categorizeProducts();

  return (
    <div className="product-list">
      {Object.keys(categorizedProducts).length > 0 ? (
        Object.keys(categorizedProducts).map(category => (
          <div key={category} className="product-category">
            <h2>{category}</h2>
            <div className="product-cards">
              {categorizedProducts[category].map(product => (
                <div key={product._id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <h4>ksh{product.price}</h4>
                  <a href={`/products/${product._id}`} className="view-details-link">View Details</a>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : null}
    </div>
  );
};

export default ProductList;
