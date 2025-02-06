import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';


const WhatsAppButton = () => {
  const phoneNumber = '254116293386'; 
  const message = 'Hello, I have a question'; 

  
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <FaWhatsapp size={40} color="#25D366" /> {/* WhatsApp icon */}
    </a>
  );
};

export default WhatsAppButton;