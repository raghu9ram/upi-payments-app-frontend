import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const UserLogin = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [userPin, setUserPin] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleUserLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:9090/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobileNumber, userPin }),
            });
            if (!response.ok) {
                throw new Error('Invalid Mobile Number or UserPin');
            }
            const data = await response.json();
            setUser(data); // Set user data in context
            navigate('/userBanks');
        } catch (error) {
            setError(error);
        }
    };

    return (
        <div>
            <h1>Login as an Existing User</h1>
            <form onSubmit={handleUserLogin}>
                <div>
                    <label>
                        Mobile Number:
                        <input
                            type="number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            required 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        6 Digit Pin:
                        <input
                            type="number"
                            value={userPin}
                            onChange={(e) => setUserPin(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type='submit'>Login</button>
            </form>
            {error && <p>Error: {error.message}</p>}
            <p>Don't have an Account? <a href="/register">Register Here</a></p>
        </div>
    );
};

export default UserLogin;

