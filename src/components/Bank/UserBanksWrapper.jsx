import React from 'react';
import { useUser } from '../../context/UserContext';
import UserLogin from '../User/UserLogin';
import UserBanks from './UserBanks';

const UserBanksWrapper = () => {
    const { user } = useUser();
    console.log('User:', user); // Debugging log
    if (!user) {
        return <UserLogin />;
    }

    return <UserBanks />;
};

export default UserBanksWrapper;


