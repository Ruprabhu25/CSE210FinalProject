import React from 'react'
import './GameTop.css'
import GameTopSettingsButton from './GameTopSettingsButton'

export default function GameTop({ currentSeason, roundNumber, health, darkMode, onDarkModeToggle }) {

  const healthFill = {
    width: `${health}%`
  }
  return (
    <div className="topBar">
      <div className="healthContainer">
        <div className="healthFill" style={healthFill}/>
        <div className="healthText">Ecosystem Health: {Math.round(health)}%</div>
      </div>
      <div className="seasonBadge"> {currentSeason}</div>
      <GameTopSettingsButton darkMode={darkMode} onDarkModeToggle={onDarkModeToggle} />
    </div>
  )
}
