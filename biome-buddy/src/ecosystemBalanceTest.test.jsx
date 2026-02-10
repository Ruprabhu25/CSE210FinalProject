import {calculateEcosystemBalance} from "./ecosystemBalance";
import { test, expect } from "vitest";

// Tests for possible inputs 
// Did not test against negative inputs oo missing trophic levels
test("close to ideal ecosystem returns ~100% health", () => {
  const ecosystem = {producer: [{name: "Grass", population: 50, biomassPerIndividual: 10, energyPerIndividual: 10,carryingCapacity: 150}, 
      {name: "tree", population: 50, biomassPerIndividual: 10, energyPerIndividual: 10, carryingCapacity: 150}],
    herbivore: [{name: "Deer", population: 85, biomassPerIndividual: 10, energyPerIndividual: 0.1, carryingCapacity: 60}],
    primaryCarnivore: [{name: "Wolf", population: 30, biomassPerIndividual: 10, energyPerIndividual: 0.01, carryingCapacity: 30}],
    secondaryCarnivore: [{name: "Bear", population: 160, biomassPerIndividual: 1, energyPerIndividual: 0.001,carryingCapacity: 100}]
  };

  const health = calculateEcosystemBalance(ecosystem);
  console.log("Ecosystem Health:", health);
  expect(health).toBeCloseTo(1, 1);
});


test("overpopulated producers lowers health", () => {
  
  const ecosystem = {producer: [{name: "Grass", population: 150, biomassPerIndividual: 10, energyPerIndividual: 10,carryingCapacity: 150}, 
      {name: "tree", population: 150, biomassPerIndividual: 10, energyPerIndividual: 10, carryingCapacity: 150}],
    herbivore: [{name: "Deer", population: 200, biomassPerIndividual: 10, energyPerIndividual: 0.1, carryingCapacity: 60}],
    primaryCarnivore: [{name: "Wolf", population: 15, biomassPerIndividual: 10, energyPerIndividual: 0.01, carryingCapacity: 30}],
    secondaryCarnivore: [{name: "Bear", population: 80, biomassPerIndividual: 1, energyPerIndividual: 0.001,carryingCapacity: 100}]
  };

  const health = calculateEcosystemBalance(ecosystem);
  console.log("Ecosystem Health:", health);
  expect(health).toBeLessThan(1);
});


test("empty ecosystem returns zero health", () => {
  const ecosystem = {
    producer: [],
    herbivore: [],
    primaryCarnivore: [],
    secondaryCarnivore: [],
  };

  const health = calculateEcosystemBalance(ecosystem);
  console.log("Ecosystem Health:", health);
  expect(health).toBeCloseTo(0, 6);
});

test("exact ideal ratios produce full health", () => {
  const ecosystem = {
    producer: [
      { name: "Grass", population: 100, biomassPerIndividual: 1000, energyPerIndividual: 100 }],
    herbivore: [
      { name: "Deer", population: 40, biomassPerIndividual: 600, energyPerIndividual: 10 }],
    primaryCarnivore: [
      { name: "Wolf", population: 15, biomassPerIndividual: 455, energyPerIndividual: 1 },
    ],
    secondaryCarnivore: [
      { name: "Bear", population: 8, biomassPerIndividual: 240, energyPerIndividual: 0.1 },
    ],
  };

  const health = calculateEcosystemBalance(ecosystem);
  expect(health).toBeCloseTo(1, 6);
});

test("producer present but next level empty uses penalty floor", () => {
  const ecosystem = {
    producer: [
      { name: "Grass", population: 100, biomassPerIndividual: 10, energyPerIndividual: 10 },
    ],
    herbivore: [],
    primaryCarnivore: [],
    secondaryCarnivore: [],
  };

  const health = calculateEcosystemBalance(ecosystem);
  console.log("Ecosystem Health:", health);
  expect(health).toBeCloseTo(0.0, 6);
});


test("randome trohpic becomes 0", () => {
  const ecosystem = {
    producer: [
      { name: "Grass", population: 10000, biomassPerIndividual: 100, energyPerIndividual: 10 }, 
    ],
    herbivore: [
      { name: "Deer", population: 0, biomassPerIndividual: 80, energyPerIndividual: 10 }
    ],
    primaryCarnivore: [
      { name: "Wolf", population: 300, biomassPerIndividual: 40, energyPerIndividual: 10 }
    ],
    secondaryCarnivore: [
      { name: "Bear", population: 10000000, biomassPerIndividual: 10, energyPerIndividual: 10 }
    ],
  };

  const health = calculateEcosystemBalance(ecosystem);
  console.log("Ecosystem Health:", health);
  expect(health).toBeCloseTo(0.0, 6);
});
test("apex predator extinct but lower levels healthy", () => {
  const ecosystem = {
    producer: [{ population: 100, biomassPerIndividual: 10, energyPerIndividual: 10 }],
    herbivore: [{ population: 40, biomassPerIndividual: 10, energyPerIndividual: 10 }],
    primaryCarnivore: [{ population: 15, biomassPerIndividual: 10, energyPerIndividual: 10 }],
    secondaryCarnivore: []
  };

  const health = calculateEcosystemBalance(ecosystem);
  expect(health).toBe(0);
});
