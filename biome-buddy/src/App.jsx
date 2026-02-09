import { useState, useEffect } from 'react'
import './App.css'
import GameBlank from './Game'
import californiaImg from './assets/california.png'
import forestIcon from './assets/forest-icon.png'

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
    return <GameBlank />
  }

  return (
    <>
    <div className="home-container">
      <div className="left-pane">
        <div className="left-inner">
          <div className="left-image-wrap">
            <img src={californiaImg} alt="California" className="left-image" />
            <button
              type="button"
              className="forest-button"
              aria-label="Choose Forest Biome"
              onClick={() => {
                setShowConfirm(true)
              }}
            >
              <img src={forestIcon} alt="Forest icon" className="forest-icon" />
            </button>
          </div>
             <p className="left-footer">Click on a biome to get started</p>
        </div>
      </div>
      <div className="right-pane">
        <div className="right-inner">
          <h1 className="title">Biome Buddy</h1>
        </div>
      </div>
    </div>

    {showConfirm ? (
      <div className="confirm-backdrop" role="dialog" aria-modal="true" aria-label="Confirm biome choice" onClick={() => setShowConfirm(false)}>
        <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
          <button className="confirm-close" aria-label="Close" onClick={() => setShowConfirm(false)}>✕</button>
          <h2>You chose the Forest Biome</h2>
          <p style={{ marginTop: 8, marginBottom: 18 }}>Be prepared to encounter wildfires, landslides, outbreaks and more!
 </p>
          <div className="confirm-actions">
            <button
              className="btn-primary"
              onClick={() => {
                // mark the biome, update history and show the game view
                setConfirmedBiome('forest')
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', '/game')
                }
                setStarted(true)
                setShowConfirm(false)
              }}
            >
              Get started
            </button>
            <button className="btn-ghost" onClick={() => setShowConfirm(false)}>Go back</button>
          </div>
        </div>
      </div>
    ) : null}
    </>
  )
}

export default App
