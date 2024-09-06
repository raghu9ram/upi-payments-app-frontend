import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure to import axios
import { useUser } from '../../context/UserContext';

const TransactionHistory = () => {
    const { user } = useUser();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) return;

            setLoading(true); // Start loading
            try {
                const response = await axios.get(`http://localhost:9090/users/${user.id}/transactions`);
                setTransactions(response.data);
                setError(null); // Clear any previous error
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError('Error fetching transaction history.');
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchTransactions();
    }, [user]);

    if (!user) {
        return <div>Please log in to view your transaction history.</div>;
    }

    return (
        <div>
            <h1>Transaction History</h1>
            {loading && <p>Loading...</p>} {/* Display loading message */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            {transactions.length === 0 && !loading ? (
                <p>No transactions found.</p>
            ) : (
                <ul>
                    {transactions.map((transaction, index) => (
                        <li key={index}>
                            <p>Recipient Mobile: {transaction.recipientMobile}</p>
                            <p>Amount: {transaction.amount}</p>
                            <p>Date: {new Date(transaction.dateTime[0], transaction.dateTime[1] - 1, transaction.dateTime[2], transaction.dateTime[3], transaction.dateTime[4]).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TransactionHistory;
