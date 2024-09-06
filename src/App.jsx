import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import UserLogin from './components/User/UserLogin';
import UserRegistration from './components/User/UserRegistration';
import { UserProvider, useUser } from './context/UserContext';
import UserBanksWrapper from './components/Bank/UserBanksWrapper';
import TransactionHistory from './components/Transaction/TransactionHistory';
import AddNewBank from './components/Bank/AddNewBank';
import TransactionStart from './components/Transaction/TransactionStart';

function App() {
    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path='/' element={<UserLogin />} />
                        <Route path='/register' element={<UserRegistration />} />
                        <Route path='/userBanks' element={<UserBanksWrapper />} />
                        <Route path='/transactionHistory' element={<TransactionHistory />} />
                        <Route path='/addNewBank' element={<AddNewBank />} />
                        <Route path='/newPayment' element={<TransactionStart />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
