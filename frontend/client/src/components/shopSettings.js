import React, { useState } from 'react';
import './styles/Shop.css'; // Include a separate CSS file for styling

const ShopSettings = () => {
  const [shopName, setShopName] = useState('');
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [theme, setTheme] = useState('Default');

  const handleLogoChange = (e) => setLogo(e.target.files[0]);
  const handleBannerChange = (e) => setBanner(e.target.files[0]);
  const handleThemeChange = (e) => setTheme(e.target.value);

  const handleSaveSettings = () => {
    // Logic to send the data to your backend via an API request
    console.log('Shop Settings Saved:', {
      shopName,
      logo,
      banner,
      theme,
    });

    alert('Shop settings saved successfully!');
  };

  return (
    <div className="shop-settings">
      <h2>Shop Settings</h2>
      <form>
        {/* Shop Name */}
        <div className="form-group">
          <label htmlFor="shopName">Shop Name:</label>
          <input
            id="shopName"
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Enter your shop name"
            required
          />
        </div>

        {/* Logo Upload */}
        <div className="form-group">
          <label htmlFor="shopLogo">Upload Logo:</label>
          <input id="shopLogo" type="file" accept="image/*" onChange={handleLogoChange} />
        </div>

        {/* Banner Upload */}
        <div className="form-group">
          <label htmlFor="shopBanner">Upload Banner:</label>
          <input id="shopBanner" type="file" accept="image/*" onChange={handleBannerChange}  required/>
        </div>

        {/* Theme Selection */}
        <div className="form-group">
          <label htmlFor="shopTheme">Select Theme:</label>
          <select id="shopTheme" value={theme} onChange={handleThemeChange}>
            <option value="Default">Default</option>
            <option value="Dark">Dark</option>
            <option value="Light">Light</option>
            <option value="Colorful">Colorful</option>
          </select>
        </div>

        <button type="button" onClick={handleSaveSettings} className="save-settings-button">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default ShopSettings;
