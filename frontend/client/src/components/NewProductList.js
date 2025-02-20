import React, { useEffect, useState, useRef, useCallback } from 'react';
import ProductModal from './ProductModal';
import axiosInstance from './axiosInstance';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { storeSearch, getSearchHistory, trackProductClick } from '../utils/search';
import { FaShop } from "react-icons/fa6";
import { useIsMobile } from '../utils/mobilecheck';
import './styles/NewProductList.css';
import { jwtDecode } from 'jwt-decode';
import categories from './categories.js';
import { useNavigate } from 'react-router-dom';

const NewProductList = () => {
  const navigate = useNavigate();
  
  // Core states for products and pagination
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // Updated to false initially
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Flag to check if more products exist

  // Other states remain unchanged
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageIndexes, setImageIndexes] = useState({});
  const isMobile = useIsMobile();
  const PRODUCTS_PER_PAGE = 5;
  const CATEGORIES_PER_PAGE = isMobile ? 3 : 7;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: Infinity,
    brand: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [shops, setShops ] = useState(false);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const [sellers, setSellers] = useState([]);
  const [currentsellerPage, setCurrentsellerPage] = useState(1);
  const sellersPerPage = 40;

  // Fetch sellers (unchanged)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users/users');
        const filteredSellers = response.data.filter(user => user.category === 'Seller');
        setSellers(filteredSellers);
        setError(null);
      } catch (error) {
        setError('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  // New: Fetch products with server-side pagination
  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      // Adjust your API to accept 'page' and 'limit' as query parameters
      const response = await axiosInstance.get('/products', { 
        params: { page, limit: PRODUCTS_PER_PAGE } 
      });
      // If we're on the first page, reset the list; otherwise, append new products
      setProducts(prev => page === 1 ? response.data.products : [...prev, ...response.data.products]);
      // If fewer products are returned than requested, no more products are available
      setHasMore(response.data.products.length === PRODUCTS_PER_PAGE);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Load products whenever currentPage changes
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Infinite scrolling logic using IntersectionObserver
  const observer = useRef();
  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      // If the last product is in view and more products are available, load the next page
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Autocomplete suggestions, image index updater, session syncing, filters, category handlers remain similar...
  // (Retain your existing useEffects and functions for suggestions, image indexes, syncing, etc.)

  // For brevity, we keep other functionalities intact, like search handling and category pagination

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    storeSearch(product.category, product.subCategory);
    navigate(`/productmodelpage/${product._id}`);
  };

  const calculateDiscountedPrice = (product) => {
    const discountAmount = product.discount
      ? (product.price * product.discountpersentage) / 100
      : 0;
    const discountedPrice = product.discount ? product.price - discountAmount : product.price;
    return {
      discountedPrice: discountedPrice.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
    };
  };

  const taggleShops = async () => {
    setShops(!shops);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      <header className="product-list-header">
        {/* Keep your search input, filters, and suggestion dropdown as-is */}
        <input
          type="text"
          placeholder="Search for products or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => !isFocused && setSuggestions([]), 200)}
          className="product-search"
        />
        <div className="suggestions-wrapper">
          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onMouseDown={() => {
                    setSearchTerm(suggestion.name);
                    setSuggestions([]);
                  }}
                  className="suggestion-item"
                  dangerouslySetInnerHTML={{
                    __html: suggestion.name.replace(new RegExp(`(${searchTerm})`, 'gi'), '<span class="highlight">$1</span>'),
                  }}
                ></li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="number"
          placeholder="Filter by Max Price"
          value={filters.maxPrice || ""}
          onChange={(e) => {
            const maxPrice = e.target.value ? Number(e.target.value) : "";
            setFilters(prev => ({ ...prev, minPrice: 0, maxPrice }));
          }}
          className="max-price-input no-spinner"
        />
        <button onClick={taggleShops}><FaShop /></button>
      </header>

      {/* Categories Section remains similar */}
      <div className="categories">
        <button className="category-btnn" onClick={() => setCurrentCategoryPage(prev => Math.max(prev - 1, 1))}>
          <AiFillCaretLeft />
        </button>
        <div className="category-container">
          <button
            className={`category-btn ${selectedCategory === " " ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            ALL
          </button>
        </div>
        {categories.slice((currentCategoryPage - 1) * CATEGORIES_PER_PAGE, currentCategoryPage * CATEGORIES_PER_PAGE)
          .map(category => (
            <div key={category.id} className="category-container">
              <button
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            </div>
        ))}
        <button className="category-btnn" onClick={() => setCurrentCategoryPage(prev => prev + 1)} disabled={currentCategoryPage * CATEGORIES_PER_PAGE >= categories.length}>
          <AiFillCaretRight />
        </button>
      </div>

      {/* Toggle between shops view and product list */}
      {shops ? (
        // ... Shop listing code remains unchanged ...
        <div className="usal-dashboard">
          <h1 className="usal-dashboard-title">All Shops </h1>
          {error && <div className="usal-error-message">{error}</div>}
          <div className="usal-user-grid">
            {sellers.slice((currentPage - 1) * sellersPerPage, currentPage * sellersPerPage)
              .map(user => (
              <div key={user._id} className="usal-user-item">
                <a 
                  href={`https://www.bazelink.co.ke/shop?businessname=${user.username}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="usal-user-link"
                >
                  {user.username}
                </a>
              </div>
            ))}
          </div>
          {/* Seller pagination controls remain similar */}
        </div>
      ) : (
        <div className="product-cards">
          {products.map((product, index) => {
            // Attach the observer ref to the last product element
            const isLastProduct = products.length === index + 1;
            const { discountedPrice, discountAmount } = calculateDiscountedPrice(product);
            const isOutOfStock = product.quantity === 0;
            const imageSrc = product.images ? product.images[0] : product.image;
            return (
              <div
                ref={isLastProduct ? lastProductRef : null}
                key={product._id}
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <div className="product-image-wrapper">
                  <img src={imageSrc} alt={product.name} className="product-image" loading="lazy" />
                  {product.isNew && <span className="product-badge new-badge">New</span>}
                  {product.isOnSale && <span className="product-badge sale-badge">Sale</span>}
                  {isOutOfStock && <span className="product-badge sold-out-badge">Sold Out</span>}
                </div>
                <h3>{product.name}</h3>
                {product.lable && <span className={`product-badge label-badge`}>{product.lable}</span>}
                <div className="product-prices">
                  {product.discount ? (
                    <>
                      <h4 className="old-price">
                        <s>Ksh {product.price.toFixed(2)}</s>
                      </h4>
                      <h4 className="new-price">Ksh {discountedPrice}</h4>
                      <p className="discount-amount">
                        Save Ksh {discountAmount} ({product.discountpersentage}% off)
                      </p>
                    </>
                  ) : (
                    <h4 className='product-prices'>Ksh {product.price.toFixed(2)}</h4>
                  )}
                </div>
                {!isOutOfStock && <p className="stock-info">Stock: {product.quantity}</p>}
              </div>
            );
          })}
          {loading && <div className="spinner"></div>}
          {!loading && products.length === 0 && <p>No products found</p>}
        </div>
      )}

      {/* Optional: You can remove or adjust the manual pagination if infinite scroll is sufficient */}
    </div>
  );
};

export default NewProductList;
