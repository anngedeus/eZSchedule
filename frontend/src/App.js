import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import React from 'react';
import NavBar from './components/NavBar';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Landing from './components/landing/Landing';
import SignUp from './components/SignUpModal';
import { useEffect } from "react";
import './App.css';

function App() {

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  
  return (

    <div className='App'>
    <Router>
      <NavBar/>
      <div className='Sections'>
        <Routes>
          <Route path='/' element={<Welcome/>} exact="true"/>
          <Route path='/Login' element={<Login/>}  />
          <Route path='/Landing' element={<Landing/>} />
          <Route path='/SignUp' element={<SignUp/>} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
