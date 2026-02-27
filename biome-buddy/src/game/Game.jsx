import { useState, useEffect, useRef } from 'react'
import React from 'react'
import GameEngine from '../GameEngine.jsx'
import './Game.css'
import GameTop from './GameTop.jsx'
import GameEnd from './GameEnd.jsx'
import SpeciesPanel from './SpeciesPanel.jsx'
import HomeButton from './HomeButton.jsx'
import GameLog from '../components/GameLog/GameLog.jsx'
import gameLogSystem from '../components/GameLog/GameLogSystem.jsx'
import DisasterPopup from '../components/DisasterPopup/DisasterPopup.jsx'
import InstructionsPopup from '../components/InstructionsPopup/InstructionsPopup.jsx'
import bgSummer from '../assets/forest-su.png'
import bgSpring from '../assets/forest-sp.png'
import bgWinter from '../assets/forest-wi.png'
import bgFall from '../assets/forest-fa.png'
import backgroundMusic from '../assets/audio/spring.mp3'

export const MAX_YEARS = 5
export const WIN_THRESHOLD = 0.85
export const NUM_SEASONS = 4

export default function GameBlank() {
  // --- State ---
  // GameEngine instance (kept in a ref so it persists across rerenders)
  const gameEngineRef = useRef(null)
  const hasLoggedInitial = useRef(false)
  const lastLoggedSeason = useRef(null)
  const backgroundMusicRef = useRef(null)

  // Species metadata (UI display purposes)
  const [speciesMetadata, setSpeciesMetadata] = useState([])
  const [selected, setSelected] = useState(null)
  const [gameContextState, setGameContextState] = useState(null) // Triggers rerenders when context updates
  const [gameResult, setGameResult] = useState(null) // "win" | "lose"
  const [showInstructions, setShowInstructions] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('biomeBuddyDarkMode')
    return saved !== null ? saved === 'true' : false
  })
  const [audioEnabled, setAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('biomeBuddyAudioEnabled')
    return saved !== null ? saved === 'true' : true
  })

  // Save dark mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('biomeBuddyDarkMode', String(darkMode))
  }, [darkMode])

  // Save audio setting to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('biomeBuddyAudioEnabled', String(audioEnabled))
  }, [audioEnabled])

  // Setup background music
  useEffect(() => {
    if (audioEnabled === false) {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
        backgroundMusicRef.current.currentTime = 0
      }
      return
    }

    if (!backgroundMusicRef.current) {
      backgroundMusicRef.current = new Audio(backgroundMusic)
      backgroundMusicRef.current.loop = true
      backgroundMusicRef.current.volume = 0.3
    }

    backgroundMusicRef.current.play()?.catch(() => {})

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
        backgroundMusicRef.current.currentTime = 0
      }
    }
  }, [audioEnabled])

  // Initialize GameEngine with species
  useEffect(() => {
    if (gameEngineRef.current) return // Already initialized

    const engine = new GameEngine()

    // Check for saved game state
    const savedState = localStorage.getItem('biomeBuddySaveData')
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      // Restore game state
      engine.context.roundNumber = parsedState.roundNumber || 0
      engine.context.year = parsedState.year || 1
      
      // Restore populations
      if (parsedState.populations) {
        for (const [name, popData] of Object.entries(parsedState.populations)) {
          const pop = engine.context.populations.get(name)
          if (pop && popData.size !== undefined) {
            pop.size = popData.size
          }
        }
      }

      // Restore game log if saved
      if (parsedState.gameLog && Array.isArray(parsedState.gameLog)) {
        parsedState.gameLog.forEach(entry => gameLogSystem.addEntry(entry))
      }
    }

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

  function checkGameEnd() {
    if (!engine) return
    const currentRound = engine.context.roundNumber
    const ecosystemHealth = engine.context.calculateEcosystemHealth()
    if (ecosystemHealth <= 0) {
      return "lose"
    }
    // each season has 3 rounds and there are 4 seasons
    if (currentRound < MAX_YEARS * NUM_SEASONS * engine.context.numRoundsInSeason) // 5 years x 4 seasons x 3 rounds
      return null

    if (ecosystemHealth >= WIN_THRESHOLD) {
      return "win"
    }
    else {
      return "lose"
    }
  }

  // --- Advance round (triggers game simulation) ---
  function advanceRound() {
    handlePlayerAction(null) // just run round without any selected species
  }

  // --- Player action: set chosen species and run a round ---
  function handlePlayerAction(selectedSpeciesName = null) {
    if (!engine) return
    if (gameResult) return
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
    const hadDisasterBeforeRound = !!engine.context.currentDisaster
    const seasonBeforeRound = engine.context.determineSeason()
    engine.runRound()
    setGameContextState({ ...engine.context })
    const result = checkGameEnd()
    if (result) {
      setGameResult(result)
    }
    const seasonAfterRound = engine.context.determineSeason()

    if (seasonBeforeRound !== seasonAfterRound) {
      gameLogSystem.addEntry({
        season: seasonAfterRound,
        message: `Season changed to ${seasonAfterRound}`
      })
    }
    if (!hadDisasterBeforeRound && engine.context.currentDisaster) {
      gameLogSystem.addEntry({
        season: seasonAfterRound,
        name: engine.context.currentDisaster.title,
        message: `${engine.context.currentDisaster.title}: ${engine.context.currentDisaster.description}`,
      })
    }

    if (selectedSpeciesName) {
      gameLogSystem.addEntry({
        season: seasonAfterRound,
        message: `${selectedSpeciesName} population is growing faster than usual`
      })
    } else {
      gameLogSystem.addEntry({
        season: seasonAfterRound,
        message: 'Life goes on as usual in the forest'
      })
    }

    lastLoggedSeason.current = seasonAfterRound
  }

  function handleDisasterAction(action) {
    if (!engine) return
    if (gameResult) return
    const seasonBeforeRound = engine.context.determineSeason()
    engine.context.pendingDisasterAction = action || null
    engine.runRound()
    setGameContextState({ ...engine.context })
    const result = checkGameEnd()
    if (result) {
      setGameResult(result)
    }
    const seasonAfterRound = engine.context.determineSeason()

    if (seasonBeforeRound !== seasonAfterRound) {
      gameLogSystem.addEntry({
        season: seasonAfterRound,
        message: `Season changed to ${seasonAfterRound}`
      })
    }

    if (action) {
      gameLogSystem.addEntry({
        season: seasonAfterRound,
        message: `Action chosen: ${action.label} (${action.deltaPopulation >= 0 ? '+' : ''}${action.deltaPopulation || 0} ${action.target})`,
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

  const extinctSpecies = Array.from(context.populations.entries())
  .filter(([_, pop]) => pop.getCurrentSize() === 0)
  .map(([speciesName]) => speciesName)

  
  const handleHomeClick = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/')
      window.location.reload()
    }
  }

  const handleSaveAndExit = () => {
    // Serialize game state
    const gameState = {
      roundNumber: context.roundNumber,
      year: context.year,
      populations: {},
      gameLog: gameLogSystem.getEntries(),
      savedAt: new Date().toISOString()
    }

    // Save population data
    context.populations.forEach((pop, name) => {
      gameState.populations[name] = {
        size: pop.getCurrentSize(),
        name: name
      }
    })

    // Save to localStorage
    localStorage.setItem('biomeBuddySaveData', JSON.stringify(gameState))
    console.log('Game progress saved successfully!')
    
    handleHomeClick()
  }

  const handleJustExit = () => {
    // Clear saved game when just exiting
    localStorage.removeItem('biomeBuddySaveData')
    handleHomeClick()
  }

  const handleAudioToggle = () => {
    setAudioEnabled((prev) => !prev)
  }

  return (
  <>
  <div className='rootStyle' style={rootStyleInline} onClick={() => setSelected(null)}>
      <HomeButton onSaveAndExit={handleSaveAndExit} onJustExit={handleJustExit} darkMode={darkMode} />
      <GameTop currentSeason={context.determineSeason()} roundNumber={context.roundNumber} health={context.calculateEcosystemHealth() * 100} darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)} audioEnabled={audioEnabled} onAudioToggle={handleAudioToggle} />
      <SpeciesPanel
        speciesArr={speciesMetadata}
        selected={selected}
        setSelected={setSelected}
        icons={icons}
        nextSeason={advanceRound}
        onPlayerAction={handlePlayerAction}
        getPopulationSize={getPopulationSize}
        darkMode={darkMode}
      />
      <GameLog darkMode={darkMode} />
      <DisasterPopup disaster={context?.currentDisaster || null} onAction={handleDisasterAction} darkMode={darkMode} />
      {showInstructions && <InstructionsPopup onClose={() => setShowInstructions(false)} darkMode={darkMode} />}
      
      </div>
      <GameEnd
        result={gameResult}
        health={context.calculateEcosystemHealth()}
        speciesCount={context.species.size}
        extinctSpecies={extinctSpecies}
      />
    </>
  )
}
