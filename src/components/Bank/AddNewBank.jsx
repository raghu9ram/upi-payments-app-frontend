import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const AddNewBank = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankPin, setBankPin] = useState('');
    const [transactionLimit, setTransactionLimit] = useState('');
    const [balance, setBalance] = useState(100000); // Set initial balance
    const [primaryBank, setPrimaryBank] = useState(false); // Add state for primaryBank
    const [error, setError] = useState('');

    // Hard-coded list of predefined banks
    const predefinedBanks = [
        'Kotak Bank',
        'HDFC Bank',
        'ICICI Bank',
        'State Bank of India (SBI)',
        'Axis Bank',
        'Punjab National Bank (PNB)',
        'Bank of Baroda',
        'Union Bank of India',
        'IDFC FIRST Bank',
        'Canara Bank',
        'Standard Chartered Bank',
        'Citi Bank',
        'Yes Bank',
        'JPMorgan Chase',
        'HSBC Bank'
    ];

    const handleAddBank = async (e) => {
        e.preventDefault();

        if (!user || !user.id) {
            setError('User ID is missing');
            return;
        }

        // Validate that bankPin is a 4-digit number
        if (!/^\d{4}$/.test(bankPin)) {
            setError('Bank PIN must be a 4-digit number');
            return;
        }

        // Validate that transactionLimit and balance are numbers and non-negative
        if (isNaN(transactionLimit) || transactionLimit < 0) {
            setError('Transaction limit must be a non-negative number');
            return;
        }

        if (isNaN(balance) || balance < 0) {
            setError('Balance must be a non-negative number');
            return;
        }

        try {
            // If the new bank is to be set as primary, update the existing primary bank
            if (primaryBank) {
                // Step 1: Find the current primary bank and update it
                await axios.patch(`http://localhost:9090/banks/primary/${user.id}`, {
                    primaryBank: false
                });
            }

            // Step 2: Add the new bank with the specified primaryBank value
            await axios.post('http://localhost:9090/banks/', {
                bankName,
                accountNumber: parseInt(accountNumber, 10), // Ensure accountNumber is sent as a number
                bankPin: parseInt(bankPin, 10), // Ensure bankPin is sent as a number
                transactionLimit: parseInt(transactionLimit, 10), // Ensure transactionLimit is sent as a number
                balance: parseInt(balance, 10), // Ensure balance is sent as a number
                primaryBank, // Include primaryBank in the request
                userModel: { id: user.id }
            });

            // Reset form fields
            setBankName('');
            setAccountNumber('');
            setBankPin('');
            setTransactionLimit('');
            setBalance(100000);
            setPrimaryBank(false); // Reset primaryBank
            setError(null);

            // Redirect to user banks page
            navigate('/userBanks');
        } catch (error) {
            console.error('Error adding bank:', error.response ? error.response.data : error.message);
            setError('Error adding bank: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Add New Bank Account</h1>
            <form onSubmit={handleAddBank} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Select Bank Name:</label>
                    <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Select a bank</option>
                        {predefinedBanks.map((bank, index) => (
                            <option key={index} value={bank}>
                                {bank}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Account Number:</label>
                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter account number"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bank PIN:</label>
                    <input
                        type="text"
                        value={bankPin}
                        onChange={(e) => setBankPin(e.target.value)}
                        placeholder="Enter 4-digit PIN"
                        maxLength="4"
                        pattern="\d{4}"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Limit:</label>
                    <input
                        type="number"
                        value={transactionLimit}
                        onChange={(e) => setTransactionLimit(e.target.value)}
                        placeholder="Enter transaction limit"
                        required
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Bank
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default AddNewBank;
