import { useState, useEffect } from 'react'
import { Producer, PrimaryConsumer, SecondaryConsumer, TertiaryConsumer } from './lib/species'
import { disasters } from './data/disasters' // disaster data (labels only; no effects)
import DisasterPopup from './components/DisasterPopup/DisasterPopup' // popup UI
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
  const [growthInput, setGrowthInput] = useState(Number(speciesArr[0].growthRate).toFixed(2))
  const [currentSeason, setCurrentSeason] = useState(1) // Tracks the seasons
  const [notifications, setNotifications] = useState([]) // Simple notifications
  const [activeDisaster, setActiveDisaster] = useState(null) // tracks a popup to show (no game effect)

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
    // 25% chance to display a random disaster popup (no state changes)
    if (Math.random() < 0.25) {
      const pool = Object.values(disasters)
      const picked = pool[Math.floor(Math.random() * pool.length)]
      setActiveDisaster(picked)
    }
    setCurrentSeason(prev => prev + 1)
  }

  return (
    <div className='rootStyle' onClick={() => setSelected(null)}>
      {/* Top HUD */}
      <div className="topBar">
        {/* Temp: This healthbar section will be replaced with component */}
        <div className="healthContainer">
          <div className="healthFill" />
          <div className="healthText">EcoSystem Health: 70%</div>
        </div>
        <div className="seasonBadge">Season {currentSeason}</div>
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
      <div className='outerPanelStyle'>
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

      {/* Disaster popup UI only (no numeric effects) */}
      <DisasterPopup
        disaster={activeDisaster}
        onClose={() => setActiveDisaster(null)}
      />
    </div>
  )
}
