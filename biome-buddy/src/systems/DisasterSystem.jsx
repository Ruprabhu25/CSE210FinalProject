import System from "./System"
import { disasters } from "../data/disasters"
import { calculateEcosystemHealth } from "../GameContext"
import gameLogSystem from "./GameLogSystem"

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

    apply(context) {
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

                // recompute ecosystem health using available population state
                const speciesByTrophicLevel = {}
                for (const [level, speciesIds] of context.trophicLevel) {
                    speciesByTrophicLevel[level] = (speciesIds || []).map((id) => {
                        const p = context.populations.get(id)
                        return {
                            name: `species-${id}`,
                            population: p ? p.size : 0,
                            biomassPerIndividual: 1,
                            energyPerIndividual: 1
                        }
                    })
                }

                try {
                    health = calculateEcosystemHealth()
                } catch (e) {
                    console.error('Failed to calculate ecosystem balance', e)
                }

                // add an entry to the game log
                gameLogSystem.addEntry({
                    season: context.determineSeason(),
                    name: disaster.title,
                    message: `${disaster.title}: ${disaster.description} — ecosystem health ${Math.round((context.ecosystemHealth ?? 0) * 100)}%`
                })

                this.lastDisasterRound = context.roundNumber
            } else {
                // no disaster this year but still advance lastDisasterRound so we check again next year
                this.lastDisasterRound = context.roundNumber
            }
        }
    }
}

export default DisasterSystem