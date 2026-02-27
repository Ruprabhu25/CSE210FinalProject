import React, { useRef } from 'react'
import './LeftPane.css'
import californiaImg from '../assets/california.png'
import forestIcon from '../assets/forest-icon.png'
import littleBirdAudio from '../assets/audio/little-bird.wav'

export default function LeftPane({ onForestClick, darkMode }) {
  const hoverAudioRef = useRef(null)

  const handleForestHover = () => {
    const audioEnabled = localStorage.getItem('biomeBuddyAudioEnabled')
    if (audioEnabled === 'false') return

    if (!hoverAudioRef.current) {
      hoverAudioRef.current = new Audio(littleBirdAudio)
    }

    hoverAudioRef.current.currentTime = 0
    hoverAudioRef.current.play()?.catch(() => {})
  }

  const handleForestHoverEnd = () => {
    if (!hoverAudioRef.current) return
    hoverAudioRef.current.pause()
    hoverAudioRef.current.currentTime = 0
  }
  return (
    <div className={`left-pane ${darkMode ? 'dark-mode' : ''}`}>
      <div className="left-inner">
        <div className="left-image-wrap">
          <img src={californiaImg} alt="California" className="left-image" />
          <button
            type="button"
            className="forest-button"
            aria-label="Choose Forest Biome"
            onClick={onForestClick}
            onMouseEnter={handleForestHover}
            onMouseLeave={handleForestHoverEnd}
          >
            <img src={forestIcon} alt="Forest icon" className="forest-icon" />
          </button>
        </div>
        <p className="left-footer">Click on a biome to get started</p>
      </div>
    </div>
  )
}
