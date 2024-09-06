import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserBanks = () => {
    const { user } = useUser();
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    if (!user) {
        return <div>Please log in to view your bank details.</div>;
    }

    return (
        <div>
            <h1>Your Banks</h1>
            <p>User ID: {user.id}</p>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {banks.length === 0 ? (
                !loading && <p>No banks found.</p>
            ) : (
                <ul>
                    {banks.map((bank, index) => (
                        <li key={index}>
                            <h2>{bank.bankName}</h2>
                            <p>Account Number: {bank.accountNumber}</p>
                            <p>Bank PIN: {bank.bankPin}</p>
                            <p>Transaction Limit: {bank.transactionLimit}</p>
                            <p>Balance: {bank.balance}</p>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => navigate('/addNewBank')}>Add New Bank</button>
            <Link to="/transactionHistory">View Transaction History</Link>
            <button onClick={() => navigate('/newPayment')}>New Payment</button>
        </div>
    );
};

export default UserBanks;
