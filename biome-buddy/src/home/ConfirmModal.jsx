import React, { useState, useEffect } from 'react'
import './ConfirmModal.css'
import letsGoAudio from '../assets/lets_go.wav'

export default function ConfirmModal({ onClose, onConfirm }) {
  const [hasSavedGame, setHasSavedGame] = useState(false)

  useEffect(() => {
    // Check if there's a saved game
    const savedState = localStorage.getItem('biomeBuddySaveData')
    setHasSavedGame(!!savedState)
  }, [])

  const playLetsGoSound = () => {
    const audioEnabled = localStorage.getItem('biomeBuddyAudioEnabled')
    if (audioEnabled === 'false') return
    
    const audio = new Audio(letsGoAudio)
    audio.play()?.catch(error => console.log('Audio play failed:', error))
  }

  const handleNewGame = () => {
    // Clear saved game data
    localStorage.removeItem('biomeBuddySaveData')
    playLetsGoSound()
    onConfirm()
  }

  const handleResumeGame = () => {
    playLetsGoSound()
    onConfirm()
  }

  const handleGetStarted = () => {
    playLetsGoSound()
    onConfirm()
  }

  return (
    <div className="confirm-backdrop" role="dialog" aria-modal="true" aria-label="Confirm biome choice" onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="confirm-close" aria-label="Close" onClick={onClose}>✕</button>
        
        {hasSavedGame ? (
          <>
            <h2>Resume Game?</h2>
            <p style={{ marginTop: 8, marginBottom: 18 }}>Would you like to continue your saved progress?</p>
            <div className="confirm-actions">
              <button className="btn-primary" onClick={handleResumeGame}>
                Yes, Resume
              </button>
              <button className="btn-ghost" onClick={handleNewGame}>
                No, Start New
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>You chose the Forest Biome</h2>
            <p style={{ marginTop: 8, marginBottom: 18 }}>Be prepared to encounter wildfires, landslides, outbreaks and more!</p>
            <div className="confirm-actions">
              <button className="btn-primary" onClick={handleGetStarted}>
                Get started
              </button>
              <button className="btn-ghost" onClick={onClose}>Go back</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}