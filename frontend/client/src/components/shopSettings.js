import React, { useState } from 'react';
import axios from 'axios';
import { getUsernameFromToken} from '../utils/auth';

const UploadShopLogo = () => {
  const username = getUsernameFromToken();
  const [logo, setLogo] = useState(null);
  const [background, setBackground] = useState(null);
  const [message, setMessage] = useState('');

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleBackgroundChange = (e) => {
    setBackground(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !logo || !background) {
      setMessage('Please fill in all fields and upload both images.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('logo', logo); // Logo image
    formData.append('background', background); // Background image

    try {
      const response = await axios.post('https://elosystemv1.onrender.com/api/updateshoplogoUrl', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message || 'Images uploaded successfully.');
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
