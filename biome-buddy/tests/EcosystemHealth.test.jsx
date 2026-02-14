import {EcosystemHealth} from "../src/EcosystemHealth";
import { test, expect } from "vitest";
import { ProducerTrophic, PrimaryConsumerTrophic, SecondaryConsumerTrophic, TertiaryConsumerTrophic } from "../src/Trophic";
import {Population} from "../src/Population";

function MockTestData(speciesByLevel) {
  const trophicLevels = [
    new ProducerTrophic(),
    new PrimaryConsumerTrophic(),
    new SecondaryConsumerTrophic(),
    new TertiaryConsumerTrophic()
  ];
  
  // Set ideal ratios
  trophicLevels[0].idealRatio = 1000;   // Producers
  trophicLevels[1].idealRatio = 400;    // Primary Consumers
  trophicLevels[2].idealRatio = 150;    // Secondary Consumers
  trophicLevels[3].idealRatio = 80;     // Tertiary Consumers
  
  const populations = new Map();
  trophicLevels.forEach(level => {
    level.speciesMap = {};
  });

  let speciesId = "a";
  Object.entries(speciesByLevel).forEach(([levelName, species]) => {
    const level = trophicLevels.find(t => t.name === levelName);
    if (level) {
      species.forEach(spec => {
        level.speciesMap[speciesId] = { biomass: spec.biomass, energy: spec.energy };
        populations.set(speciesId, new Population(speciesId, spec.population, 0, 0));
        speciesId = String.fromCharCode(speciesId.charCodeAt(0) + 1);
      });
    }
  });

  return { trophicLevels, populations };
}

test("close to ideal ecosystem returns ~100% health", () => {
  const { trophicLevels, populations } = MockTestData({
    "Producers": [
      { population: 50, biomass: 100, energy: 10 },
      { population: 50, biomass: 100, energy: 10 }
    ],
    "Primary Consumers": [
      { population: 41, biomass: 10, energy: 0.1 }
    ],
    "Secondary Consumers": [
      { population: 13, biomass: 10, energy: 0.01 }
    ],
    "Tertiary Consumers": [
      { population: 7 , biomass: 1, energy: 0.001 }
    ]
  });

  const health = EcosystemHealth(trophicLevels, populations);
  
  expect(health).toBeCloseTo(1, 1);
});

test("overpopulated producers lowers health", () => {
  const { trophicLevels, populations } = MockTestData({
    "Producers": [
      { population: 150, biomass: 100, energy: 10 },
      { population: 150, biomass: 100, energy: 10 }
    ],
    "Primary Consumers": [
      { population: 200, biomass: 10, energy: 0.1 }
    ],
    "Secondary Consumers": [
      { population: 15, biomass: 10, energy: 0.01 }
    ],
    "Tertiary Consumers": [
      { population: 80, biomass: 1, energy: 0.001 }
    ]
  });

  const health = EcosystemHealth(trophicLevels, populations);
  
  expect(health).toBeLessThan(1);
});

test("empty ecosystem returns zero health", () => {
  const { trophicLevels, populations } = MockTestData({
    "Producers": [],
    "Primary Consumers": [],
    "Secondary Consumers": [],
    "Tertiary Consumers": []
  });

  const health = EcosystemHealth(trophicLevels, populations);
  
  expect(health).toBeCloseTo(0, 6);
});

test("exact ideal ratios", () => {
  const { trophicLevels, populations } = MockTestData({
    "Producers": [
      { population: 100, biomass: 1000, energy: 100 }
    ],
    "Primary Consumers": [
      { population: 40, biomass: 600, energy: 10 }
    ],
    "Secondary Consumers": [
      { population: 15, biomass: 455, energy: 1 }
    ],
    "Tertiary Consumers": [
      { population: 8, biomass: 240, energy: 0.1 }
    ]
  });

  const health = EcosystemHealth(trophicLevels, populations);
  
  expect(health).toBeCloseTo(1);
});

test("producer present but none of the other levels returns 0", () => {
  const { trophicLevels, populations } = MockTestData({
    "Producers": [
      { population: 100, biomass: 10, energy: 10 }
    ],
    "Primary Consumers": [],
    "Secondary Consumers": [],
    "Tertiary Consumers": []
  });

  const health = EcosystemHealth(trophicLevels, populations);
  
  expect(health).toBeCloseTo(0);
});

test("random trophic becomes 0 returns 0 health", () => {
  const { trophicLevels, populations } = MockTestData({
    "Producers": [
      { population: 10000, biomass: 100, energy: 10 }
    ],
    "Primary Consumers": [
      { population: 0, biomass: 80, energy: 10 }
    ],
    "Secondary Consumers": [
      { population: 300, biomass: 40, energy: 10 }
    ],
    "Tertiary Consumers": [
      { population: 10000000, biomass: 10, energy: 10 }
    ]
  });

  const health = EcosystemHealth(trophicLevels, populations);
  
  expect(health).toBe(0);
});

