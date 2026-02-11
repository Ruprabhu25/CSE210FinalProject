import GameContext from "./GameContext"
import SeasonSystem from "./systems/SeasonSystem"
import PlayerActionSystem from "./systems/PlayerActionSystem"
import FoodChainSystem from "./systems/FoodChainSystem"
import DisasterSystem from "./systems/DisasterSystem"

class GameEngine {
    constructor() {
        // system order matters - previous systems can affect the population sizes that later systems depend on.
        this.systems = [
            new SeasonSystem(), 
            new PlayerActionSystem(),
            new FoodChainSystem(), // Higher trophic levels depend on the populations of lower trophic levels for food
            new DisasterSystem(),
        ]
        this.context = new GameContext()
    };

    runRound() {
        for (const system of this.systems) {
            system.apply(this.context)
        }

        this.context.increaseRound() // Move to the next round
        return this.context
    }
}

export default GameEngine