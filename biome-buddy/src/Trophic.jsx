import { Species } from "./Species.jsx"
import { Population } from "./Population"

class TrophicLevel {
    constructor(name, speciesMap = {}, populationMap={}, idealRatio = 1) {
        this.name = name // e.g., "Producers", "Primary Consumers", etc.
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

class ProducerTrophic extends TrophicLevel {
    constructor() {
        const grass = new Species('Grass', 1, 0.05, 0)
        const grassPop = new Population(grass.name, 1000, 0.2, 0.05)
        super("Producers", { [grass.name]: grass }, { [grass.name]: grassPop }, 1);
    }
}

class PrimaryConsumerTrophic extends TrophicLevel {
    constructor() {
        const rabbit = new Species('Rabbit', 4, 0.5)
        const rabbitPop = new Population(rabbit.name, 250, 0.12, 0.05)
        super("Primary Consumers",{ [rabbit.name]: rabbit }, { [rabbit.name]: rabbitPop }, 1);
    }
}

class SecondaryConsumerTrophic extends TrophicLevel {
    constructor() {
        const fox = new Species('Fox', 20, 5)
        const foxPop = new Population(fox.name, 40, 0.10, 0.08)
        super("Secondary Consumers", { [fox.name]: fox }, { [fox.name]: foxPop }, 1);
    }
}

class TertiaryConsumerTrophic extends TrophicLevel {
    constructor() {
        const hawk = new Species('Hawk', 45, 6)
        const hawkPop = new Population(hawk.name, 12, 0.08, 0.07)
        super("Tertiary Consumers", { [hawk.name]: hawk }, { [hawk.name]: hawkPop }, 1);
    }
}

export { ProducerTrophic, PrimaryConsumerTrophic, SecondaryConsumerTrophic, TertiaryConsumerTrophic }