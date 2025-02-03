import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from './axiosInstance';
import { getUsernameFromToken } from '../utils/auth';


const UpdateImages = () => {
  const username = getUsernameFromToken();
  const [logo, setLogo] = useState(null);
  const [background, setBackground] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'logo' && files.length > 0) {
      setLogo(files[0]);
    } else if (name === 'background' && files.length > 0) {
      setBackground(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logo || !background) {
      setError('Both logo and background images are required');
      return;
    }

    const formData = new FormData();
    formData.append('images', logo);
    formData.append('images', background);

    try {
      const response = await axiosInstance.put(`update-images/${username}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(response.data.message);
      setLogo(null);
      setBackground(null);
    } catch (err) {
      setError('Error updating images');
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Update Logo and Background Images</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="logo">Logo Image:</label>
          <input type="file" name="logo" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <label htmlFor="background">Background Image:</label>
          <input type="file" name="background" accept="image/*" onChange={handleFileChange} />
        </div>
        <button type="submit">Update Images</button>
      </form>
    </div>
  );
};

export default UpdateImages;
