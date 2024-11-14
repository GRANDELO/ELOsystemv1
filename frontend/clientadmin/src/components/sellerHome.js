import React, { useState } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductsList';
import Header from './header';
import Productowner from './productowner';
import Settings from './settings';
const Seller = () => {
  const [refresh, setRefresh] = useState(false);

  const refreshProducts = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="userall">
      <Header/>
      <main>
          <section className="user-section">
            <Settings />
        </section>
        <section className="home-intro">
          <h1>Seller Dashboard</h1>
          <ProductForm refreshProducts={refreshProducts} />
          <ProductList key={refresh} />
          <Productowner/>
        </section>
      </main>
    </div>
  );
};

export default Seller;
