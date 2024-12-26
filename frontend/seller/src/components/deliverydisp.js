import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getdpnoFromToken } from '../utils/auth';
import './styles/deliveryPackages.css'; // Import CSS file for styling

const ITEMS_PER_PAGE = 5; // Number of packages per page

const DeliveryPersonPackages = () => {
  const [packages, setPackages] = useState([]);
  const [deliveredPackages, setDeliveredPackages] = useState([]);
  const [undeliveredPackages, setUndeliveredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('undelivered'); // 'undelivered' or 'delivered'

  const deliveryPersonnumber = getdpnoFromToken();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          `https://elosystemv1.onrender.com/api/delivery/packages/${deliveryPersonnumber}`
        );
        if (response.data.success) {
          const allPackages = response.data.packages;
          setPackages(allPackages);
          setDeliveredPackages(allPackages.filter(pkg => pkg.isdelivered));
          setUndeliveredPackages(allPackages.filter(pkg => !pkg.isdelivered));
        } else {
          setError(response.data.message || 'Failed to fetch packages');
        }
      } catch (err) {
        setError('An error occurred while fetching packages');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [deliveryPersonnumber]);

  // Function to handle pagination
  const getPaginatedPackages = () => {
    const packagesToShow = filter === 'delivered' ? deliveredPackages : undeliveredPackages;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return packagesToShow.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(
    (filter === 'delivered' ? deliveredPackages.length : undeliveredPackages.length) / ITEMS_PER_PAGE
  );

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  if (loading) {
    return <p className="loading">Loading packages...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="packages-container">
      <h2 className="page-title">Assigned Packages</h2>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-button ${filter === 'undelivered' ? 'active' : ''}`}
          onClick={() => handleFilterChange('undelivered')}
        >
          Undelivered
        </button>
        <button
          className={`filter-button ${filter === 'delivered' ? 'active' : ''}`}
          onClick={() => handleFilterChange('delivered')}
        >
          Delivered
        </button>
      </div>

      {/* Paginated List */}
      {getPaginatedPackages().length > 0 ? (
        <ul className="packages-list">
          {getPaginatedPackages().map((pkg, index) => (
            <li className="package-card" key={index}>
              <p>
                <strong>Box ID:</strong> {pkg.boxid}
              </p>
              <p>
                <strong>Processed Date:</strong> {new Date(pkg.processedDate).toLocaleString()}
              </p>
              <p>
                <strong>Delivered:</strong> {pkg.isdelivered ? 'Yes' : 'No'}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-packages">No packages found in this category.</p>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DeliveryPersonPackages;
