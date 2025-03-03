import React,{ useState} from 'react';
import NewsLetter from './Newsletter';
import AdminEmailSeller from './sellerEmail';
import EmailMaintenance from './maitenance';
import './styles/styles.css'


const Email = () => {

    const [showNewsletter, setShowNewsletter] = useState(false);
    const [showSeller, setShowSeller] = useState(false);
    const [showMaintence, setShowMaintence] = useState(false);

    return (
        <div className="email-section">
            <h2>Email Service</h2>
            <button 
                className="newsletter-button"
                onClick={() => setShowNewsletter(!showNewsletter)}
            >
                {showNewsletter ? "Hide Newsletter" : "Create Newsletter"}
            </button>
            <button
                className="seller-email-button"
                onClick={() => setShowSeller(!showSeller)}
                style={{ marginLeft: '10px' }} // Add some spacing between buttons
            >
                {showSeller ? "Hide Seller Email" : "Send Email to Sellers"}
            </button>
            <button
                className="seller-email-button"
                onClick={() => setShowMaintence(!showMaintence)}
                style={{ marginLeft: '10px' }} // Add some spacing between buttons
            >
                {showMaintence ? "Hide maintence Email" : "Send Email to maintence"}
            </button>
            
            {showNewsletter && <NewsLetter />}
            {showSeller && <AdminEmailSeller />}
            {showMaintence && < EmailMaintenance />}
        </div>
       
    );
    
};

export default Email;