// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Navbar = () => {
    const { user, setUser } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showMessage, setShowMessage] = useState(false); // State to control the message visibility
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        setUser(null);
        navigate('/');
        closeDropdown();
    };

    const handleNewPaymentClick = () => {
        if (!user) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
        } else {
            navigate('/newPayment');
        }
    };

    return (
        <nav className="bg-indigo-600 text-white p-8 flex items-center justify-between">
            <div className="flex items-center">
                <h1 className="text-3xl font-bold mr-6">UPI Payments</h1>
                <div className="hidden md:flex space-x-4">
                    <Link to="/userBanks" className="hover:bg-gray-700 px-3 py-2 rounded">My Banks</Link>
                    <Link to="/transactionHistory" className="hover:bg-gray-700 px-3 py-2 rounded">All Transactions</Link>
                    <button
                        onClick={handleNewPaymentClick}
                        className="hover:bg-gray-700 px-3 py-2 rounded"
                    >
                        New Payment
                    </button>
                </div>
            </div>
            <div className="flex items-center space-x-4 relative">
                {user && (
                    <div className="relative">
                        <button
                            className="text-white hover:bg-gray-700 px-3 py-2 rounded"
                            onClick={toggleDropdown}
                        >
                            {user.firstName || "Profile"}
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10"
                                onClick={closeDropdown}
                            >
                                <Link
                                    to="/editProfile"
                                    className="block px-4 py-2 hover:bg-gray-200"
                                >
                                    Edit Profile
                                </Link>
                                <button
                                    className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showMessage && (
                <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white text-center py-2">
                    Please log in to make a new payment.
                </div>
            )}
        </nav>
    );
};

export default Navbar;
