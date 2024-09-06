import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserRegistration = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [userPin, setUserPin] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleUserRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9090/users', {
                mobileNumber,
                userPin,
                firstName,
                lastName,
                email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200 || response.status === 201) {
                setMobileNumber('');
                setUserPin('');
                setFirstName('');
                setLastName('');
                setEmail('');
                setError(null);
                navigate('/userBanks');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            setError(error);
        }
    };

    return (
        <div>
            <h1>Register as a New User</h1>
            <form onSubmit={handleUserRegistration}>
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
                <div>
                    <label>
                        First Name:
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type='submit'>Register</button>
            </form>
            {error && <p>Error: {error.message}</p>}
            <p>Already an Existing User? <a href="/">Login Here</a></p>
        </div>
    );
};

export default UserRegistration;
