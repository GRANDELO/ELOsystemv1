import React, { useState } from 'react';
import axiosInstance from './axiosInstance';
import { getUsernameFromToken } from '../utils/auth';

const UploadShopLogo = () => {
  const username = getUsernameFromToken();
  const [logo, setLogo] = useState(null);
  const [background, setBackground] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e, setFile) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!logo || !background) {
      setMessage('Please upload both logo and background images.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('logo', logo);
    formData.append('background', background);

    // Debugging: Log FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axiosInstance.post('/updateShopLogo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: [(data) => data],
      });

      setMessage(response.data.message || 'Images uploaded successfully.');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error uploading images:', error);
      setMessage(error.response?.data?.message || 'Error uploading images.');
    }
  };

  return (
    <div>
      <h2>Upload Shop Logo and Background</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Logo:</label>
          <input type="file" onChange={(e) => handleFileChange(e, setLogo)} accept="image/*" required />
        </div>
        <div>
          <label>Background:</label>
          <input type="file" onChange={(e) => handleFileChange(e, setBackground)} accept="image/*" required />
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadShopLogo;
