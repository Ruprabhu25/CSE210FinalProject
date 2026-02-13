import React from 'react'
import './GameTop.css'

export default function GameTop({ currentSeason, roundNumber, health }) {

  const healthFill = {
    width: `${health*100}%`
  }

  return (
    <div className="topBar">
      <div className="healthContainer">
        <div className="healthFill" style={healthFill}/>
        <div className="healthText">EcoSystem Health: {health}%</div>
      </div>
      <div className="seasonBadge"> {currentSeason}</div>
    </div>
  )
}
