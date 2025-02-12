import React from 'react';
import './App.css';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaWhatsapp ,FaTiktok} from "react-icons/fa";


const Website = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Bazelink</h1>
        <p className="hero-subtitle">
          Connecting Kenya's Marketplace – Seamless Selling, Buying, and Delivery
        </p>
        <div className="hero-buttons">
          <a href="https://www.partner.bazelink.co.ke/sellerlogin" className="btn primary-btn">Join as a Seller</a>
          <a href="https://www.bazelink.co.ke" className="btn secondary-btn">Start Shopping</a>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">🛍️</div>
            <h3 className="step-title">For Sellers</h3>
            <p className="step-description">
              List your products on Bazelink and reach customers across Kenya.
            </p>
          </div>
          <div className="step">
            <div className="step-icon">🛒</div>
            <h3 className="step-title">For Buyers</h3>
            <p className="step-description">
              Explore and purchase products nationwide with reliable delivery.
            </p>
          </div>
          <div className="step">
            <div className="step-icon">📦</div>
            <h3 className="step-title">For Agents</h3>
            <p className="step-description">
              Partner with us to become a local collection point and earn.
            </p>
          </div>
          <div className="step">
            <div className="step-icon">🚚</div>
            <h3 className="step-title">For Delivery Partners</h3>
            <p className="step-description">
              Join our network and earn by delivering products to customers.
            </p>
          </div>
        </div>
        <a href="https://www.partner.bazelink.co.ke" className="cta-btn">
          Get Started Today!
        </a>
      </section>

      {/* Seller Section */}
      <section className="seller-section">
        <div className="seller-content">
          <h2 className="seller-title">Start Selling with Ease</h2>
          <p className="seller-description">
            Unlock unlimited potential by selling your products on Bazelink.  
            Gain instant access to thousands of buyers across Kenya,  
            secure transactions, and reliable delivery support.  
          </p>
          
          <ul className="seller-benefits">
            <li><span>🚀</span> Effortless product listing</li>
            <li><span>📦</span> Hassle-free order fulfillment</li>
            <li><span>🔒</span> Secure & fast payments</li>
            <li><span>📈</span> Expand your business nationwide</li>
          </ul>
          
          <p className="seller-action-text">
            Take your business to the next level. Join Bazelink today.
          </p>

          <a href="https://www.partner.bazelink.co.ke/sellerlogin" className="seller-cta">
            Become a Seller Now
          </a>
        </div>
              {/* Pricing Table */}
        <section className="pricing-section">
          <h2 className="section-title">Sales Charges</h2>
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Product Price (KES)</th>
                <th>Sales Fee (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Below 250</td>
                <td>15%</td>
              </tr>
              <tr>
                <td>250 - 499</td>
                <td>12%</td>
              </tr>
              <tr>
                <td>500 - 1,999</td>
                <td>10%</td>
              </tr>
              <tr>
                <td>2,000 - 2,999</td>
                <td>9%</td>
              </tr>
              <tr>
                <td>3,000 - 4,999</td>
                <td>8%</td>
              </tr>
              <tr>
                <td>5,000 - 99,999</td>
                <td>5%</td>
              </tr>
              <tr>
                <td>100,000+</td>
                <td>4%</td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>



      {/* Buyer Section */}
      <section className="buyer-section">
        <div className="buyer-content">
          <h2 className="buyer-title">Shop Anywhere, Anytime</h2>
          <p className="buyer-description">
            Explore thousands of high-quality products from trusted sellers across Kenya.  
            Enjoy fast, secure checkout and seamless delivery to your preferred location.  
            Elevate your shopping experience today.
          </p>

          <ul className="buyer-benefits">
            <li><span>🛍</span> Wide variety of products</li>
            <li><span>🔒</span> Secure transactions</li>
            <li><span>🚚</span> Reliable nationwide delivery</li>
          </ul>

          <a href="https://www.bazelink.co.ke" className="buyer-cta">
            Start Shopping Now
          </a>
        </div>
      </section>

      {/* Agent Section */}
      <section className="agent-section">
        <div className="agent-content">
          <h2 className="agent-title">Become a Bazelink Pickup Agent</h2>
          <p className="agent-description">
            Earn extra income by becoming a trusted collection point for customers.  
            Increase foot traffic to your location while enjoying full support from Bazelink.
          </p>

          <ul className="agent-benefits">
            <li><span>💼</span> Additional revenue stream</li>
            <li><span>📈</span> More customers visiting your location</li>
            <li><span>🔄</span> Hassle-free partnership</li>
          </ul>

          <a href="https://www.partner.bazelink.co.ke/agentLogin" className="agent-cta">
            Register as an Agent
          </a>
        </div>
      </section>

      {/* Delivery Partner Section */}
      <section className="delivery-section">
        <div className="delivery-content">
          <h2 className="delivery-title">Earn as a Delivery Partner</h2>
          <p className="delivery-description">
            Join our delivery network and turn your vehicle into a source of income.  
            Enjoy flexible schedules, attractive earnings, and full logistics support.
          </p>

          <ul className="delivery-benefits">
            <li><span>🚗</span> Earn per successful delivery</li>
            <li><span>🕒</span> Work on your own schedule</li>
            <li><span>🔧</span> Full logistics support</li>
          </ul>

          <a href="https://www.partner.bazelink.co.ke/deliveryLogin" className="delivery-cta">
            Apply as a Partner
          </a>
        </div>
      </section>




      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-intro">
          Got questions? We've got answers! Here are some common queries about Bazelink.
        </p>
        <div className="faqs">
          {[
            {
              question: "How do I become a seller on Bazelink?",
              answer:
                "Sign up through our 'Register as a Seller' link, complete the onboarding process, and start selling.",
            },
            {
              question: "What products can I sell?",
              answer:
                "You can sell a variety of products, except for restricted items outlined in our terms of service.",
            },
            {
              question: "How do buyers receive their products?",
              answer:
                "Buyers choose a nearby agent as their collection point, ensuring convenient and secure delivery.",
            },
            {
              question: "How do I become an agent?",
              answer:
                "Apply through our 'Become an Agent' section, and once approved, start receiving and distributing packages.",
            },
          ].map((faq, index) => (
            <div className="faq" key={index}>
              <h3 className="faq-question">{faq.question}</h3>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Footer */}

      <footer className="footer">
      <div className="footer-content">
        <div >
          <h3>Bazelink</h3>
          <p>
            The ultimate online marketplace connecting buyers, sellers, agents, and delivery personnel across Kenya.
          </p>
          <ul className="footer-links">
            {/* <li><a href="#about">About Us</a></li>*/}
            <li><a href="/documents/TERMS OF SERVICE.pdf" target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
            <li><a href="/documents/Privacy Policy.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="social-links">
          <a href="https://www.facebook.com/share/1B1hsiqqht" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://www.tiktok.com/@bazelink?_t=ZM-8tq5TzfOVNv&_r=1" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          <a href="https://www.instagram.com/bazelink.inc?igsh=MWJxeGg4b3ZpMmd1eg==" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://youtube.com/@bazelink?si=2LX8rtyrGu-_CiQG" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <a href="mailto:bazelinkofficial@gmail.com"><FaEnvelope /> bazelinkofficial@gmail.com</a>
          <a href="tel:+254116293386"><FaPhone /> +254 116 293 386</a>
          <a href="https://wa.me/254116293386" target="_blank" rel="noopener noreferrer"><FaWhatsapp /> WhatsApp</a>
        </div>
      </div>
    </footer>


    </div>
  );
};

export default Website;
