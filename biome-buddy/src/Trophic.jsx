import { Species } from "./Species.jsx"
import { Population } from "./Population"

class TrophicLevel {
    constructor(name, priority, speciesMap = {}, populationMap={}, idealRatio = 1) {
        this.name = name // e.g., "Producers", "Primary Consumers", etc.
        this.priority = priority // lower for producers, higher for top predators
        this.speciesMap = speciesMap // map of species names to species
        this.populationMap = populationMap // map of species names to populations
        this.idealRatio = idealRatio // this should be the ideal ratio of this trophic level to the one above it
        // assign trophic level name onto each species instance in the speciesMap
        for (const [sname, species] of Object.entries(this.speciesMap || {})) {
            if (species && typeof species === 'object') {
                species.trophic = this.name
            }
        } 
    }
}

const grass = new Species('Grass', 1, 0.05, 0)
const grassPop = new Population(grass.name, 1000, 0.2, 0.02)
class ProducerTrophic extends TrophicLevel {
    constructor() {
        super("Producers", 0, { [grass.name]: grass }, { [grass.name]: grassPop }, 1);
    }
}

const rabbit = new Species('Rabbit', 4, 0.5)
const rabbitPop = new Population(rabbit.name, 250, 0.12, 0.05)
class PrimaryConsumerTrophic extends TrophicLevel {
    constructor() {
        super("Primary Consumers", 1, { [rabbit.name]: rabbit }, { [rabbit.name]: rabbitPop }, 1);
    }
}

const fox = new Species('Fox', 20, 5)
const foxPop = new Population(fox.name, 40, 0.06, 0.07)
class SecondaryConsumerTrophic extends TrophicLevel {
    constructor() {
        super("Secondary Consumers", 2, { [fox.name]: fox }, { [fox.name]: foxPop }, 1);
    }
}

const hawk = new Species('Hawk', 45, 6)
const hawkPop = new Population(hawk.name, 12, 0.03, 0.08)
class TertiaryConsumerTrophic extends TrophicLevel {
    constructor() {
        super("Tertiary Consumers", 3, { [hawk.name]: hawk }, { [hawk.name]: hawkPop }, 1);
    }
}

export { ProducerTrophic, PrimaryConsumerTrophic, SecondaryConsumerTrophic, TertiaryConsumerTrophic }