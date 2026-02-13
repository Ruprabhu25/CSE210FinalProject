import React from 'react'
import './GameTop.css'

export default function GameTop({ currentSeason }) {
  return (
    <div className="topBar">
      <div className="healthContainer">
        <div className="healthFill" />
        <div className="healthText">EcoSystem Health: 70%</div>
      </div>
      <div className="seasonBadge"> {currentSeason}</div>
    </div>
  )
}
