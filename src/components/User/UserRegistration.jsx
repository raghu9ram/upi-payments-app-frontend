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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Register as a New User</h1>
                <form onSubmit={handleUserRegistration} className="space-y-4">
                    <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number:</label>
                        <input
                            id="mobileNumber"
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="userPin" className="block text-sm font-medium text-gray-700">6 Digit Pin:</label>
                        <input
                            id="userPin"
                            type="password"
                            value={userPin}
                            onChange={(e) => setUserPin(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name:</label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name:</label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Register
                    </button>
                </form>
                {error && <p className="mt-4 text-red-600 text-center">Error: {error.message}</p>}
                <p className="mt-4 text-center text-gray-600">
                    Already an Existing User?{' '}
                    <a href="/" className="text-indigo-600 hover:text-indigo-700">Login Here</a>
                </p>
            </div>
        </div>
    );
};

export default UserRegistration;
