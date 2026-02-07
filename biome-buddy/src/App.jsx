import { useState, useEffect } from 'react'
import './App.css'
import GameBlank from './Game'

function App() {
  const [started, setStarted] = useState(false)

  function handleStart() {
    // switch to the blank game page
    setStarted(true)
    try {
      window.history.pushState({}, '', '/game')
    } catch (e) {}
  }

  // Keep started state in sync with browser history so back/forward work as expected.
  useEffect(() => {
    function syncFromLocation() {
      if (typeof window !== 'undefined') {
        setStarted(window.location.pathname === '/game')
      }
    }

    // set initial state
    syncFromLocation()

    // listen for history navigation
    window.addEventListener('popstate', syncFromLocation)
    return () => window.removeEventListener('popstate', syncFromLocation)
  }, [])

  return (
    <div className="home-container">
      <div className="left-pane">
        <div className="left-inner">
          <h1 className="title">Biome Buddy</h1>
          {!started ? (
            <button className="start-button" onClick={handleStart}>
              Start
            </button>
          ) : (
            <GameBlank />
          )}
        </div>
      </div>
      <div className="right-pane">
        <div className="right-inner">
          {/* decorative area - could show an image, animation, or instructions */}
          <div className="decor">
            <div className="leaf" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
