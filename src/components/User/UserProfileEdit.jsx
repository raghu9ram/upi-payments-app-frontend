import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const UserProfileEdit = () => {
    const { user, setUser } = useUser();
    const [mobileNumber, setMobileNumber] = useState('');
    const [userPin, setUserPin] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:9090/users/${user.id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const { mobileNumber, userPin, firstName, lastName, email } = response.data;
                setMobileNumber(mobileNumber);
                setUserPin(userPin);
                setFirstName(firstName);
                setLastName(lastName);
                setEmail(email);
            } catch (error) {
                setError(error);
            }
        };

        fetchUserProfile();
    }, [user, navigate]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:9090/users/${user.id}`, {
                mobileNumber,
                userPin,
                firstName,
                lastName,
                email,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setUser((prevUser) => ({
                    ...prevUser,
                    mobileNumber,
                    userPin,
                    firstName,
                    lastName,
                    email
                }));

                setError(null);
                navigate('/userBanks');
            } else {
                throw new Error('Profile update failed');
            }
        } catch (error) {
            setError(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Edit Your Profile</h1>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number:</label>
                        <input
                            id="mobileNumber"
                            type="text"
                            value={mobileNumber}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="userPin" className="block text-sm font-medium text-gray-700">User PIN:</label>
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
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Update Profile
                    </button>
                </form>
                {error && <p className="mt-4 text-red-600 text-center">Error: {error.message}</p>}
            </div>
        </div>
    );
};

export default UserProfileEdit;
