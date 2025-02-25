import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import { Alert, Button, Form } from 'react-bootstrap';
import axiosInstance from './axiosInstance';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { storeSearch, getSearchHistory, trackProductClick } from '../utils/search';
import { FaShop } from "react-icons/fa6";
import { useIsMobile } from '../utils/mobilecheck';
import './styles/NewProductList.css';
import { jwtDecode } from 'jwt-decode';
import categories from './categories.js';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart} from 'react-icons/fa';
import { getUsernameFromToken } from '../utils/auth';

const NewProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageIndexes, setImageIndexes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const PRODUCTS_PER_PAGE = 32;
  const CATEGORIES_PER_PAGE = isMobile ? 3 : 7;
  const username = getUsernameFromToken();

  const [loginPrompt, setLoginPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: Infinity,
    brand: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [shops, setShops] = useState(false);

  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const [sellers, setSellers] = useState([]);
  const [currentsellerPage, setCurrentsellerPage] = useState(1);
  const sellersPerPage = 40;

  // Seller Pagination Logic
  const indexOfLastSeller = currentPage * sellersPerPage;
  const indexOfFirstSeller = indexOfLastSeller - sellersPerPage;
  const currentSellers = sellers.slice(indexOfFirstSeller, indexOfLastSeller);
  const totalsellerPages = Math.ceil(sellers.length / sellersPerPage);

  // Fetch sellers
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

  // Fetch products with graceful loading (you could later implement server-side pagination)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        // Randomize products on the client side
        setProducts(response.data.products.sort(() => Math.random() - 0.5));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Autocomplete: Fetch suggestions as user types, with debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axiosInstance.get('/autocomplete', {
          params: { query: searchTerm },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]);
    setCurrentPage(1);
    setIsFocused(false);
  };

  // Helper to escape special regex characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Highlight matching search terms in suggestions
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!isFocused) {
        setSuggestions([]);
      }
    }, 200);
  };

  // Update image indexes for products with multiple images
  useEffect(() => {
    const updateImageIndexes = () => {
      setImageIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        products.forEach((product) => {
          if (product.images && product.images.length > 1) {
            const currentIndex = prevIndexes[product._id] || 0;
            newIndexes[product._id] = (currentIndex + 1) % product.images.length;
          }
        });
        return newIndexes;
      });
    };

    const intervalId = setInterval(updateImageIndexes, 4000);
    return () => clearInterval(intervalId);
  }, [products]);

  // Sync session data to backend periodically
  const syncSessionToBackend = async () => {
    const searchHistory = getSearchHistory();
    const clickHistory = JSON.parse(sessionStorage.getItem('clickHistory')) || {};
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("token missing or invalid.");
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return;
    }

    const actions = [
      ...Object.keys(searchHistory).flatMap(category =>
        Object.keys(searchHistory[category]).map(subCategory => ({
          userId,
          actionType: 'search',
          category,
          subCategory,
        }))
      ),
      ...Object.keys(clickHistory).map(productId => ({
        userId,
        actionType: 'click',
        productId,
      })),
    ];

    try {
      for (const action of actions) {
        await axiosInstance.post('/track', action);
      }
    } catch (error) {
      console.error('Error syncing session data to backend:', error.response?.data || error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(syncSessionToBackend, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Filter search functionality
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    storeSearch(product.category, product.subCategory);
    navigate(`/productmodelpage/${product._id}`);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleShowMoreCategories = () => {
    setShowMoreCategories(!showMoreCategories);
  };

  const handleCategoryPageChange = (direction) => {
    setCurrentCategoryPage((prevPage) => {
      const newPage = prevPage + direction;
      if (newPage < 1) return 1;
      const totalPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
      if (newPage > totalPages) return totalPages;
      return newPage;
    });
  };

  const filterAndSortProducts = () => {
    const searchHistory = getSearchHistory();
    const clickHistory = JSON.parse(sessionStorage.getItem("clickHistory")) || {};

    return products
      .filter((product) => {
        const matchesCategory = selectedCategory
          ? product.category.toLowerCase() === selectedCategory.toLowerCase()
          : true;

        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.subCategory?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPrice =
          filters.maxPrice !== "" ? product.price >= 0 && product.price <= filters.maxPrice : true;

        const matchesBrand = filters.brand ? product.brand === filters.brand : true;

        return matchesCategory && matchesSearch && matchesPrice && matchesBrand;
      })
      .sort((a, b) => {
        const aBoost =
          Array.isArray(searchHistory[a.category]) && searchHistory[a.category].includes(a.subCategory)
            ? 1
            : 0;
        const bBoost =
          Array.isArray(searchHistory[b.category]) && searchHistory[b.category].includes(b.subCategory)
            ? 1
            : 0;

        if (aBoost !== bBoost) {
          return bBoost - aBoost;
        }

        const aMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
        const bMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
        return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
      });
  };

  const filteredProducts = filterAndSortProducts();
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = isMobile
    ? filteredProducts
    : filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  // Categories for current page
  const startIdx = (currentCategoryPage - 1) * CATEGORIES_PER_PAGE;
  const endIdx = startIdx + CATEGORIES_PER_PAGE;
  const currentCategories = categories.slice(startIdx, endIdx);

  // Update sorted products when filters/search change
  const [sortedProducts, setSortedProducts] = useState([]);
  useEffect(() => {
    const sorted = filterAndSortProducts();
    setSortedProducts(sorted);
  }, [searchTerm, selectedCategory, filters]);

  const handleMakeOrder = async (product) => {
    await handleAddToCart(product);
    navigate('/order');
  };

  const handleAddToCart = async (product) => {
    if (!username) {
      setLoginPrompt('You have to sign in to complete the order.');
      return;
    }
  
    try {
      setMessage('');
      setError('');
      setLoading(true);
  
      const addResponse = await axiosInstance.post('/cart/cart/add', {
        username,
        productId: product._id,  // Dynamically received from button click
        quantity: 1,
        variant: {},
      });
  
      setMessage(addResponse.data.message);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };
  

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      <header className="product-list-header">
        <input
          type="text"
          placeholder="Search for products or categories..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className="product-search"
        />
        <div
          className="suggestions-wrapper"
          onMouseDown={(e) => {
            setIsFocused(true);
            e.preventDefault();
          }}
        >
          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(suggestion.name, searchTerm),
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
            setFilters((prevFilters) => ({
              ...prevFilters,
              minPrice: 0,
              maxPrice,
            }));
          }}
          className="max-price-input no-spinner"
        />
        <button onClick={() => setShops(!shops)}><FaShop /></button>
      </header>
      {loginPrompt && (
            <Alert variant="warning" className="login-alert">
              {loginPrompt} <a href="/login">Sign In</a> or <a href="/register">Register</a>
            </Alert>
          )}
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

      <div className="categories">
        <button className="category-btnn" onClick={() => handleCategoryPageChange(-1)} disabled={currentCategoryPage === 1}>
          <AiFillCaretLeft />
        </button>
        <div className="category-container">
          <button
            className={`category-btn ${selectedCategory === " " ? 'active' : ''}`}
            onClick={() => handleCategoryClick(null)}
          >
            ALL
          </button>
        </div>
        {currentCategories.map((category) => (
          <div key={category.id} className="category-container">
            <button
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          </div>
        ))}
        <button className="category-btnn" onClick={() => handleCategoryPageChange(1)} disabled={currentCategoryPage * CATEGORIES_PER_PAGE >= categories.length}>
          <AiFillCaretRight />
        </button>
      </div>

      {shops ? (
        <div className="usal-dashboard">
          <h1 className="usal-dashboard-title">All Shops</h1>
          {error && <div className="usal-error-message">{error}</div>}
          <div className="usal-user-grid">
            {currentSellers.map(user => (
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
          {totalsellerPages > 1 && (
            <div className="usal-pagination">
              <button
                className="usal-page-btn"
                onClick={() => setCurrentsellerPage(currentsellerPage - 1)}
                disabled={currentsellerPage === 1}
              >
                Previous
              </button>
              <span className="usal-page-number">
                Page {currentsellerPage} of {totalsellerPages}
              </span>
              <button
                className="usal-page-btn"
                onClick={() => setCurrentsellerPage(currentsellerPage + 1)}
                disabled={currentsellerPage === totalsellerPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="product-cards">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => {
              const currentImageIndex = imageIndexes[product._id] || 0;
              const imageSrc = product.images ? product.images[currentImageIndex] : product.image;
              const discountCalc = product.discount
                ? {
                    discountAmount: ((product.price * product.discountpersentage) / 100).toFixed(2),
                    discountedPrice: (product.price - (product.price * product.discountpersentage) / 100).toFixed(2),
                  }
                : { discountAmount: '0.00', discountedPrice: product.price.toFixed(2) };
              const isOutOfStock = product.quantity === 0;

              return (
              <div
                key={product._id}
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <div className="product-image-wrapper">
                  <img 
                    src={imageSrc} 
                    alt={product.name} 
                    className="product-image"
                    loading="lazy"
                    onError={(e) => e.target.src = '/placeholder.jpeg'} // Fallback if image fails
                  />
                  {product.isNew && <span className="product-badge new-badge">New</span>}
                  {product.isOnSale && <span className="product-badge sale-badge">Sale</span>}
                  {isOutOfStock && <span className="product-badge sold-out-badge">Sold Out</span>}
                </div>

                
                <h3>{product.name}</h3>
                {product.label && <span className="product-badge label-badge">{product.label}</span>}
                
                <div className="product-prices">
                  {product.discount ? (
                    <div className="price-container">
                      <div className='pricecomp'>
                        <span className="old-price"><s>Ksh {product.price.toFixed(2)}</s></span>
                        <span className="new-price">Ksh {discountCalc.discountedPrice}</span>
                      </div>

                      <span className="discount-amount">
                        Save Ksh {discountCalc.discountAmount} ({product.discountpersentage}%)
                      </span>
                    </div>

                  ) : (
                    <h4 className="product-price">Ksh {product.price.toFixed(2)}</h4>
                  )}
                </div>
                
                {!isOutOfStock && <p className="stock-info"><strong>Remaining products </strong>: {product.quantity}</p>}
                
                {/* Buttons Section */}
                <div className="product-actions">
                  {!product.variations || product.variations.length === 0 ? (
                    <>
                      <button 
                        className="add-to-cart-btn" 
                        onClick={(e) => { 
                          e.stopPropagation();  
                          handleAddToCart(product);
                        }}
                      >
                        <FaShoppingCart/>
                      </button>

                      <button 
                        className="make-order-btn" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleMakeOrder(product);
                        }}
                      >
                        Buy
                      </button>
                    </>
                  ) : 
                  (
                    <button 
                      className="add-to-cart-btn" 
                      onClick={(e) => { 
                        e.stopPropagation();  
                        handleProductClick(product)
                      }}
                    >
                      <FaShoppingCart/>
                    </button>
                  )}
                </div>

              </div>

              );
            })
          ) : (
            <p>No products found</p>
          )}
        </div>
      )}

      {!isMobile && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} aria-label="Go to first page">
            First
          </button>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Go to previous page">
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Go to next page">
            Next
          </button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} aria-label="Go to last page">
            Last
          </button>
        </div>
      )}
    </div>
  );
};

export default NewProductList;
