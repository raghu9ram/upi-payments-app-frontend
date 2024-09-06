// src/components/AddNewBank.jsx
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
    const [balance, setBalance] = useState(100000);
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

        if (bankPin.length !== 4) {
            setError('Bank PIN must be 4 digits long');
            return;
        }

        try {
            await axios.post('http://localhost:9090/banks/', {
                bankName,
                accountNumber,
                bankPin,
                transactionLimit,
                balance,
                userModel: { id: user.id }
            });

            setBankName('');
            setAccountNumber('');
            setBankPin('');
            setTransactionLimit('');
            setBalance(100000);
            setError(null);
            navigate('/userBanks');
        } catch (error) {
            console.error('Error adding bank:', error.response ? error.response.data : error.message);
            setError('Error adding bank: ' + (error.response ? error.response.data : error.message));
        }
    };

    return (
        <div>
            <h1>Add New Bank Account</h1>
            <form onSubmit={handleAddBank}>
                <div>
                    <label>Select Bank Name:</label>
                    <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
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
                    <label>Account Number:</label>
                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter account number"
                        required
                    />
                </div>
                <div>
                    <label>Bank PIN:</label>
                    <input
                        type="text"
                        value={bankPin}
                        onChange={(e) => setBankPin(e.target.value)}
                        placeholder="Enter 4-digit UPI PIN"
                        maxLength="4"
                        pattern="\d{4}"
                        required
                    />
                </div>
                <div>
                    <label>Transaction Limit:</label>
                    <input
                        type="number"
                        value={transactionLimit}
                        onChange={(e) => setTransactionLimit(e.target.value)}
                        placeholder="Enter transaction limit"
                        required
                    />
                </div>
                {/* <div>
                    <label>Balance:</label>
                    <input
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        disabled
                    />
                </div> */}
                <button type="submit">Add Bank</button>
                {error && <p>Error: {error}</p>}
            </form>
        </div>
    );
};

export default AddNewBank;
