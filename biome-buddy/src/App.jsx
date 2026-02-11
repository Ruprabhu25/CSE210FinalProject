import React, { useState, useEffect } from 'react'
import './App.css'
// import GameBlank from './Game'
import LeftPane from './home/LeftPane'
import RightPane from './home/RightPane'
import ConfirmModal from './home/ConfirmModal'
import DisasterDemo from './components/disasterpopup/disasterdemo'

function App() {
  const [started, setStarted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmedBiome, setConfirmedBiome] = useState(null)

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
    alert('This will navigate to a new game session');
    return null;
    // return <GameBlank />
  }
  const handleForestClick = () => setShowConfirm(true)

  const handleConfirm = () => {
    setConfirmedBiome('forest')
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/game')
    }
    setStarted(true)
    setShowConfirm(false)
  }

  return (
    <>
      <div className="home-container">
        <LeftPane onForestClick={handleForestClick} />
        <RightPane />
      </div>

      {showConfirm ? (
        <ConfirmModal onClose={() => setShowConfirm(false)} onConfirm={handleConfirm} />
      ) : null}
    </>
  )
}

export default App
