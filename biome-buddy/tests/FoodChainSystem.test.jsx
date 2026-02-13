import { describe, it, expect, beforeEach } from 'vitest';
import FoodChainSystem from '../src/systems/FoodChainSystem';
import Population from '../src/Population';
import { ProducerTrophic, PrimaryConsumerTrophic, SecondaryConsumerTrophic, TertiaryConsumerTrophic } from '../src/Trophic';

function MockTestData({producers, primary, secondary, tertiary}, ) {
  const trophicLevels = [
    new ProducerTrophic(),
    new PrimaryConsumerTrophic(),
    new SecondaryConsumerTrophic(),
    new TertiaryConsumerTrophic()
  ];
  trophicLevels[0].idealRatio = 1000;   // Producers
  trophicLevels[1].idealRatio = 400;    // Primary Consumers
  trophicLevels[2].idealRatio = 150;    // Secondary Consumers
  trophicLevels[3].idealRatio = 80;    // Tertiary Consumers

  const populations = new Map();
  let id = 1;
  [producers, primary, secondary, tertiary].forEach((group, i) => {
    if (!group) return;
    Object.entries(group).forEach(([name, size]) => {
      populations.set(id, new Population(id, size, 0.1, 0.05));
      trophicLevels[i].speciesMap[id] = name;
      id++;
    });
  });
  return { trophicLevels, populations };
}

describe('FoodChainSystem', () => {
  let system;

  beforeEach(() => {
    system = new FoodChainSystem();
  });

  it('does nothing if prey or predator is zero', () => {
    const context = MockTestData({ producers: {A: 0}, primary: {B: 0} });
    const before = Array.from(context.populations.values()).map(p => p.getCurrentSize());
    system.apply(context);
    const after = Array.from(context.populations.values()).map(p => p.getCurrentSize());
    expect(after).toEqual(before);
  });

  it('predators decline significantly when prey are extremely scarce', () => {
    const context = MockTestData({ producers: {A: 10}, primary: {B: 1000} });
    const predator = context.populations.get(2);
    const before = predator.getCurrentSize();
    system.apply(context);
    const after = predator.getCurrentSize();
    expect(after).toBeLessThan(before * 9); // strong decline
  });

  it('predators grow significantly when prey are extremely abundant', () => {
    const context = MockTestData({ producers: {A: 5000}, primary: {B: 100} });
    const predator = context.populations.get(2);
    const before = predator.getCurrentSize();
    system.apply(context);
    const after = predator.getCurrentSize();
    expect(after).toBeGreaterThan(before * 1.1);
  });

  it('system is stable near ideal ratio (within tolerance)', () => {
    const context = MockTestData({ producers: {A: 1000}, primary: {B: 380} });
    const before = Array.from(context.populations.values()).map(p => p.getCurrentSize());
    system.apply(context);
    const after = Array.from(context.populations.values()).map(p => p.getCurrentSize());
    expect(after).toEqual(before); 
  });
  it('multi-step dynamics oscillate (predator responds to prey)', () => {
    const context = MockTestData({ producers: {A: 2000}, primary: {B: 100} });
    const predator = context.populations.get(2);
    const prey = context.populations.get(1);

    const predatorSizes = [];
    const preySizes = [];

    for (let i = 0; i < 10; i++) {
      system.apply(context);
      predatorSizes.push(predator.getCurrentSize());
      preySizes.push(prey.getCurrentSize());
    }
    const predatorMax = predatorSizes.reduce((a, b) => Math.max(a, b));
    const predatorMin = predatorSizes.reduce((a, b) => Math.min(a, b));
    const predatorVariation = predatorMax - predatorMin;

    const preyMax = preySizes.reduce((a, b) => Math.max(a, b));
    const preyMin = preySizes.reduce((a, b) => Math.min(a, b));
    const preyVariation = preyMax - preyMin;

    expect(predatorVariation).toBeGreaterThan(0);
    expect(preyVariation).toBeGreaterThan(0);
  });

  it('Crash Test', () => {
    const context = MockTestData({
      producers: {A: 1000},
      primary: {B: 400},
      secondary: {C: 150},
      tertiary: {D: 80}
    });

    for (let i = 0; i < 5; i++) {
      system.apply(context);
    }

    for (const pop of context.populations.values()) {
      expect(typeof pop.getCurrentSize()).toBe('number');
      expect(pop.getCurrentSize()).toBeGreaterThanOrEqual(0);
    }
  });
    
    it('Underpopulation: predators decline', () => {
        const context = MockTestData({
            producers: { A: 10 },
            primary: { B: 500 },
            secondary: { C: 300 },
            tertiary: { D: 200 }
        });

        const before = Array.from(context.populations.values()).map(p => p.getCurrentSize());
        system.apply(context);
        const after = Array.from(context.populations.values()).map(p => p.getCurrentSize());
        // Predators should decline
        expect(after[1]).toBeLessThan(before[1]);
        expect(after[2]).toBeLessThan(before[2]);
        expect(after[3]).toBeLessThan(before[3]);
        expect(after[0]).toBeGreaterThanOrEqual(0);
    });
    it('Mix over and under population', () => {
        const context = MockTestData({
            producers: { A: 1000 },
            primary: { B: 50 },
            secondary: { C: 100 },
            tertiary: { D: 5 }
        });

        const before = Array.from(context.populations.values()).map(p => p.getCurrentSize());
        system.apply(context);
        const after = Array.from(context.populations.values()).map(p => p.getCurrentSize());
        expect(after[1]).toBeGreaterThan(before[1]);
        expect(after[2]).toBeLessThan(before[2]);
        expect(after[3]).toBeGreaterThan(before[3]);
        expect(after[0]).toBeLessThan(before[0]);
    });

});