import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModal.js';
import axiosInstance from './axiosInstance.js';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { storeSearch, getSearchHistory, trackProductClick } from '../utils/search.js';
import { useIsMobile } from '../utils/mobilecheck.js';
import './styles/NewProductList.css';
import { jwtDecode } from 'jwt-decode';
import categories from './categories.js';
import { useParams } from 'react-router-dom';

const NewProductList = ({ username }) => {
  {/*const { username } = useParams();*/}
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageIndexes, setImageIndexes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const PRODUCTS_PER_PAGE = 32;
  const CATEGORIES_PER_PAGE = isMobile ? 3 : 7; // Number of categories to show per page

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: Infinity,
    brand: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
 


  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        setProducts(response.data.products.sort(() => Math.random() - 0.5));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Autocomplete: Fetch suggestions as the user types
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

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce for 300ms

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name); // Set the search term to the clicked suggestion
    setSuggestions([]); // Clear suggestions
    setCurrentPage(1);
    setIsFocused(false);
    
  };
  const highlightMatch = (text, query) => {
    if (!query) return text;
  
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  const handleBlur = () => {
    setTimeout(() => {
      if(!isFocused){
        setSuggestions([]);
      }
    }, 200)
  };


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

  //test1
   // Sync session data to backend
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
        const decodedToken = jwtDecode(token); // Decode the token
        userId = decodedToken.id; // Adjust to match your token structure
    } catch (error) {
        console.error("Failed to decode token:", error);
        return;
    }

  
    console.log("Payload being sent", { searchHistory, clickHistory, userId });
  
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
  

// Call sync function periodically after component mounts
  useEffect(() => {
    const intervalId = setInterval(syncSessionToBackend, 30000); // Sync every 30 seconds instead of 5
    return () => clearInterval(intervalId);
  },  []);
 ///
 
  
//filter search functionality
  const handleFilterChange = (filterName, value) => {
   setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    storeSearch(product.category , product.subCategory)
    setIsModalOpen(true);

  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
    
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    //setCurrentPage(1); // Reset to first page when category changes
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
    const searchHistory = getSearchHistory(); // Retrieve search history
    const clickHistory = JSON.parse(sessionStorage.getItem('clickHistory')) || {};
  
    return products
      .filter((product) => {
        // Only show products belonging to the specific shop/seller
        const matchesUsername = product.username === username;
  
        // Additional filters
        const matchesCategory = selectedCategory
          ? product.category.toLowerCase() === selectedCategory.toLowerCase()
          : true;
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.subCategory && product.subCategory.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesMaxPrice = filters.maxPrice ? product.price <= filters.maxPrice : true;
        const matchesBrand = filters.brand ? product.brand === filters.brand : true;
  
        return matchesUsername && matchesCategory && matchesSearch && matchesMaxPrice && matchesBrand;
      })
      .sort((a, b) => {
        // Boosting based on search history
        const aBoost =
          Array.isArray(searchHistory[a.category]) &&
          searchHistory[a.category].includes(a.subCategory)
            ? 1
            : 0;
        const bBoost =
          Array.isArray(searchHistory[b.category]) &&
          searchHistory[b.category].includes(b.subCategory)
            ? 1
            : 0;
  
        // Boosting based on click history
        const aClickBoost = clickHistory[a.id] || 0;
        const bClickBoost = clickHistory[b.id] || 0;
  
        // Compare search history boost first
        if (aBoost !== bBoost) {
          return bBoost - aBoost;
        }
        // Then compare click history boost
        if (aClickBoost !== bClickBoost) {
          return bClickBoost - aClickBoost;
        }
  
        // Fallback: sort based on search term relevance in the product name
        const aMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
        const bMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
        return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
      });
  };
  


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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

  
  const filteredProducts = filterAndSortProducts();
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const currentProducts = isMobile
    ? filteredProducts
    : filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);


      // Get categories for the current page
  const startIdx = (currentCategoryPage - 1) * CATEGORIES_PER_PAGE;
  const endIdx = startIdx + CATEGORIES_PER_PAGE;
  const currentCategories = categories.slice(startIdx, endIdx);

  
  const [sortedProducts, setSortedProducts] = useState([]);
  
  useEffect(() => {
      const sorted = filterAndSortProducts();
       setSortedProducts(sorted);
    }, [searchTerm, selectedCategory, filters]);
  


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
          onBlur={handleBlur }
          className="product-search"
        />
        <div
          className="suggestions-wrapper"

          onMouseDown={(e) => {
            setIsFocused(true);
            e.preventDefault()
          }} // Prevent blur on click
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
                >
                </li>
              ))}
            </ul>
          )}
          </div>
        
        <input
          type="number"
          placeholder="filter by Price"
          value={filters.maxPrice || ""}
          onChange={(e) =>
            setFilters((prevFilters) => ({
              ...prevFilters,
              maxPrice: Number(e.target.value),
            }))
          }
          className="max-price-input no-spinner"
        />

      </header>

       {/* <div className="advanced-filters">
          <label>
            Price Range:
            <input
              type="range"
              min="50"
              max="99000"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [0, e.target.value])}
            />
            <span>KES:{filters.priceRange[1]}</span>
          </label>
          <label>
            Brand:
            <input
              type="text"
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            />
          </label>

        </div> */}

          {/* Categories Section */}
          <div className="categories">

          <button className="category-btnn" onClick={() => handleCategoryPageChange(-1)} disabled={currentCategoryPage === 1}><AiFillCaretLeft/></button>
          <div className="category-container">
            <button
                className={`category-btn ${selectedCategory === " " ? 'active' : ''}`}
                onClick={() => handleCategoryClick(null)}
              >
                {"ALL"}
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

          <button className="category-btnn"  onClick={() => handleCategoryPageChange(1)} disabled={currentCategoryPage * CATEGORIES_PER_PAGE >= categories.length}><AiFillCaretRight/></button>
          </div>



      <div className="product-cards">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => {
            const currentImageIndex = imageIndexes[product._id] || 0;
            const imageSrc = product.images ? product.images[currentImageIndex] : product.image;
            const { discountedPrice, discountAmount } = calculateDiscountedPrice(product);

            const isOutOfStock = product.quantity === 0;

            return (
              <div
                key={product._id}
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <div className="product-image-wrapper">
                  <img src={imageSrc} alt={product.name} className="product-image" />
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
          })
        ) : (
          <p>No products found for {username}</p>
        )}
      </div>

      {!isMobile && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="Go to first page"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Go to last page"
          >
            Last
          </button>
        </div>


      )}

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
