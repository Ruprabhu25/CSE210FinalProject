// Pixel-art icons for each disaster (used by popups)
import wildfireIcon from "../assets/icons/wildfirepixel.png";
import landslideIcon from "../assets/icons/landslidepixel.png";
import floodIcon from "../assets/icons/floodpixel.png";
import droughtIcon from "../assets/icons/droughtpixel.png";
import invasiveIcon from "../assets/icons/invasivepixel.png";
import diseaseIcon from "../assets/icons/diseasepixel.png";
import famineIcon from "../assets/icons/faminepixel.png";
import earthquakeIcon from "../assets/icons/earthquakepixel.png";
import poacherIcon from "../assets/icons/poacherpixel.png";
import deforestationIcon from "../assets/icons/deforestationpixel.png";

// centralized disaster metadata so components can consume it as props
export const disasters = {
  wildfire: {
    title: "Wildfire",
    description:
      "Extreme heat and prolonged drought ignited a wildfire.",
    educationBlurb:
      "Wildfires are a natural part of many ecosystems and can clear out dead material so new growth can begin. Hot and dry conditions can make fires spread faster and burn more intensely.",
    impact:
      "Forest loss, wildlife displacement, and reduced air quality.",
    actions: [
      {
        label: "Cut Dry Grass to Slow Fire",
        target: "Grass",
        deltaPopulation: -300
      },
      {
        label: "Clear Bushes",
        target: "Blueberry Bush",
        deltaPopulation: -100
      }
    ],
    icon: wildfireIcon
  },

  landslide: {
    title: "Landslide",
    description:
      "Heavy rainfall destabilized hillside terrain.",
    educationBlurb:
      "Landslides happen when soil loses stability over time and move downhill under gravity. Landslide risk can increase by removing vegetation.",
    impact:
      "Severe soil erosion and blocked waterways.",
    actions: [
      {
        label: "Relocate Rabbits Out of the Ecosystem",
        target: "Rabbit",
        deltaPopulation: -70
      },
      {
        label: "Relocate Foxes Out of the Ecosystem",
        target: "Fox",
        deltaPopulation: -20
      }
    ],
    icon: landslideIcon
  },

  flood: {
    title: "Flood",
    description:
      "Overflowing rivers flooded the ecosystem.",
    educationBlurb:
      "Floods occur when water levels rise beyond what the land or river channel can hold. Major floods can destroy animal habitats and spread pollution.",
    impact:
      "Plant loss and water contamination.",
    actions: [
      {
        label: "Relocate Deer in Floodplains Out of Ecosystem",
        target: "Deer",
        deltaPopulation: -25
      },
      {
        label: "Relocate Frogs in Contaminated Water Out of Ecosystem",
        target: "Frog",
        deltaPopulation: -10
      }
    ],
    icon: floodIcon
  },

  drought: {
    title: "Drought",
    description:
      "Extended lack of rainfall stressed the biome.",
    educationBlurb:
      "Droughts occur with unusually low rainfall and reduced water availability. Drought can reduce plant growth and damage food chains as species compete for limited resources.",
    impact:
      "Crop failure and wildlife decline.",
    actions: [
      {
        label: "Trim Bushes to Save Water",
        target: "Blueberry Bush",
        deltaPopulation: -100
      },
      {
        label: "Cull Deer at Watering Holes",
        target: "Deer",
        deltaPopulation: -25
      }
    ],
    icon: droughtIcon
  },

  invasive: {
    title: "Invasive Species",
    description:
      "A non-native species spread rapidly.",
    educationBlurb:
      "Invasive species are organisms introduced outside their native ecosystems that spread and cause harm. They can compete with native species for food, water, and space and destablize existing ecosystems.",
    impact:
      "Native species populations declined.",
    actions: [
      {
        label: "Cut Grass to Slow Invasive Growth",
        target: "Grass",
        deltaPopulation: -330
      },
      {
        label: "Drain Ponds to Remove Invaders",
        target: "Frog",
        deltaPopulation: -8
      }
    ],
    icon: invasiveIcon
  },

  disease: {
    title: "Disease Outbreak",
    description:
      "A contagious illness spread through local wildlife.",
    educationBlurb:
      "Diseases are illnesses that spread quickly when animals are crowded or stressed by habitat loss. Some outbreaks fade naturally, but others can heavily reduce populations.",
    impact:
      "Population declines and disrupted feeding patterns.",
    actions: [
      {
        label: "Cull Deer Herds to Slow Disease Spread",
        target: "Deer",
        deltaPopulation: -20
      },
      {
        label: "Cull Rabbits in Outbreak Areas",
        target: "Rabbit",
        deltaPopulation: -50
      }
    ],
    icon: diseaseIcon
  },

  famine: {
    title: "Famine",
    description:
      "Food shortages hit multiple species across the biome.",
    educationBlurb:
      "Famine happens when available food drops below what populations need to survive and reproduce. It can be caused by drought, disease, or any other disruptions across the ecosystem.",
    impact:
      "Weakened populations and reduced reproduction rates.",
    actions: [
      {
        label: "Cull Deer to Save Edible Vegetation",
        target: "Deer",
        deltaPopulation: -20
      },
      {
        label: "Harvest Blueberries for Food",
        target: "Blueberry Bush",
        deltaPopulation: -70
      }
    ],
    icon: famineIcon
  },

  earthquake: {
    title: "Earthquake",
    description:
      "A strong tremor damaged habitats and migration paths.",
    educationBlurb:
      "Earthquakes are sudden ground movements caused by shifting tectonic plates. Earthquakes can reshape habitat by collapsing burrows, cracking soil, and changing water flow paths.",
    impact:
      "Burrow collapse, nest loss, and ecosystem instability.",
    actions: [
      {
        label: "Evacuate Foxes Out of Ecosystem",
        target: "Fox",
        deltaPopulation: -15
      },
      {
        label: "Evacuate Hawks Out of Ecosystem",
        target: "Hawk",
        deltaPopulation: -3
      }
    ],
    icon: earthquakeIcon
  },

  poacher: {
    title: "Poacher Activity",
    description:
      "Illegal hunting increased pressure on predator species.",
    educationBlurb:
      "Poaching removes animals outside legal or sustainable limits and can quickly destabilize ecosystems. Losing predators often causes prey imbalances that ripple through the ecosystem.",
    impact:
      "Predator populations fell and food chain balance shifted.",
    actions: [
      {
        label: "Relocate Bears Out of Ecosystem",
        target: "Bear",
        deltaPopulation: -2
      },
      {
        label: "Relocate Hawks Out of Ecosystem",
        target: "Hawk",
        deltaPopulation: -3
      }
    ],
    icon: poacherIcon
  },

  deforestation: {
    title: "Deforestation",
    description:
      "Large sections of forest were cleared by human activity.",
    educationBlurb:
      "Deforestation is the large-scale removal of trees that support habitats and soil stability. Deforestation make it harder for wildlife to find food, shelter, and mates.",
    impact:
      "Habitat fragmentation and reduced producer coverage.",
    actions: [
      {
        label: "Evacuate Denested Hawks Out of Ecosystem",
        target: "Hawk",
        deltaPopulation: -3
      },
      {
        label: "Evacuate Affected Rabbits Out of Ecosystem",
        target: "Rabbit",
        deltaPopulation: -70
      }
    ],
    icon: deforestationIcon
  }
};
