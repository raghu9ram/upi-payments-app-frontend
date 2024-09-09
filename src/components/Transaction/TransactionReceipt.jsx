// src/components/TransactionReceipt.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const TransactionReceipt = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [error, setError] = useState('');

    // Extract transaction ID from location state
    const { transactionSuccess } = location.state || {};
    const transactionId = transactionSuccess?.id;

    useEffect(() => {
        if (transactionId) {
            const fetchTransaction = async () => {
                try {
                    const response = await axios.get(`http://localhost:9090/transactions/${transactionId}`);
                    setTransaction(response.data);
                } catch (error) {
                    console.error('Error fetching transaction details:', error.response ? error.response.data : error.message);
                    setError('Error fetching transaction details: ' + (error.response ? error.response.data.message : error.message));
                }
            };

            fetchTransaction();
        } else {
            setError('No transaction ID provided');
        }
    }, [transactionId]);

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h1 className="text-2xl font-bold mb-6">Transaction Receipt</h1>
            {transaction ? (
                <div className="space-y-4">
                    <p className="text-lg font-medium">Recipient Mobile: <span className="font-normal">{transaction.recipientMobile}</span></p>
                    <p className="text-lg font-medium">Amount: <span className="font-normal">{transaction.amount}</span></p>
                    <p className="text-lg font-medium">DateTime: <span className="font-normal">{new Date(transaction.dateTime).toLocaleString()}</span></p>
                    <p className="text-lg font-medium">Status: <span className="text-green-600 font-semibold">SUCCESS</span></p>
                </div>
            ) : (
                <p className="text-red-500">{error || 'Loading transaction details...'}</p>
            )}
            <div className="mt-6 flex gap-4">
                <button
                    onClick={() => navigate('/userBanks')}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    View Your Banks
                </button>
                <button
                    onClick={() => navigate('/newPayment')}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    New Payment
                </button>
            </div>
        </div>
    );
};

export default TransactionReceipt;
