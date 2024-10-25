import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewProductForm from './NewProductForm';
import Header from './header';
import Productowner from './productowner';
import Settings from './settings';
import './styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('product-list'); // Default is product list
  const [loading, setLoading] = useState(false);

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(''); // Close the section if it's already active
    } else {
      setActiveSection(section); // Open the selected section
    }
  };

  useEffect(() => {
    // Simulate loading when products are fetched
    if (activeSection === 'product-list') {
      setLoading(true);
      const fetchProducts = async () => {
        // Simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1 second loading time
        setLoading(false); // Set loading to false after fetching products
      };

      fetchProducts();
    }
  }, [activeSection]);

  return (
    <div className="home">
      <Header />
      <main className="home-main">
        {/* User Settings Section */}
        <section className="home-user-section">
          <Settings />
        </section>

        {/* Introduction Section */}
        <section className="home-intro">
          <p>
            <strong>This is the seller home page</strong>
          </p>

          {/* Buttons to Toggle Between Product List and Add Product Form */}
          <div className="home-toggle-buttons">
            <button
              className={`home-settings-button ${activeSection === 'product-list' ? 'active' : ''}`}
              onClick={() => toggleSection('product-list')}
            >
              Show My Products
            </button>
            <button
              className={`home-settings-button ${activeSection === 'add-product' ? 'active' : ''}`}
              onClick={() => toggleSection('add-product')}
            >
              Add New Product
            </button>
          </div>

          {/* Display Loading Indicator or Product List / Add Product Form */}
          <div className="home-show-section">
            {loading ? (
              <div className="home-loading-container">
                <p>Loading products...</p> {/* You can replace this with a spinner */}
              </div>
            ) : (
              <>
                {activeSection === 'product-list' && (
                  <div className="home-product-container">
                    <Productowner />
                  </div>
                )}
                {activeSection === 'add-product' && (
                  <div className="home-product-form-container">
                    <NewProductForm />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="home-footer">
        <p>Contact us: grandeloltd1@gmail.com</p>
        <p>&copy; 2024 Grandelo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
