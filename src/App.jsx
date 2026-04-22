import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import NavBar from './components/main/common/navbar'
import MenuDrawer from './components/main/common/menuDrawer'
import WelcomeBanner from './components/main/common/welcomeBanner'
import TrustedSellers from './components/main/landing-components/TrustedSeller'
import FilterBar from './components/main/common/FilterBar'
import FeaturedListings from './components/main/landing-components/FeaturedListings'
import Footer from './components/main/common/Footer'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  return (
    <div className='min-h-screen flex flex-col bg-slate-50'>
      {/* Header */}
      <header className="w-full h-auto bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 border-b-4 border-pink-600 flex justify-center px-4">
        <NavBar toggleMenu={() => setIsMenuOpen(true)} />
      </header>

      {/* Menu Drawer */}
      <MenuDrawer isOpen={isMenuOpen} closeMenu={() => setIsMenuOpen(false)} />

      <WelcomeBanner />

      <FilterBar />

      {/* Your Page Content Goes Here */}
      <main className="flex-1">
          <TrustedSellers />
          <FeaturedListings />
      </main>

      <Footer />
    </div>
  )
}

export default App
