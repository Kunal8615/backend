import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/Login';
import SignUp from './page/SignUp';
import Homepage from './page/Homepage';

const App = () => {
  return (

    <>
    
    <Router>
      <Routes>
    
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path ="/homepage" element={<Homepage/>} />
      
      </Routes>
    </Router>

    </>
  );
};

export default App;