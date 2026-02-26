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
    impact:
      "Forest loss, wildlife displacement, and reduced air quality.",
    actions: [
      {
        label: "Replant Trees",
        target: "Grass",
        deltaPopulation: 2000
      },
      {
        label: "Protect Nesting Zones",
        target: "Hawk",
        deltaPopulation: 100
      }
    ],
    icon: wildfireIcon
  },

  landslide: {
    title: "Landslide",
    description:
      "Heavy rainfall destabilized hillside terrain.",
    impact:
      "Severe soil erosion and blocked waterways.",
    actions: [
      {
        label: "Stabilize Slopes",
        target: "Rabbit",
        deltaPopulation: 100
      },
      {
        label: "Save Cliff Fox Nests",
        target: "Fox",
        deltaPopulation: 30
      }
    ],
    icon: landslideIcon
  },

  flood: {
    title: "Flood",
    description:
      "Overflowing rivers flooded the ecosystem.",
    impact:
      "Plant loss and water contamination.",
    actions: [
      {
        label: "Build Safe Burrows",
        target: "Rabbit",
        deltaPopulation: 45
      },
      {
        label: "Divert Flooding",
        target: "Grass",
        deltaPopulation: -350
      }
    ],
    icon: floodIcon
  },

  drought: {
    title: "Drought",
    description:
      "Extended lack of rainfall stressed the biome.",
    impact:
      "Crop failure and wildlife decline.",
    actions: [
      {
        label: "Conserve Water",
        target: "Fox",
        deltaPopulation: 40
      },
      {
        label: "Protect Watering Holes",
        target: "Rabbit",
        deltaPopulation: 250
      }
    ],
    icon: droughtIcon
  },

  invasive: {
    title: "Invasive Species",
    description:
      "A non-native species spread rapidly.",
    impact:
      "Native species populations declined.",
    actions: [
      {
        label: "Remove Invaders",
        target: "Grass",
        deltaPopulation: -400
      },
      {
        label: "Allow Spread",
        target: "Hawk",
        deltaPopulation: 20
      }
    ],
    icon: invasiveIcon
  },

  disease: {
    title: "Disease Outbreak",
    description:
      "A contagious illness spread through local wildlife.",
    impact:
      "Population declines and disrupted feeding patterns.",
    actions: [
      {
        label: "Vaccination and Quarantine",
        target: "Rabbit",
        deltaPopulation: 25
      },
      {
        label: "Culling Infected Groups",
        target: "Rabbit",
        deltaPopulation: -80
      }
    ],
    icon: diseaseIcon
  },

  famine: {
    title: "Famine",
    description:
      "Food shortages hit multiple species across the biome.",
    impact:
      "Weakened populations and reduced reproduction rates.",
    actions: [
      {
        label: "Emergency Feeding",
        target: "Rabbit",
        deltaPopulation: 40
      },
      {
        label: "Ration Resources",
        target: "Grass",
        deltaPopulation: -500
      }
    ],
    icon: famineIcon
  },

  earthquake: {
    title: "Earthquake",
    description:
      "A strong tremor damaged habitats and migration paths.",
    impact:
      "Burrow collapse, nest loss, and ecosystem instability.",
    actions: [
      {
        label: "Rebuild Burrows",
        target: "Rabbit",
        deltaPopulation: 30
      },
      {
        label: "Restore Perches",
        target: "Hawk",
        deltaPopulation: 8
      }
    ],
    icon: earthquakeIcon
  },

  poacher: {
    title: "Poacher Activity",
    description:
      "Illegal hunting increased pressure on predator species.",
    impact:
      "Predator populations fell and food chain balance shifted.",
    actions: [
      {
        label: "Anti-Poaching Patrols",
        target: "Fox",
        deltaPopulation: 20
      },
      {
        label: "Protect Nesting Areas",
        target: "Hawk",
        deltaPopulation: 10
      }
    ],
    icon: poacherIcon
  },

  deforestation: {
    title: "Deforestation",
    description:
      "Large sections of forest were cleared by human activity.",
    impact:
      "Habitat fragmentation and reduced producer coverage.",
    actions: [
      {
        label: "Restrict Logging in the Region",
        target: "Grass",
        deltaPopulation: 220
      },
      {
        label: "Create Wildlife Corridors",
        target: "Fox",
        deltaPopulation: 35
      }
    ],
    icon: deforestationIcon
  }
};
