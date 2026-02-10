import Population from "./Population"

// Encapsulates game state
class GameContext {
    constructor() {
        this.roundNumber = 1 //int - the current round number
        this.populations = new Map() // speciesID -> Population instance
        this.trophicLevel = new Map() // level -> array of speciesIDs at that trophic level
        for (const speciesId of [1, 2, 3]) { // TODO: replace with actual values
            this.populations.set(speciesId, new Population(speciesId))
        }
        this.numRoundsInSeason = 3 //int - the number of rounds in each season, which determines how long each season lasts. 
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