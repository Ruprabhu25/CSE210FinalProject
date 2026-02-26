import React, { useState } from 'react'
import './GameTop.css'

export default function GameTop({ currentSeason, roundNumber, health }) {
  const [showHealthTooltip, setShowHealthTooltip] = useState(false)

  const healthFill = {
    width: `${health}%`
  }
  return (
    <div className="topBar">
      <div 
        className="healthContainer"
        onMouseEnter={() => setShowHealthTooltip(true)}
        onMouseLeave={() => setShowHealthTooltip(false)}
        onClick={() => setShowHealthTooltip(!showHealthTooltip)}
      >
        <div className="healthFill" style={healthFill}/>
        <div className="healthText">Ecosystem Health: {Math.round(health)}%</div>
        {showHealthTooltip && (
          <div className="health-tooltip">
            <h4>Factors Affecting Ecosystem Health:</h4>
            <ul>
              <li>No extinctions - all species stay alive</li>
              <li>Balanced predator-prey ratios - Deviations from ideal population ratios between trophic levels hurt health</li>
            </ul>
          </div>
        )}
      </div>
      <div className="seasonBadge"> {currentSeason}</div>
    </div>
  )
}
