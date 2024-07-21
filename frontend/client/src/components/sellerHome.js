import React, { useState } from 'react';
import ProductList from './ProductsList';
import ProductForm from './ProductForm';

const Seller = () => {
  const [refresh, setRefresh] = useState(false);

  const refreshProducts = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <ProductForm refreshProducts={refreshProducts} />
      <ProductList key={refresh} />
    </div>
  );
};

export default Seller;
