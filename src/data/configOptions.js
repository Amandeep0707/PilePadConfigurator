import selectTrailerImg from "../assets/trailer.jpeg";
import selectLift2Img from "../assets/2_pole_lift.jpeg";
import selectLift4Img from "../assets/4_pole_lift.jpeg";

export const environments = [
  {
    id: "trailer",
    name: "Boat Trailer",
    poles: 2,
    image: selectTrailerImg,
    basePrice: 125.0, // Base price for the trailer itself
  },
  {
    id: "lift2",
    name: "2 Pole Boat Lift",
    poles: 2,
    image: selectLift2Img,
    basePrice: 150.0, // Base price for the 2-pole lift
  },
  {
    id: "lift4",
    name: "4 Pole Boat Lift",
    poles: 4,
    image: selectLift4Img,
    basePrice: 220.0, // Base price for the 4-pole lift
  },
];

// Helper to generate the length options for lifts
const generateLiftLengths = () => {
  const lengths = [];
  // From 7' to 20' in 0.5' increments
  for (let feet = 7; feet <= 20; feet += 0.5) {
    const inches = feet * 12;
    lengths.push({
      value: `${inches}`,
      label: `${inches}" (${feet.toFixed(1)}')`,
    });
  }
  return lengths;
};

export const options = {
  trailer: {
    widths: ['2"', '2.5"', '3.0"', '3.5"', '4.0"', '4.5"'],
    lengths: ['36"', '42"', '48"', '54"', '60"', '66"', '72"'].map((l) => ({
      value: l.replace('"', ""), // e.g., "36"
      label: l, // e.g., "36""
    })),
  },
  lift: {
    widths: ['2"', '2.5"', '3.0"', '3.5"', '4.0"', '4.5"'],
    lengths: generateLiftLengths(),
  },
  colors: [
    { id: "none", name: "NONE" },
    { id: "black", name: "BLACK" },
    { id: "grey", name: "GREY" },
  ],
};

const BASE_SLEEVE_ADDON_COST = 10.0;
const PRICE_PER_INCH_WIDTH = 10.0;
const PRICE_PER_FOOT_LENGTH = 5.0;

function calculateSleeveAddonCost(width, length) {
  const numericWidth = parseFloat(width);
  const numericLengthInches = parseInt(length);
  const numericLengthFeet = numericLengthInches / 12;

  const widthModifier = (numericWidth - 2) * PRICE_PER_INCH_WIDTH;
  const lengthModifier = (numericLengthFeet - 7) * PRICE_PER_FOOT_LENGTH;

  const finalCost = BASE_SLEEVE_ADDON_COST + widthModifier + lengthModifier;

  return Math.max(BASE_SLEEVE_ADDON_COST, finalCost);
}

export const pricing = {
  calculateSleeveAddonCost,
};
