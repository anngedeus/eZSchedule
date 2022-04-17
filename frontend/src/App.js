import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import React from 'react';
import NavBar from './components/NavBar';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Landing from './components/landing/Landing';
import SignUp from './components/SignUpModal';
import { useEffect } from "react";
import './App.css';
import { UserProvider, useUser } from './components/User';

function AppRouter() {
  const user = useUser();

  return (
    <Router>
      <NavBar/>
      <div className='Sections'>
        <Routes>
          <Route path='/' element={user.loggedIn ? <Landing/> : <Welcome/>} exact/>
          <Route path='/Login' element={<Login/>} />
          <Route path='/SignUp' element={<SignUp/>} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div className='App'>
      <UserProvider>
        <AppRouter/>
      </UserProvider>
    </div>
  );
}

export default App;
