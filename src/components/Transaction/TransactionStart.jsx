import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const TransactionStart = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [recipientMobile, setRecipientMobile] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(null);
    const [selectedBankId, setSelectedBankId] = useState('');
    const [banks, setBanks] = useState([]); // Added state for banks
    const [loading, setLoading] = useState(false); // Added loading state

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

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
    
        const bankId = Number(selectedBankId);
        const transactionAmount = Number(amount);
        const recipientNumber = Number(recipientMobile);
    
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
    
        // Validating the recipientMobile
        if (isNaN(recipientNumber) || recipientNumber <= 0) {
            setError('Invalid recipient mobile number');
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
                    recipientMobile: recipientNumber,
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
    
                navigate('/userBanks'); 
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
        <div>
            <h1>Initialize Transaction</h1>
            {loading && <p>Loading...</p>} {/* Display loading indicator */}
            <form onSubmit={handleTransactionSubmit}>
                <div>
                    <label>
                        Recipient Mobile Number:
                        <input
                            type="number"
                            value={recipientMobile}
                            onChange={(e) => setRecipientMobile(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Amount:
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Select Bank Account:
                        <select
                            value={selectedBankId}
                            onChange={(e) => setSelectedBankId(e.target.value)}
                            required
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
                <button type='submit'>Submit Transaction</button>
            </form>
            {error && <p>Error adding transaction: {error}</p>}
        </div>
    );
}

export default TransactionStart;
