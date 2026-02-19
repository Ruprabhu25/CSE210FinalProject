import System from "./System"

class SeasonSystem extends System {
    constructor() {
        super("SeasonSystem")
        this.producerGrowthModifiers = {
            "Spring": 1.5,
            "Summer": 1.0,
            "Fall": 0.7,
            "Winter": 0.3
        }
        this.producerMortalityModifiers = {
            "Spring": 0.5,
            "Summer": 1.0,
            "Fall": 1.3,
            "Winter": 5.0
        }
    }

    apply(context) {
        const currentSeason = context.determineSeason();
        if (!(currentSeason in this.producerGrowthModifiers) || !(currentSeason in this.producerMortalityModifiers)) {
            console.error(`SeasonSystem has no growth or mortality modifier for season ${currentSeason}. Defaulting to 1.0.`);
        }
        const growthModifier = this.producerGrowthModifiers[currentSeason] || 1.0;
        const mortalityModifier = this.producerMortalityModifiers[currentSeason] || 1.0;

        for (const producer in context.trophicLevels[0].populationMap) {
            const population = context.populations.get(producer);
            if (population) {
                population.updatePopulationByGrowthRate(growthModifier);
                population.updatePopulationByMortalityRate(mortalityModifier);
            } else {
                throw new Error(`Producer ${producer} not found in GameContext populations.`);
            }
        }
    }
}

export default SeasonSystem