import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import NavBar from './components/navbar'
import MenuDrawer from './components/menuDrawer'
import WelcomeBanner from './components/welcomeBanner'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  return (
    <div className='min-h-screen flex flex-col bg-slate-50'>
      {/* Header */}
      <header className="w-full h-auto bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 border-b-4 border-pink-600 flex flex justify-center px-4">
        <NavBar toggleMenu={() => setIsMenuOpen(true)} />
      </header>

      {/* Menu Drawer */}
      <MenuDrawer isOpen={isMenuOpen} closeMenu={() => setIsMenuOpen(false)} />

      <WelcomeBanner />

      {/* Your Page Content Goes Here */}
      <main className="p-8">
          <p>nothing to show yet</p>
      </main>
    </div>
  )
}

export default App
