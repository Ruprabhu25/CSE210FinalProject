import React, { useState, useEffect, useRef } from 'react'
import { Species } from '../Species.jsx'
import {Population} from '../Population.jsx'
import './Game.css'
import GameTop from './GameTop.jsx'
import Notifications from './Notifications.jsx'
import SpeciesPanel from './SpeciesPanel.jsx'
import GameLog from '../components/GameLog/GameLog.jsx'
import gameLogSystem from '../components/GameLog/GameLogSystem.jsx'
import GameContext from '../GameContext.jsx'
import { ProducerTrophic, PrimaryConsumerTrophic, SecondaryConsumerTrophic, TertiaryConsumerTrophic } from '../Trophic.jsx'

export default function GameBlank() {
  // --- State ---

  const gameContextRef = useRef(new GameContext())

  const populationsRef = gameContextRef.current.populations
  const speciesRef = gameContextRef.current.species

  const hasLoggedInitial = useRef(false)
  const processedSeasons = useRef(new Set())
  const lastLoggedSeason = useRef(1)

  const initialSpecies = Array.from(speciesRef.values())
  const [speciesArr, setSpeciesArr] = useState(initialSpecies)

  const [selected, setSelected] = useState(0)
  const [growthInput, setGrowthInput] = useState(Number(speciesArr[0]?.growthRate ?? 0).toFixed(2))
  const [currentSeason, setCurrentSeason] = useState(1) // Tracks the seasons
  const [notifications, setNotifications] = useState([]) // Simple notifications

  const icons = {
    'Producers': '🌿',
    'Primary Consumers': '🐇',
    'Secondary Consumers': '🦊',
    'Tertiary Consumers': '🦅',
  }

  const sel = speciesArr[selected]

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
  const pop = populationsRef.get(sel.name)
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
      // attach a Population instance for the new species in the populations map keyed by name
      if (!populationsRef.has(species.name)) {
        const pop = new Population(species.name, 50, species.growthRate, 0.05)
        populationsRef.set(species.name, pop)
        Object.defineProperty(species, 'population', { get: () => populationsRef.get(species.name).getCurrentSize() })
      }
    }
    setSpeciesArr(prev => [...prev, species])
    setNotifications(prev => [...prev, `New species introduced: ${species.name}!`])
    // Log the event
    gameLogSystem.addEntry({
      season: `Season ${currentSeason}`,
      message: `New species introduced: ${species.name}!`
    })
  }

  // --- Example: Introduce species as seasons progress ---
  useEffect(() => {
    if (currentSeason === 3 && !processedSeasons.current.has(3)) {
      processedSeasons.current.add(3)
      const newPlant = new Species('Berry Bush', 2, 0.08)
      addSpecies(newPlant)
    }
    if (currentSeason === 5 && !processedSeasons.current.has(5)) {
      processedSeasons.current.add(5)
      const newHerbivore = new Species('Deer', 10, 0.3)
      addSpecies(newHerbivore)
    }
  }, [currentSeason])

  // --- Log season changes ---
  useEffect(() => {
    if (currentSeason > 1 && lastLoggedSeason.current < currentSeason) {
      lastLoggedSeason.current = currentSeason
      gameLogSystem.addEntry({
        season: `Season ${currentSeason}`,
        message: `Season ${currentSeason} begins`
      })
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
        populations={populationsRef}
        growthInput={growthInput}
        changeGrowth={changeGrowth}
        updateGrowthForSelected={updateGrowthForSelected}
        setGrowthInput={setGrowthInput}
        nextSeason={nextSeason}
      />
      <GameLog />
    </div>
  )
}
