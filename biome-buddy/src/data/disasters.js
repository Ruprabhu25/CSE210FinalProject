// Pixel-art icons for each disaster (used by popups)
import wildfireIcon from "../assets/icons/wildfirepixel.png";
import landslideIcon from "../assets/icons/landslidepixel.png";
import floodIcon from "../assets/icons/floodpixel.png";
import droughtIcon from "../assets/icons/droughtpixel.png";
import invasiveIcon from "../assets/icons/invasivepixel.png";

// centralized disaster metadata so components can consume it as props
export const disasters = {
  wildfire: {
    title: "Wildfire",
    description:
      "Extreme heat and prolonged drought ignited a wildfire.",
    impact:
      "Forest loss, wildlife displacement, and reduced air quality.",
    actions: [
      { label: "Replant Trees", target: "Grass", deltaPopulation: 200 },
      { label: "Clear Burning Brush", target: "Grass", deltaPopulation: -150 }
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
      { label: "Stabilize Slopes", target: "Grass", deltaPopulation: 150 },
      { label: "Leave Debris", target: "Grass", deltaPopulation: -100 }
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
      { label: "Drain Away Water", target: "Grass", deltaPopulation: 140 },
      { label: "Dig Extra Ditches", target: "Grass", deltaPopulation: -120 }
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
      { label: "Conserve Water", target: "Grass", deltaPopulation: 160 },
      { label: "Truck In Water", target: "Grass", deltaPopulation: 80 }
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
      { label: "Remove Invaders", target: "Grass", deltaPopulation: 140 },
      { label: "Contain Spread", target: "Grass", deltaPopulation: -90 }
    ],
    icon: invasiveIcon
  }
};
