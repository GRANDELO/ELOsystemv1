import React,{ useState} from 'react';
import NewsLetter from './Newsletter';
import AdminEmailSeller from './sellerEmail';


const Email = () => {

    const [showNewsletter, setShowNewsletter] = useState(false);
    const [showSeller, setShowSeller] = useState(false);

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
            
            {showNewsletter && <NewsLetter />}
            {showSeller && <AdminEmailSeller />}
        </div>
       
    );
    
};

export default Email;