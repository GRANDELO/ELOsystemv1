import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/hr.css';
import AccountForm from './AccountForm';
import AccountList from './AccountList';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import ProfitCalculator from './ProfitCalculator';


const Dashboard = () => {
    const [view, setView] = useState('TransactionList');
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [recentActivities, setRecentActivities] = useState([]);
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);

    const handleLogout = () => {
        navigate('/logout');
    };



    return (
        <div className="hralld-dashboard-container">
            <nav className="hralld-nav">
                <button
                    className={`hralld-nav-button ${view === 'AccountForm' ? 'active' : ''}`}
                    onClick={() => setView('AccountForm')}
                >
                    Account Form
                </button>
                <button
                    className={`hralld-nav-button ${view === 'AccountList' ? 'active' : ''}`}
                    onClick={() => setView('AccountList')}
                >
                    Account List
                </button>
                <button
                    className={`hralld-nav-button ${view === 'TransactionForm' ? 'active' : ''}`}
                    onClick={() => setView('TransactionForm')}
                >
                    Transaction Form
                </button>
                <button
                    className={`hralld-nav-button ${view === 'TransactionList' ? 'active' : ''}`}
                    onClick={() => setView('TransactionList')}
                >
                    Transaction List
                </button>
                <button
                    className={`hralld-nav-button ${view === 'ProfitCalculator' ? 'active' : ''}`}
                    onClick={() => setView('ProfitCalculator')}
                >
                    Profit Calculator
                </button>

            </nav>

            <div className="hralld-content">


                {view === 'AccountForm' && <AccountForm />}
                {view === 'AccountList' && <AccountList />}
                {view === 'TransactionForm' && <TransactionForm />}
                {view === 'TransactionList' && <TransactionList />}
                {view === 'ProfitCalculator' && <ProfitCalculator />}
            </div>
        </div>
    );
};

export default Dashboard;
