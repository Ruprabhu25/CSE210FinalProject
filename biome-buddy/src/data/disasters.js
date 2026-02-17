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
      {
        label: "Replant Trees",
        target: "Grass",
        deltaPopulation: 200
      },
      {
        label: "Protect Nesting Zones",
        target: "Hawk",
        deltaPopulation: 10
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
        deltaPopulation: 30
      },
      {
        label: "Save Cliff Fox Nests",
        target: "Fox",
        deltaPopulation: 25
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
        deltaPopulation: -180
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
        deltaPopulation: 20
      },
      {
        label: "Protect Watering Holes",
        target: "Rabbit",
        deltaPopulation: 25
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
        deltaPopulation: -40
      },
      {
        label: "Allow Spread",
        target: "Hawk",
        deltaPopulation: 5
      }
    ],
    icon: invasiveIcon
  }
};
