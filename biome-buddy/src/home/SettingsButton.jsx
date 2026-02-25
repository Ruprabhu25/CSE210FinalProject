import React, { useState, useEffect, useRef } from 'react'
import './SettingsButton.css'
import settingIcon from '../assets/setting-button.png'

export default function SettingsButton({ darkMode, onDarkModeToggle }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('biomeBuddyAudioEnabled')
    return saved !== null ? saved === 'true' : true
  })
  const [readAloudEnabled, setReadAloudEnabled] = useState(() => {
    const saved = localStorage.getItem('biomeBuddyReadAloudEnabled')
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

  const handleReadAloudToggle = () => {
    const newValue = !readAloudEnabled
    setReadAloudEnabled(newValue)
    localStorage.setItem('biomeBuddyReadAloudEnabled', String(newValue))
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
      <button className="settings-button" ref={settingsButtonRef} onClick={handleSettingsClick} aria-label="Settings">
        <img src={settingIcon} alt="Settings" />
      </button>
      {settingsOpen && (
        <div className={`settings-menu ${darkMode ? 'dark-mode' : ''}`} ref={settingsMenuRef}>
          <ul>
            <li>
              <div className="dark-mode-toggle">
                <span>Dark Mode</span>
                <label className="toggle-switch">
                  <input type="checkbox" checked={darkMode} onChange={onDarkModeToggle} />
                  <span className="slider"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="dark-mode-toggle">
                <span>Audio</span>
                <label className="toggle-switch">
                  <input type="checkbox" checked={audioEnabled} onChange={handleAudioToggle} />
                  <span className="slider"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="dark-mode-toggle">
                <span>Read Aloud</span>
                <label className="toggle-switch">
                  <input type="checkbox" checked={readAloudEnabled} onChange={handleReadAloudToggle} />
                  <span className="slider"></span>
                </label>
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
