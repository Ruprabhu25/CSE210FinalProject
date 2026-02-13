import { useState, useEffect, useRef } from 'react'
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

//TODO: Connect next season button to PlayerActionSystem once that is merged into master branch

export default function GameBlank() {
  // --- State ---
  // GameEngine instance (kept in a ref so it persists across rerenders)
  const gameEngineRef = useRef(null)
  const hasLoggedInitial = useRef(false)
  const populationsRef = useRef(new Map())
  // Species metadata (UI display purposes)
  const [speciesMetadata, setSpeciesMetadata] = useState([])
  const [selected, setSelected] = useState(0)
  const [notifications, setNotifications] = useState([]) // Simple notifications
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
        populationsBySpeciesId.set(species.speciesid, pop)
      }
    }
    engine.context.populations = populationsBySpeciesId

    gameEngineRef.current = engine
    setGameContextState({ ...engine.context })
  }, [])

  const engine = gameEngineRef.current
  const context = engine?.context
  const sel = speciesMetadata[selected]

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
      gameLogSystem.addEntry({
        season: 'Season 1',
        message: 'Game started - Welcome to Biome Buddy!'
      })
    }
  }, [])



  // --- Advance round (triggers game simulation) ---
  function advanceRound() {
    if (!engine) return
    console.log('Before round:', {
      round: engine.context.roundNumber,
      grassPop: getPopulationSize(speciesMetadata[0]?.speciesid),
    })
    engine.runRound()
    console.log('After round:', {
      round: engine.context.roundNumber,
      grassPop: getPopulationSize(speciesMetadata[0]?.speciesid),
    })
    setGameContextState({ ...engine.context })
    // Clear notifications after round completes
    setNotifications([])
  }

  // --- Player action: set chosen species and run a round ---
  function handlePlayerAction(speciesName) {
    if (!engine) return
    const playerSystem = engine.systems.find(s => s.name === 'PlayerActionSystem')
    if (!playerSystem) {
      console.warn('PlayerActionSystem not found')
      return
    }
    // Directly set the chosenSpeciesName property
    playerSystem.chosenSpeciesName = speciesName
    engine.runRound()
    setGameContextState({ ...engine.context })
    setNotifications([])
  }

  // --- Example: Introduce species as seasons progress ---
  useEffect(() => {
    if (!context) return
    const currentSeason = context.determineSeason()
    // Add logic here if needed based on season changes
  }, [gameContextState])

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
      <GameTop currentSeason={context.determineSeason()} roundNumber={context.roundNumber} />
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
