import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import './styles/productlist.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 30;

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

  // Calculate paginated products based on screen size
  const screenWidth = window.innerWidth;
  const displayedProducts = screenWidth < 768 ? products : products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const categorizeProducts = (productList) => {
    const categories = {};
    productList.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });
    return categories;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const categorizedProducts = categorizeProducts(displayedProducts);

  return (
    <div className="product-list">
      {Object.keys(categorizedProducts).map(category => (
        <div key={category} className="product-category">
          <h2>{category}</h2>
          <div className="product-cards">
            {categorizedProducts[category].map(product => {
              const hasDiscount = product.discount === true;
              const discountAmount = hasDiscount ? (product.price * product.discountpersentage) / 100 : 0;
              const newPrice = hasDiscount ? product.price - discountAmount : product.price;

              return (
                <div key={product._id} className="product-card">
                  <img src={product.image} alt={product.name} />
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
                  <a href={`/products/${product._id}`} className="view-details-link">View Details</a>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Pagination controls */}
      {screenWidth >= 768 && totalPages > 1 && (
        <div className="pagination">
          <button onClick={previousPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
