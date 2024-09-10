import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserBanks = () => {
    const { user } = useUser();
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pinInputs, setPinInputs] = useState({});
    const [pinValidationError, setPinValidationError] = useState({});
    const [showBalance, setShowBalance] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBanks = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:9090/users/${user.id}/userBanks`);
                setBanks(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching banks:', err);
                setError('Error fetching bank details.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBanks();
        }
    }, [user]);

    const handlePinInputChange = (bankId, value) => {
        setPinInputs(prev => ({ ...prev, [bankId]: value }));
    };

    const handlePinSubmit = (bankId, bankPin) => {
        const enteredPin = (pinInputs[bankId] || '').trim();
        const actualPin = String(bankPin).trim();

        if (enteredPin === actualPin) {
            setShowBalance(prev => ({ ...prev, [bankId]: true }));
            setPinValidationError(prev => ({ ...prev, [bankId]: '' }));
        } else {
            setPinValidationError(prev => ({ ...prev, [bankId]: 'Incorrect PIN' }));
            setShowBalance(prev => ({ ...prev, [bankId]: false }));
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-700">Please log in to view your bank details.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Banks</h1>
            {loading && <p className="text-blue-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {banks.length === 0 ? (
                !loading && <p className="text-gray-500">No banks found.</p>
            ) : (
                <ul className="space-y-4">
                    {banks.map((bank) => (
                        <li key={bank.id} className="border border-gray-300 p-4 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-2">{bank.bankName}</h2>
                            <p className="text-gray-700">Account Number: <span className="font-medium">{bank.accountNumber}</span></p>
                            <p className="text-gray-700">Transaction Limit: <span className="font-medium">{bank.transactionLimit}</span></p>
                            {showBalance[bank.id] ? (
                                <p className="text-gray-700">Balance: <span className="font-medium">{bank.balance}</span></p>
                            ) : (
                                <div className="mt-4">
                                    <input
                                        type="password"
                                        placeholder="Enter Bank PIN to view balance"
                                        value={pinInputs[bank.id] || ''}
                                        onChange={(e) => handlePinInputChange(bank.id, e.target.value)}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <button
                                        onClick={() => handlePinSubmit(bank.id, bank.bankPin)}
                                        className="ml-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                                    >
                                        Submit PIN
                                    </button>
                                    {pinValidationError[bank.id] && (
                                        <p className="text-red-500 mt-2">{pinValidationError[bank.id]}</p>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <div className="mt-6 flex space-x-4">
                <button 
                    onClick={() => navigate('/addNewBank')} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add New Bank
                </button>
                <Link 
                    to="/transactionHistory" 
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    View Transaction History
                </Link>
                <button 
                    onClick={() => navigate('/newPayment')} 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    New Payment
                </button>
            </div>
        </div>
    );
};

export default UserBanks;
