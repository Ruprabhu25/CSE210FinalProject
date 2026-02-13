import { useState, useEffect, useRef } from 'react'
import { Species } from '../Species.jsx'
import Population from '../Population.jsx'
import GameEngine from '../GameEngine.jsx'
import './Game.css'
import GameTop from './GameTop.jsx'
import Notifications from './Notifications.jsx'
import SpeciesPanel from './SpeciesPanel.jsx'
import bgSummer from '../assets/forest-su.png'
import bgSpring from '../assets/forest-sp.png'
import bgWinter from '../assets/forest-wi.png'
import bgFall from '../assets/forest-fa.png'

export default function GameBlank() {
  // --- State ---
  // GameEngine instance (kept in a ref so it persists across rerenders)
  const gameEngineRef = useRef(null)
  // Species metadata (UI display purposes)
  const [speciesMetadata, setSpeciesMetadata] = useState([])
  const [selected, setSelected] = useState(0)
  const [growthInput, setGrowthInput] = useState('0.00')
  const [notifications, setNotifications] = useState([]) // Simple notifications
  const [gameContextState, setGameContextState] = useState(null) // Triggers rerenders when context updates

  // Initialize GameEngine with species
  useEffect(() => {
    if (gameEngineRef.current) return // Already initialized

    const engine = new GameEngine()

    // Create species metadata
    const grass = new Species('Grass', 1, 0.05)
    grass.growthRate = 0.2
    grass.trophic = 'producer'

    const rabbit = new Species('Rabbit', 4, 0.5)
    rabbit.growthRate = 0.12
    rabbit.trophic = 'primary-consumer'

    const fox = new Species('Fox', 20, 5)
    fox.growthRate = 0.06
    fox.trophic = 'secondary-consumer'

    const hawk = new Species('Hawk', 45, 6)
    hawk.growthRate = 0.03
    hawk.trophic = 'tertiary-consumer'

    const speciesArray = [grass, rabbit, fox, hawk]
    setSpeciesMetadata(speciesArray)

    // Initialize GameContext with species and populations
    engine.context.populations.clear()
    speciesArray.forEach(species => {
      let initialSize = 50
      let initialGrowthRate = species.growthRate || 0.1
      let initialMortalityRate = 0.05

      if (species.name === 'Grass') {
        initialSize = 1000
        initialMortalityRate = 0.02
      } else if (species.name === 'Rabbit') {
        initialSize = 250
        initialMortalityRate = 0.05
      } else if (species.name === 'Fox') {
        initialSize = 40
        initialMortalityRate = 0.07
      } else if (species.name === 'Hawk') {
        initialSize = 12
        initialMortalityRate = 0.08
      }

      const pop = new Population(species.speciesid, initialSize, initialGrowthRate, initialMortalityRate)
      engine.context.populations.set(species.speciesid, pop)
    })

    gameEngineRef.current = engine
    setGameContextState({ ...engine.context })
    setGrowthInput(Number(speciesArray[0].growthRate).toFixed(2))
  }, [])

  const engine = gameEngineRef.current
  const context = engine?.context
  const sel = speciesMetadata[selected]

  const icons = {
    'producer': '🌿',
    'primary-consumer': '🐇',
    'secondary-consumer': '🦊',
    'tertiary-consumer': '🦅',
  }

  // --- Sync growth input when selection changes ---
  useEffect(() => {
    if (sel) setGrowthInput(Number(sel.growthRate ?? 0).toFixed(2))
  }, [selected, speciesMetadata])

  // --- Update growth rate for selected species ---
  function updateGrowthForSelected(newRate) {
    if (!sel || !context) return
    const r = Math.round((Number(newRate) || 0) * 100) / 100
    sel.growthRate = r
    // Update the Population's baseGrowthRate in GameContext
    const pop = context.populations.get(sel.speciesid)
    if (pop) pop.baseGrowthRate = r
    setGrowthInput(Number(r).toFixed(2))
  }

  function changeGrowth(delta) {
    const current = Number(growthInput) || 0
    const next = Math.round((current + delta) * 100) / 100
    setGrowthInput(Number(next).toFixed(2))
  }

  // --- Add new species dynamically ---
  function addSpecies(species) {
    if (!context) return
    // ensure minimal properties exist on the added species
    if (species && typeof species === 'object') {
      if (typeof species.growthRate === 'undefined') species.growthRate = 0.1
      if (typeof species.trophic === 'undefined') species.trophic = 'producer'
      // attach a Population instance in GameContext
      if (!context.populations.has(species.speciesid)) {
        const pop = new Population(species.speciesid ?? Math.floor(Math.random() * 100000), 50, species.growthRate, 0.05)
        context.populations.set(species.speciesid, pop)
      }
    }
    setSpeciesMetadata(prev => [...prev, species])
    setNotifications(prev => [...prev, `New species introduced: ${species.name}!`])
  }

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
      <Notifications notifications={notifications} />
      <SpeciesPanel
        speciesArr={speciesMetadata}
        selected={selected}
        setSelected={setSelected}
        icons={icons}
        growthInput={growthInput}
        changeGrowth={changeGrowth}
        updateGrowthForSelected={updateGrowthForSelected}
        setGrowthInput={setGrowthInput}
        nextSeason={advanceRound}
        getPopulationSize={getPopulationSize}
      />
    </div>
  )
}
