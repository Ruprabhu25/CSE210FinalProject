import { useState, useEffect, useRef } from 'react'
import React from 'react'
import GameEngine from '../GameEngine.jsx'
import './Game.css'
import GameTop from './GameTop.jsx'
import SpeciesPanel from './SpeciesPanel.jsx'
import GameLog from '../components/GameLog/GameLog.jsx'
import gameLogSystem from '../components/GameLog/GameLogSystem.jsx'
import bgSummer from '../assets/forest-su.png'
import bgSpring from '../assets/forest-sp.png'
import bgWinter from '../assets/forest-wi.png'
import bgFall from '../assets/forest-fa.png'


export default function GameBlank() {
  // --- State ---
  // GameEngine instance (kept in a ref so it persists across rerenders)
  const gameEngineRef = useRef(null)
  const hasLoggedInitial = useRef(false)
  const lastLoggedSeason = useRef(null)

  // Species metadata (UI display purposes)
  const [speciesMetadata, setSpeciesMetadata] = useState([])
  const [selected, setSelected] = useState(null)
  const [gameContextState, setGameContextState] = useState(null) // Triggers rerenders when context updates

  // Initialize GameEngine with species
  useEffect(() => {
    if (gameEngineRef.current) return // Already initialized

    const engine = new GameEngine()

    // Get species from GameContext (already created in Trophic.jsx)
    const speciesArray = Array.from(engine.context.species.values())
    setSpeciesMetadata(speciesArray)

    // Re-key populations by speciesid for consistency with Game.jsx
    const populationsBySpeciesId = new Map()
    for (const species of speciesArray) {
      const pop = engine.context.populations.get(species.name)
      if (pop) {
        // also keep lookup by species name so systems that expect name-keyed maps still work
        populationsBySpeciesId.set(species.name, pop)
      }
    }
    engine.context.populations = populationsBySpeciesId

    gameEngineRef.current = engine
    setGameContextState({ ...engine.context })
  }, [])

  const engine = gameEngineRef.current
  const context = engine?.context

  const icons = {
    'Producers': '🌿',
    'Primary Consumers': '🐇',
    'Secondary Consumers': '🦊',
    'Tertiary Consumers': '🦅',
  }

  // --- Log initial game start ---
  useEffect(() => {
    if (!hasLoggedInitial.current) {
      hasLoggedInitial.current = true
      // Avoid duplicate startup entries (can happen in Strict Mode / hot reload)
      const already = gameLogSystem.getEntries().some(e => e.message === 'Game started - Welcome to Biome Buddy!')
      if (!already) {
        gameLogSystem.addEntry({
          season: 'Year 1',
          message: 'Game started - Welcome to Biome Buddy!'
        })
      }
    }
  }, [])



  // --- Advance round (triggers game simulation) ---
  function advanceRound() {
    handlePlayerAction(null) // just run round without any selected species
  }

  // --- Player action: set chosen species and run a round ---
  function handlePlayerAction(selectedSpeciesName = null) {
    if (!engine) return
    const playerSystem = engine.systems.find(s => s.name === 'PlayerActionSystem')
    if (!playerSystem) {
      console.warn('PlayerActionSystem not found')
      return
    }
    if (selectedSpeciesName) {
      playerSystem.chosenSpeciesName = selectedSpeciesName
    } 
    else { 
      playerSystem.chosenSpeciesName = ""
    }
    const seasonBeforeRound = engine.context.determineSeason()
    engine.runRound()
    setGameContextState({ ...engine.context })
    const seasonAfterRound = engine.context.determineSeason()
    if (selectedSpeciesName) {
      gameLogSystem.addEntry({
        season: seasonBeforeRound,
        message: `${selectedSpeciesName} population is growing faster than usual`
      })
    } 
    else {
      gameLogSystem.addEntry({
        season: seasonBeforeRound,
        message: 'Life goes on as usual in the forest'
      })
    }
    if (seasonBeforeRound !== seasonAfterRound) {
      gameLogSystem.addEntry({
        season: seasonAfterRound,
        message: `Season changed to ${seasonAfterRound}`
      })
    }
    lastLoggedSeason.current = seasonAfterRound
  }


  if (!engine || !context) {
    return <div>Loading game...</div>
  }

  // Helper to get current population size
  const getPopulationSize = (speciesId) => {
    const pop = context.populations.get(speciesId)
    return pop ? pop.getCurrentSize() : 0
  }

  // Choose background image based on current season
  const currentSeasonName = context.determineSeason()
  const seasonBackgroundMap = {
    'Summer': bgSummer,
    'Spring': bgSpring,
    'Winter': bgWinter,
    'Fall': bgFall,
  }
  const backgroundImage = seasonBackgroundMap[currentSeasonName] || bgSummer
  const rootStyleInline = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  

  return (
    <div className='rootStyle' style={rootStyleInline} onClick={() => setSelected(null)}>
      <GameTop currentSeason={context.determineSeason()} roundNumber={context.roundNumber} health = {context.calculateEcosystemHealth()*100}/>
      <SpeciesPanel
        speciesArr={speciesMetadata}
        selected={selected}
        setSelected={setSelected}
        icons={icons}
        nextSeason={advanceRound}
        onPlayerAction={handlePlayerAction}
        getPopulationSize={getPopulationSize}
      />
      <GameLog />
    </div>
  )
}
