import React,{ useState} from 'react';
import NewsLetter from './Newsletter';


const Email = () => {

    const [showNewsletter, setShowNewsletter] = useState(false);

    return (
        <div className="email-section">
            <h2>Email Service</h2>
            <button 
                className="newsletter-button"
                onClick={() => setShowNewsletter(!showNewsletter)}
            >
                {showNewsletter ? "Hide Newsletter" : "Create Newsletter"}
            </button>
            
            {showNewsletter && <NewsLetter />}
        </div>
    );
    
};

export default Email;