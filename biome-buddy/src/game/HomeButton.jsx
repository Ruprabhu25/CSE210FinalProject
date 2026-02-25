import React, { useState } from 'react'
import './HomeButton.css'
import homeIcon from '../assets/home.png'

export default function HomeButton({ onSaveAndExit, onJustExit, darkMode }) {
  const [showModal, setShowModal] = useState(false)

  const handleSaveAndExit = () => {
    setShowModal(false)
    if (onSaveAndExit) onSaveAndExit()
  }

  const handleJustExit = () => {
    setShowModal(false)
    if (onJustExit) onJustExit()
  }

  return (
    <>
      <button className="home-button" onClick={() => setShowModal(true)} aria-label="Home">
        <img src={homeIcon} alt="Home" />
      </button>

      {showModal && (
        <div className={`home-modal-backdrop ${darkMode ? 'dark-mode' : ''}`} onClick={() => setShowModal(false)}>
          <div className={`home-modal ${darkMode ? 'dark-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="home-modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <h2>Save Progress?</h2>
            <p>Would you like to save your progress before returning to the home page?</p>
            <div className="home-modal-buttons">
              <button className="btn-primary" onClick={handleSaveAndExit}>
                Save and Exit
              </button>
              <button className="btn-ghost" onClick={handleJustExit}>
                Just Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
