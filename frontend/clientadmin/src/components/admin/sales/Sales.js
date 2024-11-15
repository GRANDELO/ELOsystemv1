import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from '../Footer';
import Header from '../header';
import Setting from '../settings';
import '../styles/salmn.css';
import Salespg from './Salespg';

const FinancialSummary = () => {
  return (
    <div>
    <div className="saladmm-container">
      <Header/>
      <Setting/>
      <Salespg/>
    </div>
    <Footer/>
    </div>

  );
};

export default FinancialSummary;
