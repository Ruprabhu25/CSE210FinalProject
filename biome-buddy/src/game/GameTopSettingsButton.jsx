import React, { useState, useEffect, useRef } from 'react'
import './GameTopSettingsButton.css'
import settingIcon from '../assets/setting-button.png'

export default function GameTopSettingsButton({ darkMode, onDarkModeToggle }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('biomeBuddyAudioEnabled')
    return saved !== null ? saved === 'true' : true
  })
  const settingsMenuRef = useRef(null)
  const settingsButtonRef = useRef(null)

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen)
  }

  const handleAudioToggle = () => {
    const newValue = !audioEnabled
    setAudioEnabled(newValue)
    localStorage.setItem('biomeBuddyAudioEnabled', String(newValue))
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target) &&
        !settingsButtonRef.current.contains(event.target)
      ) {
        setSettingsOpen(false)
      }
    }

    if (settingsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [settingsOpen])

  return (
    <>
      <button 
        className="game-settings-button" 
        ref={settingsButtonRef}
        onClick={handleSettingsClick}
        aria-label="Settings"
      >
        <img src={settingIcon} alt="Settings" />
      </button>
      {settingsOpen && (
        <div className={`game-settings-menu ${darkMode ? 'dark-mode' : ''}`} ref={settingsMenuRef}>
          <ul>
            <li>
              <div className="game-audio-toggle">
                <span>Dark Mode</span>
                <label className="game-toggle-switch">
                  <input type="checkbox" checked={darkMode} onChange={onDarkModeToggle} />
                  <span className="game-slider"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="game-audio-toggle">
                <span>Audio</span>
                <label className="game-toggle-switch">
                  <input type="checkbox" checked={audioEnabled} onChange={handleAudioToggle} />
                  <span className="game-slider"></span>
                </label>
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
