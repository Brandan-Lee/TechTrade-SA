import { useState, useEffect } from 'react'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './components/MainLayout';
import Home from './pages/main/Home';
import About from './pages/main/About';
import ScrollToTop from './components/main/common/ScrollToTop';
import Market from './pages/main/Market';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='marketplace' element={<Market />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
