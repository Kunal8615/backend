import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/Login';
import SignUp from './page/SignUp';
import Homepage from './page/Homepage';
import UserProfile from './page/user';

const App = () => {
  return (

    <>
    
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path ="/homepage" element={ <UserProfile/>} />
      
      </Routes>
    </Router>

   



    </>
  );
};

export default App;