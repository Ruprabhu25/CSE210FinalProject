import {Population} from "./Population"
import { ProducerTrophic, PrimaryConsumerTrophic, SecondaryConsumerTrophic, TertiaryConsumerTrophic } from "./Trophic"
import { EcosystemHealth } from "./EcosystemHealth"

// Encapsulates game state
class GameContext {
    constructor() {
        this.roundNumber = 1 //int - the current round number
        this.populations = new Map() // Species Name -> Population instance
        this.species = new Map() // Species Name -> Species Instance
        this.trophicLevels = [
          new ProducerTrophic(),
          new PrimaryConsumerTrophic(),
          new SecondaryConsumerTrophic(),
          new TertiaryConsumerTrophic()
        ];

        for (const tl of this.trophicLevels) {
            for (const [speciesName, species] of Object.entries(tl.speciesMap)) {
                this.species.set(speciesName, species)
            }
            for (const [speciesName, population] of Object.entries(tl.populationMap)) {
                this.populations.set(speciesName, population)
            }
        }

        if(this.species.size != this.populations.size) {
            console.error("WARNING: Mismatch between species and populations");
        }

        this.numRoundsInSeason = 3 //int - the number of rounds in each season, which determines how long each season lasts. 
        this.currentDisaster = null // active disaster selected by systems for UI popup
        this.pendingDisasterAction = null // action selected in popup; resolved by DisasterSystem during runRound()
        this.enablePopupDisasters = true // allow DisasterSystem to drive popup disasters
    }
    calculateEcosystemHealth() {
        return EcosystemHealth(this.trophicLevels, this.populations)
    }
    
    determineSeason() {
        const seasons = ["Spring", "Summer", "Fall", "Winter"]
        // season should last for a certain number of rounds
        const currentSeasonIndex = Math.floor((this.roundNumber - 1) / this.numRoundsInSeason) % seasons.length
        return seasons[currentSeasonIndex]
    }

    increaseRound() {
        this.roundNumber++
    }
}

export default GameContext
