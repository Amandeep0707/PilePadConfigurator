import rawPricingData from "./pricing_data.json";
import selectLift2Img from "../assets/lift2_base.jpg";
import selectLift4Img from "../assets/lift4_base.jpg";

/**
 * Processes the raw JSON data into a structured format for the application.
 * This runs only once when the module is first imported.
 */
function processData() {
  const variants = Object.values(rawPricingData);

  // 1. Create a fast lookup map for variants.
  // Key: "w{width}_l{length}_c{color}", e.g., "w2.0_l36.0_black"
  const variantMap = new Map();
  variants.forEach((variant) => {
    // Normalize values for consistent key creation
    const widthKey = parseFloat(variant.width).toFixed(1);
    const lengthKey = parseFloat(variant.length).toFixed(1);
    const key = `w${widthKey}_l${lengthKey}_c${variant.color}`;
    variantMap.set(key, variant);
  });

  // 2. Extract unique options for UI controls, ensuring they are sorted numerically.
  const uniqueWidths = [
    ...new Set(variants.map((v) => parseFloat(v.width))),
  ].sort((a, b) => a - b);
  const uniqueLengths = [
    ...new Set(variants.map((v) => parseFloat(v.length))),
  ].sort((a, b) => a - b);
  // Manually add 'none' as an option and ensure 'black' and 'grey' follow.
  const uniqueColors = ["none", "black", "grey"];

  // 3. Define the available environments. These are static.
  const environments = [
    {
      id: "lift2",
      name: "2 Pole Boat Lift",
      poles: 2,
      image: selectLift2Img,
    },
    {
      id: "lift4",
      name: "4 Pole Boat Lift",
      poles: 4,
      image: selectLift4Img,
    },
  ];

  // 4. Define the UI options in a format the components can easily use.
  const options = {
    widths: uniqueWidths.map((w) => ({
      value: w, // The raw number value
      label: `${w}"`, // The display label
    })),
    lengths: uniqueLengths.map((l) => ({
      value: l,
      label: `${l}"`,
    })),
    colors: uniqueColors.map((c) => ({
      id: c,
      name: c.toUpperCase(),
    })),
  };

  /**
   * Finds a specific product variant based on the configuration.
   * @param {object} config - The selected configuration {width, length, color}.
   * @returns {object|null} The found variant object or null.
   */
  const findVariant = (config) => {
    if (!config || config.color === "none") {
      return null; // No variant if color is 'none'
    }
    const key = `w${config.width.toFixed(1)}_l${config.length.toFixed(1)}_c${
      config.color
    }`;
    return variantMap.get(key) || null;
  };

  return {
    environments,
    options,
    findVariant,
  };
}

// Process the data once and export the results for the app to use.
export const { environments, options, findVariant } = processData();
