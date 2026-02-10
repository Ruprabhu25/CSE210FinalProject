import { useState } from 'react'
import './App.css'
import { showDisaster, DISASTER_TEXTS } from './disasterBus'

const SEASONS = ['Winter', 'Spring', 'Summer', 'Fall']

const DISASTERS = {
  Wildfire: { probabilities: { Winter: 0.02, Spring: 0.10, Summer: 0.35, Fall: 0.50 } },
  Flood: { probabilities: { Winter: 0.15, Spring: 0.30, Summer: 0.05, Fall: 0.20 } },
}

function pickDisasterForSeason(season) {
  for (const [name, cfg] of Object.entries(DISASTERS)) {
    const p = cfg.probabilities[season] ?? 0
    if (Math.random() < p) return { name, season }
  }
  return null
}

export default function DisasterManager() {
  const [year, setYear] = useState(1)
  const [seasonIndex, setSeasonIndex] = useState(0)

  function advanceSeason() {
    const nextIndex = (seasonIndex + 1) % SEASONS.length
    const nextYear = seasonIndex === SEASONS.length - 1 ? year + 1 : year
    setSeasonIndex(nextIndex)
    setYear(nextYear)

    // Check for disasters on season change and trigger popup imperatively
    const season = SEASONS[nextIndex]
    const disaster = pickDisasterForSeason(season)
    if (disaster) {
      showDisaster({
        name: disaster.name,
        message: `${disaster.name} occurred in ${season} of year ${nextYear}!`,
      })
    }
  }

  return (
    <div className="disaster-root">
      <div className="status">
        <strong>Year:</strong> {year} &nbsp; <strong>Season:</strong> {SEASONS[seasonIndex]}
      </div>

      <div className="controls">
        <button onClick={advanceSeason}>Advance Season</button>
        <button onClick={() => { setYear(1); setSeasonIndex(0); }}>Reset</button>
        <button onClick={() => {
          // Trigger a random predefined disaster via the imperative API
          const keys = Object.keys(DISASTER_TEXTS)
          const k = keys[Math.floor(Math.random() * keys.length)]
          showDisaster(k)
        }}>Trigger Random Disaster</button>
        <button onClick={() => showDisaster('forest_fire')}>Trigger Forest Fire</button>
      </div>

      <div className="current">
        <div className="no-disaster">Use "Advance Season" to trigger seasonal checks.</div>
      </div>
    </div>
  )
}
