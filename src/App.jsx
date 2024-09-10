import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLogin from './components/User/UserLogin';
import UserRegistration from './components/User/UserRegistration';
import { UserProvider, useUser } from './context/UserContext';
import UserBanksWrapper from './components/Bank/UserBanksWrapper';
import TransactionHistory from './components/Transaction/TransactionHistory';
import AddNewBank from './components/Bank/AddNewBank';
import TransactionStart from './components/Transaction/TransactionStart';
import TransactionAuth from './components/Transaction/TransactionAuth';
import TransactionReceipt from './components/Transaction/TransactionReceipt';
import Navbar from './components/NavBar';
import UserProfileEdit from './components/User/UserProfileEdit';

function App() {
    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<UserLogin />} />
                        <Route path='/register' element={<UserRegistration />} />
                        <Route path='/editProfile' element={<UserProfileEdit />} />
                        <Route path='/userBanks' element={<UserBanksWrapper />} />
                        <Route path='/transactionHistory' element={<TransactionHistory />} />
                        <Route path='/addNewBank' element={<AddNewBank />} />
                        <Route path='/newPayment' element={<TransactionStart />} />
                        <Route path='/transactionAuth' element={<TransactionAuth />} />
                        <Route path='/transactionReceipt' element={<TransactionReceipt />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
