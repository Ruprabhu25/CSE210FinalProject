import React from 'react'
import './GameTop.css'
import GameTopSettingsButton from './GameTopSettingsButton'

export default function GameTop({ currentSeason, roundNumber, health, darkMode, onDarkModeToggle, audioEnabled, onAudioToggle }) {

  const healthFill = {
    width: `${health}%`
  }
  return (
    <div className={`topBar ${darkMode ? 'dark-mode' : ''}`}>
      <div className="healthContainer">
        <div className="healthFill" style={healthFill}/>
        <div className="healthText">Ecosystem Health: {Math.round(health)}%</div>
      </div>
      <div className="seasonBadge"> {currentSeason}</div>
      <GameTopSettingsButton darkMode={darkMode} onDarkModeToggle={onDarkModeToggle} audioEnabled={audioEnabled} onAudioToggle={onAudioToggle} />
    </div>
  )
}
