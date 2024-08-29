import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import './styles/productlist.css';
import { Link } from 'react-router-dom';  // Ensure you have this for routing

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
                  <Link to={`/products/${product._id}`}> {/* Link to Product Details */}
                    <img src={product.imageUrl} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <h4>${product.price}</h4>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <>
          <p>Product not found.</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </>
      )}
    </div>
  );
};

export default ProductList;
