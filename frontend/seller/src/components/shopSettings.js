import React, { useState } from 'react';
import axiosInstance from './axiosInstance';
import { getUsernameFromToken } from '../utils/auth'; // Assume this retrieves the username from a token

const UploadShopLogo = () => {
  const username = getUsernameFromToken();
  const [logo, setLogo] = useState(null);
  const [background, setBackground] = useState(null);
  const [message, setMessage] = useState('');

  const handleLogoChange = (e) => setLogo(e.target.files[0]);
  const handleBackgroundChange = (e) => setBackground(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!logo || !background) {
      setMessage('Please upload both logo and background images.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('logo', logo); // Attach logo
    formData.append('background', background); // Attach background

    try {
      const response = await axiosInstance.post(
        '/updateshoplogoUrl',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setMessage(response.data.message || 'Images uploaded successfully.');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error uploading images:', error);
      setMessage('Error uploading images.');
    }
  };

  return (
    <div>
      <h2>Upload Shop Logo and Background</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Logo:</label>
          <input type="file" onChange={handleLogoChange} accept="image/*" required />
        </div>
        <div>
          <label>Background:</label>
          <input type="file" onChange={handleBackgroundChange} accept="image/*" required />
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadShopLogo;
