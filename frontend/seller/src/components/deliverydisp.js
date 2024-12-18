import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeliveryPersonPackages = ({ deliveryPersonnumber }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(`https://elosystemv1.onrender.com/api/delivery/packages/${deliveryPersonnumber}`);
        if (response.data.success) {
          setPackages(response.data.packages);
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

  if (loading) {
    return <p>Loading packages...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Assigned Packages</h2>
      {packages.length > 0 ? (
        <ul>
          {packages.map((pkg, index) => (
            <li key={index}>
              <p>Box ID: {pkg.boxid}</p>
              <p>Processed Date: {new Date(pkg.processedDate).toLocaleString()}</p>
              <p>Delivered: {pkg.isdelivered ? 'Yes' : 'No'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No packages assigned.</p>
      )}
    </div>
  );
};

export default DeliveryPersonPackages;
