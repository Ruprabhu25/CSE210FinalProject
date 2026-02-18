import System from "./System"
import { disasters } from "../data/disasters"
import gameLogSystem from "../components/GameLog/GameLogSystem"

// Applies a chosen disaster action to the targeted species population.
// Returns true when a population value was updated.
function applyDisasterActionToSpecies(speciesArr, action, populations) {
    if (!action || !Array.isArray(speciesArr)) return false

    const targetSpecies = speciesArr.find((s) => s.name === action.target)
    if (!targetSpecies) return false

    // Legacy shape used in older game flow.
    if (targetSpecies._population && typeof targetSpecies._population.getCurrentSize === "function") {
        const currentPop = targetSpecies._population.getCurrentSize()
        const nextPop = Math.max(0, Math.round(currentPop + (action.deltaPopulation || 0)))
        targetSpecies._population.size = nextPop
        return true
    }

    // Current master shape uses a populations map keyed by species name.
    const pop = populations?.get?.(targetSpecies.name)
    if (pop && typeof pop.getCurrentSize === "function") {
        const currentPop = pop.getCurrentSize()
        const nextPop = Math.max(0, Math.round(currentPop + (action.deltaPopulation || 0)))
        pop.size = nextPop
        return true
    }

    return false
}

class DisasterSystem extends System {
    constructor() {
        super("DisasterSystem")
        this.lastDisasterRound = 0
        // define rough impact fractions per trophic level for each disaster type
        this.impactMap = {
            wildfire: { producer: 0.5, herbivore: 0.2, primaryCarnivore: 0.1, secondaryCarnivore: 0.05 },
            drought: { producer: 0.45, herbivore: 0.25, primaryCarnivore: 0.1, secondaryCarnivore: 0.05 },
            flood: { producer: 0.4, herbivore: 0.3, primaryCarnivore: 0.15, secondaryCarnivore: 0.05 },
            landslide: { producer: 0.35, herbivore: 0.2, primaryCarnivore: 0.1, secondaryCarnivore: 0.05 },
            invasive: { producer: 0.15, herbivore: 0.35, primaryCarnivore: 0.2, secondaryCarnivore: 0.1 }
        }
        // how many rounds equal one year (4 seasons)
        this.roundsPerYear = 0
    }

    // compatibility with current tests (change in future PR)
    applyPlayerDisasterAction(speciesArr, action, populations) {
        return applyDisasterActionToSpecies(speciesArr, action, populations)
    }

    apply(context) {
        // UI popup disasters are selected here so Game.jsx only reads from engine context.
        // When popup mode is enabled, skip legacy yearly disaster logic to avoid duplicate logs/effects.
        if (context.enablePopupDisasters) {
            if (context.currentDisaster) {
                const selectedAction = context.pendingDisasterAction
                if (selectedAction) {
                    applyDisasterActionToSpecies(
                        Array.from(context.species.values()),
                        selectedAction,
                        context.populations
                    )
                }
                context.pendingDisasterAction = null
                context.currentDisaster = null
                return
            }

            if (!context.currentDisaster && Math.random() < 0.4) {
                const keys = Object.keys(disasters)
                const key = keys[Math.floor(Math.random() * keys.length)]
                const disaster = disasters[key]
                context.currentDisaster = disaster
            }
            return
        }

        // initialize roundsPerYear on first run
        if (!this.roundsPerYear) {
            this.roundsPerYear = context.numRoundsInSeason * 4
        }

        const roundsSinceLast = context.roundNumber - this.lastDisasterRound

        // trigger check: if a full year has passed since last disaster, pick a disaster probabilistically
        if (roundsSinceLast >= this.roundsPerYear) {
            const roll = Math.random()
            // 70% chance to produce a disaster each year
            if (roll < 0.7) {
                const keys = Object.keys(disasters)
                const key = keys[Math.floor(Math.random() * keys.length)]
                const disaster = disasters[key]

                // apply impacts to populations based on trophic mapping
                const impacts = this.impactMap[key] || {}
                for (const [level, speciesIds] of context.trophicLevel) {
                    const impactFraction = impacts[level] || 0.05
                    if (!Array.isArray(speciesIds)) continue
                    for (const speciesId of speciesIds) {
                        const pop = context.populations.get(speciesId)
                        if (!pop || typeof pop.size !== 'number') continue
                        const loss = Math.round(pop.size * impactFraction)
                        pop.size = Math.max(0, pop.size - loss)
                    }
                }

                // recompute ecosystem health using context
                let health = 0
                try {
                    health = context.calculateEcosystemHealth()
                    context.ecosystemHealth = health
                } catch (e) {
                    console.error('Failed to calculate ecosystem balance', e)
                }

                // add an entry to the game log
                gameLogSystem.addEntry({
                    season: context.determineSeason(),
                    name: disaster.title,
                    message: `${disaster.title}: ${disaster.description} — ecosystem health ${Math.round(health * 100)}%`
                })

                this.lastDisasterRound = context.roundNumber
            }
        }
    }
}

export default DisasterSystem
