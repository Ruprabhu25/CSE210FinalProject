import React, { useState } from 'react'
import './GameTop.css'
import GameTopSettingsButton from './GameTopSettingsButton'
import HomeButton from './HomeButton.jsx'

export default function GameTop({
  currentSeason,
  roundNumber,
  health,
  darkMode,
  onDarkModeToggle,
  audioEnabled,
  onAudioToggle,
  onSaveAndExit,
  onJustExit,
  isLogCollapsed
}) {
  const [showHealthTooltip, setShowHealthTooltip] = useState(false)
  const healthFill = {
    width: `${health}%`
  }
return (
  <div className={`topBar ${darkMode ? 'dark-mode' : ''} ${isLogCollapsed ? '' : 'log-open'}`}>
    <div
      className= {`healthContainer`}
      onMouseEnter={() => setShowHealthTooltip(true)}
      onMouseLeave={() => setShowHealthTooltip(false)}
      onClick={() => setShowHealthTooltip(!showHealthTooltip)}
    >
      <div className="healthFill" style={healthFill} />
      <div className="healthText">
        Ecosystem Health: {Math.round(health)}%
      </div>
      {showHealthTooltip && (
        <div className="health-tooltip">
          <h4>Factors Affecting Ecosystem Health:</h4>
          <ul>
            <li>No extinctions - all species stay alive.</li>
            <li>
              Keep Producers (🌿), Primary Consumers (🐇),
              Secondary Consumers (🦊), and Tertiary Consumers (🦅)
              in proportion to stay healthy.
            </li>
          </ul>
        </div>
      )}
    </div>

    <div className="seasonBadge">{currentSeason}</div>
    
    <div className="top-controls">
    <HomeButton
      onSaveAndExit={onSaveAndExit}
      onJustExit={onJustExit}
      darkMode={darkMode}
    />
    <GameTopSettingsButton
      darkMode={darkMode}
      onDarkModeToggle={onDarkModeToggle}
      audioEnabled={audioEnabled}
      onAudioToggle={onAudioToggle}
    />
  </div>
  </div>
)
}
