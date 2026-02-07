/**
 * Ecosystem Configuration
 * Defines ideal ratios and caps for trophic levels
 */

export const IDEAL_RATIOS = {
  producer: {
    biomass: 1000,
    energy: 1000,
    cap: 100000, // Maximum producer biomass allowed
    priority: 0, 
  },
  herbivore: {
    biomass: 400,
    energy: 100,
    priority: 1, 
  },
  primaryCarnivore: {
    biomass: 150,
    energy: 10,
    priority: 2, 
  },
  secondaryCarnivore: {
    biomass: 80,
    energy: 1,
    priority: 3,
  },
};
