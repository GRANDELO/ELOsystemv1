// components/EmailCampaign.js
import React, { useState } from 'react';
import axios from 'axios';

const CampaignForm = () => {
  const [subject, setSubject] = useState('');
  const [productIds, setProductIds] = useState([]);
  const [customerSegment, setCustomerSegment] = useState('all');
  const [template, setTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/campaigns', {
        subject,
        productIds,
        customerSegment,
        template,
      });
      alert('Campaign created successfully!');
      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Email Campaign</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <select
          value={customerSegment}
          onChange={(e) => setCustomerSegment(e.target.value)}
          required
        >
          <option value="all">All Customers</option>
          <option value="repeatCustomers">Repeat Customers</option>
          <option value="newCustomers">New Customers</option>
        </select>
        <textarea
          placeholder="Email Template (use {{products}} for dynamic content)"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CampaignForm;