import { useState, useEffect } from 'react'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './components/MainLayout';
import Home from './pages/main/Home';
import About from './pages/main/About';
import ScrollToTop from './components/main/common/ScrollToTop';
import Market from './pages/main/Market';
import SellGear from './pages/main/SellGear';
import BuildDoctor from './pages/main/BuildDoctor';
import LoginModal from './components/main/authentication/LoginModal';
import RegisterModal from './components/main/authentication/RegisterModal';
import ForgotModal from './components/main/authentication/ForgotModal';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isOTPOpen, setIsOTPOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = (isMenuOpen || isLoginOpen || isRegisterOpen || isForgotOpen || isOTPOpen) ? 'hidden' : 'unset';
  }, [isMenuOpen, isLoginOpen, isRegisterOpen, isForgotOpen, isOTPOpen]);

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  }

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsForgotOpen(false);
    setIsLoginOpen(true);
  }

  const switchToForgot = () => {
    setIsLoginOpen(false);
    setIsForgotOpen(true);
  }

  const SwitchToOTP = () => {
    setIsForgotOpen(false);
    setIsOTPOpen(true);
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      
      <Routes>
        {/* Pass the login trigger to MainLayout so the Navbar can use it */}
        <Route 
          path='/' 
          element={
            <MainLayout 
              openLogin={() => setIsLoginOpen(true)} 
              isMenuOpen={isMenuOpen} 
              setIsMenuOpen={setIsMenuOpen} 
            />
          }
        >
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='marketplace' element={<Market />} />
          <Route path='sell' element={<SellGear />} />
          <Route path='build-doctor' element={<BuildDoctor />} />
        </Route>
      </Routes>

      {/* Modals sit outside the Routes so it can overlay any page */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={switchToRegister}
        onSwitchToForgot={switchToForgot} 
      />
      
      <ForgotModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSwitchToLogin={switchToLogin}
        onSwitchToOTP={SwitchToOTP}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose = {() => setIsRegisterOpen(false)}
        onSwitchToLogin={switchToLogin}
      />
    </BrowserRouter>
  )
}

export default App;