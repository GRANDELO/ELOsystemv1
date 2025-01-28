import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';

function AppDownloadQRIcon() {
  const [qrCodeData, setQrCodeData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Replace with your Render service URL
    const fetchQrCode = async () => {
      try {
        const response = await axiosInstance.get('/notifications');
        setQrCodeData(response.data.qrCodeData);
      } catch (error) {
        console.error('Error fetching QR code:', error);
      }
    };

    fetchQrCode();
  }, []);

  // Function to toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      
        <FontAwesomeIcon
          icon={faQrcode}
          onClick={toggleModal}
          size="2x" // Adjust icon size here
          style={{ cursor: 'pointer', color: '#333' }} // Adjust color as needed
        />
     
    </div>
  );
}
      


export default AppDownloadQRIcon;
