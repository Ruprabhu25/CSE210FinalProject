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
    actions: ["Replant Trees", "Restrict Logging"],
    icon: wildfireIcon
  },

  landslide: {
    title: "Landslide",
    description:
      "Heavy rainfall destabilized hillside terrain.",
    impact:
      "Severe soil erosion and blocked waterways.",
    actions: ["Stabilize Slopes", "Restore Vegetation"],
    icon: landslideIcon
  },

  flood: {
    title: "Flood",
    description:
      "Overflowing rivers flooded the ecosystem.",
    impact:
      "Plant loss and water contamination.",
    actions: ["Drain Excess Water", "Rebuild Wetlands"],
    icon: floodIcon
  },

  drought: {
    title: "Drought",
    description:
      "Extended lack of rainfall stressed the biome.",
    impact:
      "Crop failure and wildlife decline.",
    actions: ["Conserve Water", "Introduce Hardy Plants"],
    icon: droughtIcon
  },

  invasive: {
    title: "Invasive Species",
    description:
      "A non-native species spread rapidly.",
    impact:
      "Native species populations declined.",
    actions: ["Remove Invasive Species", "Restore Native Species"],
    icon: invasiveIcon
  }
};
