import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../../header';
import '../../styles/sales.css';
import Footer from '../Footer';
import Setting from '../settings';
import Salespg from './Salespg';

const FinancialSummary = () => {
  return (
    <div className="saladmm-container">
      <Header/>
      <Setting/>
      <Salespg/>
      <Footer/>
    </div>
  );
};

export default FinancialSummary;
