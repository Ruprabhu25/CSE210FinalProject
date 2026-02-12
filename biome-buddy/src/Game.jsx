import React, { useState, useEffect } from 'react'
import { Producer, PrimaryConsumer, SecondaryConsumer, TertiaryConsumer } from './lib/species'
import GameLog from './components/GameLog/GameLog'
import DisasterPopup from './components/DisasterPopup/DisasterPopup'
import gameLogSystem from './systems/GameLogSystem'
import { disasters } from './data/disasters'
import { calculateEcosystemBalance } from './ecosystemBalance'
import './Game.css'

export default function GameBlank() {
  // --- State ---
  const [speciesArr, setSpeciesArr] = useState([
    new Producer('Grass', 1, 0.05, 1000, 0.12),
    new PrimaryConsumer('Rabbit', 4, 0.5, 200, 0.08),
    new SecondaryConsumer('Fox', 20, 5, 20, 0.02),
    new TertiaryConsumer('Hawk', 45, 6, 5, 0.01),
  ])
  const [selected, setSelected] = useState(0)
  const initialGrowthRate = Number(0.12).toFixed(2)
  const [growthInput, setGrowthInput] = useState(initialGrowthRate)
  const [currentSeason, setCurrentSeason] = useState(1) // Tracks the seasons
  const [notifications, setNotifications] = useState([]) // Simple notifications
  const [gameLogCollapsed, setGameLogCollapsed] = useState(false) // Track GameLog collapse state
  const [currentDisaster, setCurrentDisaster] = useState(null) // Track current disaster for popup
  const [ecosystemHealth, setEcosystemHealth] = useState(0.7) // normalized [0..1]

  const icons = {
    'producer': '🌿',
    'primary-consumer': '🐇',
    'secondary-consumer': '🦊',
    'tertiary-consumer': '🦅',
  }

  const sel = speciesArr[selected]

  // --- Sync growth input when selection changes ---
  useEffect(() => {
    if (sel) setGrowthInput(Number(sel.growthRate).toFixed(2))
  }, [selected, speciesArr])

  // --- Update growth rate for selected species ---
  function updateGrowthForSelected(newRate) {
    if (!sel) return
    const r = Math.round((Number(newRate) || 0) * 100) / 100
    sel.setGrowthRate(r)
    setSpeciesArr((prev) => [...prev])
    setGrowthInput(Number(r).toFixed(2))
  }

  function changeGrowth(delta) {
    const current = Number(growthInput) || 0
    const next = Math.round((current + delta) * 100) / 100
    setGrowthInput(Number(next).toFixed(2))
  }

  // --- Add new species dynamically ---
  function addSpecies(species) {
    setSpeciesArr(prev => [...prev, species])
    setNotifications(prev => [...prev, `New species introduced: ${species.name}!`])
  }

  // --- Example: Introduce species as seasons progress ---
  useEffect(() => {
    if (currentSeason === 3) {
      const newPlant = new Producer('Berry Bush', 2, 0.08, 500, 0.1)
      addSpecies(newPlant)
    }
    if (currentSeason === 5) {
      const newHerbivore = new PrimaryConsumer('Deer', 10, 0.3, 50, 0.05)
      addSpecies(newHerbivore)
    }
  }, [currentSeason])

  // --- Advance season for testing  ---
  function nextSeason() {
    const newSeason = currentSeason + 1

    // Add event to game log
    gameLogSystem.addEntry({
      season: `Season ${newSeason}`,
      message: 'Advanced to next season',
    })

    // 40% chance to generate a random disaster
    if (Math.random() < 0.4) {
      const disasterKeys = Object.keys(disasters)
      const randomKey = disasterKeys[Math.floor(Math.random() * disasterKeys.length)]
      const disaster = disasters[randomKey]
      setCurrentDisaster(disaster)

      // Add disaster event to log
      gameLogSystem.addEntry({
        season: `Season ${newSeason}`,
        name: disaster.title,
        message: `${disaster.title}: ${disaster.description}`,
      })

      // compute new ecosystem balance from current species (map species to expected trophic keys)
      try {
        const speciesByTrophicLevel = {
          producer: [],
          herbivore: [],
          primaryCarnivore: [],
          secondaryCarnivore: [],
        }

        speciesArr.forEach((s) => {
          const population = s.population ?? (s._population && s._population.getCurrentSize ? s._population.getCurrentSize() : 1)
          const biomassPerIndividual = s.biomass ?? s.biomassPerIndividual ?? 1
          const energyPerIndividual = s.energy ?? s.energyPerIndividual ?? 1

          const item = { name: s.name, population, biomassPerIndividual, energyPerIndividual }

          // map trophic keys from species.trophic
          if (s.trophic === 'producer') speciesByTrophicLevel.producer.push(item)
          else if (s.trophic === 'primary-consumer') speciesByTrophicLevel.herbivore.push(item)
          else if (s.trophic === 'secondary-consumer') speciesByTrophicLevel.primaryCarnivore.push(item)
          else if (s.trophic === 'tertiary-consumer') speciesByTrophicLevel.secondaryCarnivore.push(item)
        })

        const balance = calculateEcosystemBalance(speciesByTrophicLevel)
        // If balance calculation yields a valid positive value, use it; otherwise fallback to reducing current health
        if (typeof balance === 'number' && balance > 0) {
          // reduce health by 20% (absolute 0.2) for now when disaster happens
          const newHealth = Math.max(0, balance - 0.2)
          setEcosystemHealth(newHealth)

          // log the new health
          gameLogSystem.addEntry({
            season: `Season ${newSeason}`,
            message: `Ecosystem health now ${Math.round(newHealth * 100)}%`,
          })
        } else {
          // fallback: decrement current health by 20 percentage points
          setEcosystemHealth((h) => {
            const nh = Math.max(0, h - 0.2)
            gameLogSystem.addEntry({
              season: `Season ${newSeason}`,
              message: `Ecosystem health now ${Math.round(nh * 100)}%`,
            })
            return nh
          })
        }
      } catch (e) {
        // fallback: reduce by 0.2 from current (clamped at 0)
        setEcosystemHealth((h) => {
          const nh = Math.max(0, h - 0.2)
          gameLogSystem.addEntry({
            season: `Season ${newSeason}`,
            message: `Ecosystem health now ${Math.round(nh * 100)}%`,
          })
          return nh
        })
      }
    }

    setCurrentSeason(newSeason)
  }

  return (
    <div className='rootStyle' onClick={() => setSelected(null)}>
      {/* Top HUD */}
      <div className="topBar">
        {/* Temp: This healthbar section will be replaced with component */}
        <div className="healthContainer">
          <div className="healthFill" style={{ width: `${Math.round(ecosystemHealth * 100)}%` }} />
          <div className="healthText">EcoSystem Health: {Math.round(ecosystemHealth * 100)}%</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
          <div className="seasonBadge">Season {currentSeason}</div>
          <div style={{ width: 260 }}>
            <GameLog onCollapsedChange={setGameLogCollapsed} />
          </div>
        </div>
      </div>

      {/* Notifications (Temp will be replaced with pop up)*/}
      <div className="notificationContainer" style={{ position: 'absolute', top: 80, right: 20 }}>
        {notifications.map((note, i) => (
          <div key={i} className="notification" style={{ background: '#fff9c4', padding: 8, marginBottom: 6, borderRadius: 6, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            {note}
          </div>
        ))}
      </div>

      {/* Bottom species panel */}
      <div
        className='outerPanelStyle'
        style={{
          width: gameLogCollapsed ? 'calc(100% - 2rem)' : 'calc(100% - 280px - 2rem)'
        }}
      >
        <div className='innerPanelStyle' aria-label="Species panel">
          <div className="speciesTitle">Active Species</div>
          <div className='selectorStyle' role="listbox" aria-label="Species selector">
            {speciesArr.map((s, i) => (
              <div
                key={s.name}
                className={`itemStyle ${selected === i ? 'selected' : ''}`}
                onClick={(e) => { e.stopPropagation(); setSelected(i) }}
              >
                <div className="iconStyle">{icons[s.trophic] || '🐾'}</div>
                <div>
                  <div className="speciesName">{s.name}</div>
                  <div className="speciesPop">{Math.round(s.population)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={{ height: 8 }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#444', minWidth: 90 }}>Growth rate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => changeGrowth(-0.05)} className='growthButtons'>-</button>
              <input
                type="text"
                value={growthInput}
                onChange={(e) => setGrowthInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') updateGrowthForSelected(parseFloat(growthInput) || 0) }}
                style={{ width: 84, padding: '6px 8px', borderRadius: 8, border: '1px solid #ccc' }}
              />
              <button onClick={() => changeGrowth(0.05)} style={{ padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>+</button>
              <button onClick={() => updateGrowthForSelected(parseFloat(growthInput) || 0)} className='growthButtons'>Enter</button>

              {/* Temp button for testing adding species based off some season*/}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 16 }}>
                <button onClick={nextSeason} className='growthButtons'>Next Season</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Disaster Popup */}
      <DisasterPopup
        disaster={currentDisaster}
        onClose={() => setCurrentDisaster(null)}
      />
    </div>
  )
}
