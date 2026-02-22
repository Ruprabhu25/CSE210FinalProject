import React from 'react'
import './RightPane.css'

export default function RightPane() {
  return (
    <div className="right-pane">
      <button className="settings-button">
        <img src="src/assets/setting-button.png" alt="Settings" />
      </button>
      <div className="right-inner">
        <div className="welcome-text">Welcome to</div>
        <h1 className="title">Biome Buddy</h1>
        <div className="right-description">
          <p>Step into the role of a community working to restore an ecosystem.</p>
          <p>Over the course of the seasons and years, your choices will directly affect the food chain and ecosystem balance.</p>
          <p>Learn how small actions can lead to big changes as you work to protect biodiversity.</p>
        </div>
      </div>
    </div>
  )
}
