import { useState, useEffect, useRef } from 'react'
import { Species } from '../Species.jsx'
import Population from '../Population.jsx'
import './Game.css'
import GameTop from './GameTop.jsx'
import Notifications from './Notifications.jsx'
import SpeciesPanel from './SpeciesPanel.jsx'

export default function GameBlank() {
  // --- State ---
  // Map of speciesId -> Population instance (kept in a ref so updates don't force rerenders)
  const populationsRef = useRef(new Map())

  // create species instances and register populations in the map
  const initialSpecies = (() => {
    const grass = new Species('Grass', 1, 0.05)
    grass.growthRate = 0.2
    grass.trophic = 'producer'

    const grassPop = new Population(grass.speciesid, 1000, grass.growthRate, 0.02)
    populationsRef.current.set(grass.speciesid, grassPop)
    Object.defineProperty(grass, 'population', { get: () => populationsRef.current.get(grass.speciesid).getCurrentSize() })

    const rabbit = new Species('Rabbit', 4, 0.5)
    rabbit.growthRate = 0.12
    rabbit.trophic = 'primary-consumer'
    const rabbitPop = new Population(rabbit.speciesid, 250, rabbit.growthRate, 0.05)
    populationsRef.current.set(rabbit.speciesid, rabbitPop)
    Object.defineProperty(rabbit, 'population', { get: () => populationsRef.current.get(rabbit.speciesid).getCurrentSize() })

    const fox = new Species('Fox', 20, 5)
    fox.growthRate = 0.06
    fox.trophic = 'secondary-consumer'
    const foxPop = new Population(fox.speciesid, 40, fox.growthRate, 0.07)
    populationsRef.current.set(fox.speciesid, foxPop)
    Object.defineProperty(fox, 'population', { get: () => populationsRef.current.get(fox.speciesid).getCurrentSize() })

    const hawk = new Species('Hawk', 45, 6)
    hawk.growthRate = 0.03
    hawk.trophic = 'tertiary-consumer'
    const hawkPop = new Population(hawk.speciesid, 12, hawk.growthRate, 0.08)
    populationsRef.current.set(hawk.speciesid, hawkPop)
    Object.defineProperty(hawk, 'population', { get: () => populationsRef.current.get(hawk.speciesid).getCurrentSize() })

    return [grass, rabbit, fox, hawk]
  })()

  const [speciesArr, setSpeciesArr] = useState(initialSpecies)
  const [selected, setSelected] = useState(0)
  const [growthInput, setGrowthInput] = useState(Number(speciesArr[0]?.growthRate ?? 0).toFixed(2))
  const [currentSeason, setCurrentSeason] = useState(1) // Tracks the seasons
  const [notifications, setNotifications] = useState([]) // Simple notifications

  const icons = {
    'producer': '🌿',
    'primary-consumer': '🐇',
    'secondary-consumer': '🦊',
    'tertiary-consumer': '🦅',
  }

  const sel = speciesArr[selected]

  // --- Sync growth input when selection changes ---
  useEffect(() => {
    if (sel) setGrowthInput(Number(sel.growthRate ?? 0).toFixed(2))
  }, [selected, speciesArr])

  // --- Update growth rate for selected species ---
  function updateGrowthForSelected(newRate) {
    if (!sel) return
    const r = Math.round((Number(newRate) || 0) * 100) / 100
    // Species no longer exposes setGrowthRate — keep growthRate on the instance
    sel.growthRate = r
    // also update the registered Population's baseGrowthRate so population updates follow the new rate
    const pop = populationsRef.current.get(sel.speciesid)
    if (pop) pop.baseGrowthRate = r
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
    // ensure minimal properties exist on the added species
    if (species && typeof species === 'object') {
      if (typeof species.growthRate === 'undefined') species.growthRate = 0.1
      if (typeof species.trophic === 'undefined') species.trophic = 'producer'
      // attach a Population instance for the new species in the populations map
      if (!populationsRef.current.has(species.speciesid)) {
        const pop = new Population(species.speciesid ?? Math.floor(Math.random() * 100000), 50, species.growthRate, 0.05)
        populationsRef.current.set(species.speciesid, pop)
        Object.defineProperty(species, 'population', { get: () => populationsRef.current.get(species.speciesid).getCurrentSize() })
      }
    }
    setSpeciesArr(prev => [...prev, species])
    setNotifications(prev => [...prev, `New species introduced: ${species.name}!`])
  }

  // --- Example: Introduce species as seasons progress ---
  useEffect(() => {
    if (currentSeason === 3) {
      const newPlant = new Species('Berry Bush', 2, 0.08)
      addSpecies(newPlant)
    }
    if (currentSeason === 5) {
      const newHerbivore = new Species('Deer', 10, 0.3)
      addSpecies(newHerbivore)
    }
  }, [currentSeason])

  // --- Advance season for testing  ---
  function nextSeason() {
    setCurrentSeason(prev => prev + 1)
  }

  return (
    <div className='rootStyle' onClick={() => setSelected(null)}>
      <GameTop currentSeason={currentSeason} />
      <Notifications notifications={notifications} />
      <SpeciesPanel
        speciesArr={speciesArr}
        selected={selected}
        setSelected={setSelected}
        icons={icons}
        growthInput={growthInput}
        changeGrowth={changeGrowth}
        updateGrowthForSelected={updateGrowthForSelected}
        setGrowthInput={setGrowthInput}
        nextSeason={nextSeason}
      />
    </div>
  )
}
