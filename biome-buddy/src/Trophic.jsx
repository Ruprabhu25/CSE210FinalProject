import { Species } from "./Species.jsx"
import { Population } from "./Population"

// ---------------- Base Trophic Level ----------------
class TrophicLevel {
    constructor(name, speciesMap = {}, populationMap={}, idealRatio = 1) {
        this.name = name // e.g., "Producers", "Primary Consumers", etc.
        this.speciesMap = speciesMap // map of species names to species
        this.populationMap = populationMap // map of species names to populations
        this.idealRatio = idealRatio // this should be the ideal ratio of this trophic level to the one above it
        // assign trophic level name onto each species instance in the speciesMap
        for (const species of Object.values(this.speciesMap || {})) {
            if (species && typeof species === 'object') {
                species.trophic = this.name
            }
        }
    }
}

// ---------------- Producers ----------------
const grass = new Species('Grass', 1, 0.05, 0)
const grassPop = new Population(grass.name, 1000, 0.2, 0.05)

const blueberryBush = new Species('Blueberry Bush', 2, 0.08, 0)
const blueberryPop = new Population(blueberryBush.name, 400, 0.15, 0.04)

class ProducerTrophic extends TrophicLevel {
    constructor() {
        super(
            "Producers",
            {[grass.name]: grass,
             [blueberryBush.name]: blueberryBush,
            },
            {[grass.name]: grassPop,
             [blueberryBush.name]: blueberryPop,
            }, 1)
    }
}

// ---------------- Primary Consumers ----------------
const rabbit = new Species('Rabbit', 4, 0.5)
const rabbitPop = new Population(rabbit.name, 250, 0.12, 0.05)

const deer = new Species('Deer', 10, 3)
const deerPop = new Population(deer.name, 80, 0.08, 0.04)

class PrimaryConsumerTrophic extends TrophicLevel {
    constructor() {
        super("Primary Consumers",
            {
                [rabbit.name]: rabbit,
                [deer.name]: deer,
            },
            {
                [rabbit.name]: rabbitPop,
                [deer.name]: deerPop,
            }, 1);
    }
}

// ---------------- Secondary Consumers ----------------
const fox = new Species('Fox', 20, 5)
const foxPop = new Population(fox.name, 40, 0.10, 0.08)

const frog = new Species('Frog', 30, 7)
const frogPop = new Population(frog.name, 25, 0.06, 0.06)

class SecondaryConsumerTrophic extends TrophicLevel {2
    constructor() {
        super("Secondary Consumers",
            {
                [fox.name]: fox,
                [frog.name]: frog,
            },
            {
                [fox.name]: foxPop,
                [frog.name]: frogPop,
            }, 1);
    }
}

// ---------------- Tertiary Consumers ----------------
const hawk = new Species('Hawk', 45, 6)
const hawkPop = new Population(hawk.name, 12, 0.08, 0.07)

const bear = new Species('Bear', 60, 15)
const bearPop = new Population(bear.name, 6, 0.04, 0.03)

class TertiaryConsumerTrophic extends TrophicLevel {
    constructor() {
        super("Tertiary Consumers",
            {
                [hawk.name]: hawk,
                [bear.name]: bear,
            },
            {
                [hawk.name]: hawkPop,
                [bear.name]: bearPop,
            }, 1);
    }
}

// ---------------- Exports ----------------
export {
  ProducerTrophic,
  PrimaryConsumerTrophic,
  SecondaryConsumerTrophic,
  TertiaryConsumerTrophic
}