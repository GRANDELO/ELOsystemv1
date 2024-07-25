import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NewProductList = () => {
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await axios.get('https://elosystemv1.onrender.com/api/newproducts');
        setNewProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNewProducts();
  }, []);

  return (
    <div>
      <h1>NewProducts</h1>
      <ul>
        {newProducts.map(newProduct => (
          <li key={newProduct._id}>
            <Link to={`/newproducts/${newProduct._id}`}>{newProduct.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewProductList;
