// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Navbar = () => {
    const { user } = useUser();

    return (
        <nav className="bg-blue-400 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold mr-6">UPI Payments</h1>
                <div className="hidden md:flex space-x-4">
                    <Link to="/userBanks" className="hover:bg-gray-700 px-3 py-2 rounded">My Banks</Link>
                    <Link to="/transactionHistory" className="hover:bg-gray-700 px-3 py-2 rounded">All Transactions</Link>
                    <Link to="/newPayment" className="hover:bg-gray-700 px-3 py-2 rounded">New Payment</Link>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                {user && (
                    <span className="flex items-center space-x-2">
                        <img
                            src="/path/to/profile/logo.png" // Replace with actual profile logo path
                            alt="Profile"
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="hidden md:inline">{user.name}</span>
                    </span>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
