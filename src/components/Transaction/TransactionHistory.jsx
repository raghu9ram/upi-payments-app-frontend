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
        return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <p className="text-lg font-semibold text-gray-700">Please log in to view your transaction history.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
            {loading && <p className="text-blue-500">Loading...</p>} {/* Display loading message */}
            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
            {transactions.length === 0 && !loading ? (
                <p className="text-gray-500">No transactions found.</p>
            ) : (
                <ul className="space-y-4">
                    {transactions.map((transaction, index) => (
                        <li key={index} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                            <p className="text-lg font-medium text-gray-800">Recipient Mobile: <span className="font-normal">{transaction.recipientMobile}</span></p>
                            <p className="text-lg font-medium text-gray-800">Amount: <span className="font-normal">{transaction.amount}</span></p>
                            <p className="text-lg font-medium text-gray-800">Date: <span className="font-normal">{new Date(transaction.dateTime[0], transaction.dateTime[1] - 1, transaction.dateTime[2], transaction.dateTime[3], transaction.dateTime[4]).toLocaleString()}</span></p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TransactionHistory;
