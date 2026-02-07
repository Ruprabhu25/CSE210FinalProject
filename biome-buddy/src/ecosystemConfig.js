/**
 * Ecosystem Configuration
 * Defines ideal ratios and caps for trophic levels
 */

export const IDEAL_RATIOS = {
  producer: {
    idealRatio: 1000,
    cap: 100000, // Maximum producer biomass allowed
    priority: 0, 
  },
  herbivore: {
    idealRatio: 400,
    priority: 1, 
  },
  primaryCarnivore: {
    idealRatio: 150,
    priority: 2, 
  },
  secondaryCarnivore: {
    idealRatio: 80,
    priority: 3,
  },
};
