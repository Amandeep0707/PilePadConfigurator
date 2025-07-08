import rawPricingData from "./pricing_data.json";

function processData() {
  const variants = Object.values(rawPricingData);

  const variantMap = new Map();
  variants.forEach((variant) => {
    const widthKey = parseFloat(variant.width).toFixed(1);
    const lengthKey = parseFloat(variant.length).toFixed(1);
    const key = `w${widthKey}_l${lengthKey}`;

    if (!variantMap.has(key)) {
      variantMap.set(key, variant);
    }
  });

  const uniqueVariants = Array.from(variantMap.values());
  const uniqueWidths = [
    ...new Set(uniqueVariants.map((v) => parseFloat(v.width))),
  ].sort((a, b) => a - b);
  const uniqueLengths = [
    ...new Set(uniqueVariants.map((v) => parseFloat(v.length))),
  ].sort((a, b) => a - b);

  const environments = [
    {
      id: "lift2",
      name: "2 Pole Boat Lift",
      poles: 2,
      image: "lift2_base",
    },
    {
      id: "lift4",
      name: "4 Pole Boat Lift",
      poles: 4,
      image: "lift4_base",
    },
  ];

  const options = {
    widths: uniqueWidths.map((w) => ({
      value: w,
      label: `${w}"`,
    })),
    lengths: uniqueLengths.map((l) => ({
      value: l,
      label: `${l}"`,
    })),
    colors: [
      { id: "none", name: "NONE" },
      { id: "black", name: "BLACK" },
      { id: "grey", name: "GREY" },
    ],
  };

  /**
   * Finds a specific product variant based on the size configuration.
   * @param {object} config - The selected configuration {width, length}.
   * @returns {object|null} The found variant object or null.
   */
  const findVariant = (config) => {
    if (!config || !config.width || !config.length) {
      return null;
    }
    const key = `w${config.width.toFixed(1)}_l${config.length.toFixed(1)}`;
    return variantMap.get(key) || null;
  };

  return {
    environments,
    options,
    findVariant,
  };
}

export const { environments, options, findVariant } = processData();
