import {
  Species,
  Producer,
  PrimaryConsumer,
  SecondaryConsumer,
  TertiaryConsumer,
} from '../src/lib/species.js'

function log(title, obj) {
  console.log('---', title, '---')
  console.log(JSON.stringify(obj.toJSON(), null, 2))
}

// create instances and exercise methods
const grass = new Producer('Grass', 1, 0.05, 1000, 0.12)
const rabbit = new PrimaryConsumer('Rabbit', 4, 0.5, 200, 0.08)
const fox = new SecondaryConsumer('Fox', 20, 5, 20, 0.02)
const hawk = new TertiaryConsumer('Hawk', 45, 6, 5, 0.01)

log('initial grass', grass)
log('initial rabbit', rabbit)
log('initial fox', fox)
log('initial hawk', hawk)

// update population one timestep
grass.updatePopulation()
rabbit.updatePopulation()
fox.updatePopulation()
hawk.updatePopulation()

console.log('\nAfter one population update:')
log('grass', grass)
log('rabbit', rabbit)
log('fox', fox)
log('hawk', hawk)

console.log('\nTotals:')
console.log('Grass biomass:', grass.getTotalBiomass())
console.log('Rabbit energy:', rabbit.getTotalEnergy())