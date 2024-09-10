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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800">Login as an Existing User</h1>
                <form onSubmit={handleUserLogin} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="mobileNumber" className="mb-2 text-gray-700">Mobile Number</label>
                        <input
                            id="mobileNumber"
                            type="text"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            required
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="userPin" className="mb-2 text-gray-700">6 Digit Pin</label>
                        <input
                            id="userPin"
                            type="password"
                            value={userPin}
                            onChange={(e) => setUserPin(e.target.value)}
                            required
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 text-indigo-600 text-w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
                <p className="mt-6 text-center">
                    Don't have an Account?{' '}
                    <a href="/register" className="text-indigo-600 hover:underline">Register Here</a>
                </p>
            </div>
        </div>
    );
};

export default UserLogin;
