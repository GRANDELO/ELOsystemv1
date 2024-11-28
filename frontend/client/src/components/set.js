import React, { useState } from 'react';

const AdminSettings = () => {
  const [background, setBackground] = useState(null);
  const [logo, setLogo] = useState(null);

  const handleBackgroundChange = (event) => {
    setBackground(event.target.files[0]);
  };

  const handleLogoChange = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    if (background) {
      formData.append('background', background);
    }
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      const response = await fetch('/api/upload-assets', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Assets uploaded successfully!');
      } else {
        alert('Error uploading assets');
      }
    } catch (error) {
      console.error('Error uploading assets:', error);
      alert('Error uploading assets');
    }
  };

  return (
    <div>
      <h2>Upload Background and Logo</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Background (Image or Video):</label>
          <input
            type="file"
            accept="image/*, video/*"
            onChange={handleBackgroundChange}
          />
        </div>
        <div>
          <label>Logo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default AdminSettings;
