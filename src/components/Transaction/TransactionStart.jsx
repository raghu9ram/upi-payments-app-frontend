import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const TransactionStart = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [recipientMobile, setRecipientMobile] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(null);
    const [selectedBankId, setSelectedBankId] = useState('');
    const [banks, setBanks] = useState([]);
    const [recipientUserId, setRecipientUserId] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const fetchRecipientUserId = async (mobileNumber) => {
        try {
            const response = await axios.get(`http://localhost:9090/users/byMobileNumber/${mobileNumber}`);
            const user = response.data;
            setRecipientUserId(user.id);
            setError(null);
        } catch (err) {
            console.error('Error fetching recipient user ID:', err);
            setError('Error fetching recipient user details.');
        }
    };

    const handleRecipientMobileChange = (e) => {
        setRecipientMobile(e.target.value);
        if (e.target.value.length === 10) { // Assuming 10 digits for mobile number
            fetchRecipientUserId(e.target.value);
        }
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();

        const bankId = Number(selectedBankId);
        const transactionAmount = Number(amount);

        // Validating the bankId 
        if (isNaN(bankId) || bankId <= 0) {
            setError('Invalid bank ID selected');
            return;
        }

        // Validating the amount
        if (isNaN(transactionAmount) || transactionAmount <= 0) {
            setError('Invalid amount entered');
            return;
        }

        // Validating the recipientUserId
        if (!recipientUserId) {
            setError('Recipient user not found');
            return;
        }

        const formattedDateTime = new Date().toISOString(); // Format as YYYY-MM-DDTHH:MM:SS.sssZ

        try {
            const response = await fetch('http://localhost:9090/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipientMobile,
                    amount: transactionAmount,
                    dateTime: formattedDateTime,
                    userModel: {
                        id: user?.id 
                    },
                    bankModel: {
                        id: bankId 
                    }
                }),
            });

            // Check if the response is in JSON format
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Failed to initialize transaction');
                }

                navigate('/transactionAuth', {state:{ recipientUserId, amount, selectedBankId }})
            } else {
                // Handle unexpected response formats
                const text = await response.text();
                throw new Error(`Unexpected response format: ${text}`);
            }
        } catch (error) {
            setError(error.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h1 className="text-2xl font-bold mb-6">Initialize Transaction</h1>
            {loading && <p className="text-blue-500 mb-4">Loading...</p>} {/* Display loading indicator */}
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Recipient Mobile Number:
                        <input
                            type="text"
                            value={recipientMobile}
                            onChange={handleRecipientMobileChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Amount:
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Select Bank Account:
                        <select
                            value={selectedBankId}
                            onChange={(e) => setSelectedBankId(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select a bank account</option>
                            {banks.length > 0 ? (
                                banks.map(bank => (
                                    <option key={bank.id} value={bank.id}>
                                        {bank.bankName} - {bank.accountNumber}
                                    </option>
                                ))
                            ) : (
                                <option value="">No bank accounts available</option>
                            )}
                        </select>
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Submit Transaction
                </button>
            </form>
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
};

export default TransactionStart;
