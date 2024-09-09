import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const TransactionAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();
    const { recipientUserId, amount, selectedBankId } = location.state || {};
    const [upiPin, setUpiPin] = useState('');
    const [error, setError] = useState('');

    // Add console logs to debug
    console.log('User from context:', user);
    console.log('Recipient Id:', recipientUserId);

    const fromUserId = user?.id;
    const fromBankId = selectedBankId;
    const toUserId = recipientUserId;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fromUserId || !toUserId) {
            setError('Missing user IDs.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:9090/transactions/transfer', {
                fromUserId,
                fromBankId,
                toUserId,
                amount,
                upiPin
            });

            navigate('/transactionReceipt', { state: { transactionSuccess: response.data } });
        } catch (error) {
            console.error('Error processing transaction:', error.response ? error.response.data : error.message);
            setError('Error processing transaction: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h1 className="text-2xl font-bold mb-6">Transaction Authentication</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        UPI PIN:
                        <input
                            type="password"
                            value={upiPin}
                            onChange={(e) => setUpiPin(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Submit Transaction
                </button>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </form>
        </div>
    );
};

export default TransactionAuth;
