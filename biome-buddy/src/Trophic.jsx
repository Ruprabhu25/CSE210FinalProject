class TrophicLevel {
    constructor(name, priority, speciesMap = {}, idealRatio = 1) {
        this.name = name // e.g., "Producers", "Primary Consumers", etc.
        this.priority = priority // lower for producers, higher for top predators
        this.speciesMap = speciesMap // consists of speciesID
        this.idealRatio = idealRatio // this should be the ideal ratio of this trophic level to the one above it
    }
}

class ProducerTrophic extends TrophicLevel {
    constructor() {
        super("Producers", 0, {}, 1);
    }
}

class PrimaryConsumerTrophic extends TrophicLevel {
    constructor() {
        super("Primary Consumers", 1, {}, 1);
    }
}

class SecondaryConsumerTrophic extends TrophicLevel {
    constructor() {
        super("Secondary Consumers", 2, {}, 1);
    }
}

class TertiaryConsumerTrophic extends TrophicLevel {
    constructor() {
        super("Tertiary Consumers", 3, {}, 1);
    }
}

export { ProducerTrophic, PrimaryConsumerTrophic, SecondaryConsumerTrophic, TertiaryConsumerTrophic }