import React from 'react'
import './LeftPane.css'
import californiaImg from '../assets/california.png'
import forestIcon from '../assets/forest-icon.png'

export default function LeftPane({ onForestClick }) {
  return (
    <div className="left-pane">
      <div className="left-inner">
        <div className="left-image-wrap">
          <img src={californiaImg} alt="California" className="left-image" />
          <button
            type="button"
            className="forest-button"
            aria-label="Choose Forest Biome"
            onClick={onForestClick}
          >
            <img src={forestIcon} alt="Forest icon" className="forest-icon" />
          </button>
        </div>
        <p className="left-footer">Click on a biome to get started</p>
      </div>
    </div>
  )
}
