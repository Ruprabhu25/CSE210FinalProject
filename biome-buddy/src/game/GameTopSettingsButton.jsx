import React from 'react'
import './GameTopSettingsButton.css'

export default function GameTopSettingsButton() {
  return (
    <button className="game-settings-button" aria-label="Settings">
      <img src="src/assets/setting-button.png" alt="Settings" />
    </button>
  )
}
