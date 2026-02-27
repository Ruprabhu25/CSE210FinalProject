import React from 'react'
import './GameEnd.css'
import leafIcon from '../assets/leaf-icon.png'
import pawIcon from '../assets/paw-icon.png'
export default function GameEnd({ result, health, speciesCount, extinctSpecies}) {
  if (!result) return null
  const extinct = result === "lose" && health === 0 && extinctSpecies.length > 0

  return (
    <div className="endScreen">
      {result === "win" ? (
        <div className="winScreen">
        <div className="notButton">
          <h1>The Forest Thrives!</h1>
          <h2>Your community helped keep the ecosystem healthy and balanced for 5 years.</h2>
            <div className="endStats">
            <div className="speciesBox">
                <span className="statLabel"><img src={pawIcon} alt="Species"/> Species Saved: {speciesCount}</span>
            </div>
            <div className="healthBox">
                <span className="statLabel"><img src={leafIcon} alt="Health"/> Ecosystem Health: {(health * 100).toFixed(2)}%</span>
            </div>
            </div>
        </div>
          <button onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
      ) : (
        <div className="loseScreen">
            <div className="notButton">
            <h1>The Forest Struggles...</h1>
            <h2>Ecosystems are fragile... but your actions can make a difference.</h2>
                <div className="endStats">
                <div className="speciesBox">
                    <span className="statLabel"><img src={pawIcon} alt="Species"/> Species Saved: {speciesCount - extinctSpecies.length}</span>
                </div>
                <div className="healthBox">
                    <span className="statLabel"><img src={leafIcon} alt="Health"/> Ecosystem Health: {(health * 100).toFixed(2)}%</span>
                </div>
                </div>
                {extinct && (
                <div className="extinctSection">
                    <span className="extinctLabel">
                    Species that went extinct: {extinctSpecies.join(", ")}
                    </span>
                </div>)}
            </div>
          <button onClick={() => window.location.reload()}>
            Try a new approach!
          </button>
        </div>
      )}
    </div>
  )
}