import React, { useState, useEffect } from 'react'
import './home.css'
import GameBlank from '../game/Game'
import AboutPopup from './options/AboutPopup'
import CreditsPopup from './options/CreditsPopup'
import ConfirmModal from './ConfirmModal'
import SettingsButton from './SettingsButton'
import GameTitle from '../assets/game-title.png'


function App() {
  const [started, setStarted] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showCredits, setShowCredits] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmedBiome, setConfirmedBiome] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('biomeBuddyDarkMode')
    return saved !== null ? saved === 'true' : false
  })

  // Save dark mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('biomeBuddyDarkMode', String(darkMode))
  }, [darkMode])

  // Keep started state in sync with browser history so back/forward work as expected.
  useEffect(() => {
    function syncFromLocation() {
      if (typeof window !== 'undefined') {
        setStarted(window.location.pathname === '/game')
      }
    }

    // keep the initial view as the home page.
    // Only respond to future history navigation (popstate) so Back/Forward still works.
    window.addEventListener('popstate', syncFromLocation)
    return () => window.removeEventListener('popstate', syncFromLocation)
  }, [])

  // close confirm modal on Escape for accessibility
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setShowConfirm(false)
    }
    if (showConfirm) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showConfirm])

  // When started is true, render the game view
  if (started) {
    return <GameBlank/>;
  }
  const handleForestClick = () => setShowConfirm(true)
  const handleAboutClick = () => setShowAbout(true)
  const handleCreditsClick = () => setShowCredits(true)



  const handleConfirm = () => {
    setConfirmedBiome('forest')
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/game')
    }
    setStarted(true)
    setShowConfirm(false)
  }

    const handleDarkModeToggle = () => {
    setDarkMode(!darkMode)
    }

  return (
    <>
      <div className="home-container">
        <SettingsButton darkMode={darkMode} onDarkModeToggle={handleDarkModeToggle} />
        <div className="game-header">
          <img src={GameTitle} alt="Biome Buddy Game Title" className="game-title" />
          <button className="start-btn" onClick={handleForestClick}>Start Game</button>
        </div>     
        
        <span className='options-container'>
          <button className="options-btn" onClick={handleAboutClick}>About</button>
          <button className="options-btn" onClick={handleCreditsClick}>Credits</button>
        </span>
        
      {showConfirm ? (
        <ConfirmModal onClose={() => setShowConfirm(false)} onConfirm={handleConfirm} darkMode={darkMode} />
      ) : null}
      {showAbout && <AboutPopup onClose={() => setShowAbout(false)} darkMode={darkMode} />}
      {showCredits && <CreditsPopup onClose={() => setShowCredits(false)} darkMode={darkMode} />}
    </div>
    </>
    
  )
}

export default App
