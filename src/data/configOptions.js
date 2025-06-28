import selectTrailerImg from "../assets/trailer.jpeg";
import selectLift2Img from "../assets/2_pole_lift.jpeg";
import selectLift4Img from "../assets/4_pole_lift.jpeg";

export const environments = [
  {
    id: "trailer",
    name: "Boat Trailer",
    poles: 2,
    image: selectTrailerImg,
  },
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

// ... generateLiftLengths function remains the same ...
const generateLiftLengths = () => {
  const lengths = [];
  // From 7' to 20' in 0.5' increments
  for (let feet = 7; feet <= 20; feet += 0.5) {
    const inches = feet * 12;
    // Store as an object with a value (for internal use) and a label (for display)
    lengths.push({
      value: `${inches}`, // The value is just the inches, e.g., "192"
      label: `${inches}" (${feet.toFixed(1)}')`, // The label is for the user, e.g., "192" (16.0')"
    });
  }
  return lengths;
};

export const options = {
  trailer: {
    widths: ['2"', '2.5"', '3.0"', '3.5"', '4.0"', '4.5"'],
    // Also convert trailer lengths to the new object format for consistency
    lengths: ['36"', '42"', '48"', '54"', '60"', '66"', '72"'].map((l) => ({
      value: l.replace('"', ""), // e.g., "36"
      label: l, // e.g., "36""
    })),
  },
  // Options are the same for 2 and 4 pole lifts
  lift: {
    widths: ['2"', '2.5"', '3.0"', '3.5"', '4.0"', '4.5"'],
    lengths: generateLiftLengths(),
  },
  colors: [
    { id: "black", name: "BLACK" },
    { id: "grey", name: "GREY" },
  ],
};

// --- NEW: Realistic Pricing Model ---
const BASE_PRICE_PER_POLE = 150.0; // A base price for the smallest size
const PRICE_PER_INCH_WIDTH = 10.0; // Extra cost for each inch of width over the minimum
const PRICE_PER_FOOT_LENGTH = 5.0; // Extra cost for each foot of length over the minimum

/**
 * Calculates the price per pole based on its dimensions.
 * @param {string} width - e.g., "3.5\""
 * @param {string} length - e.g., "144\" (12.0')"
 * @returns {number} The calculated price for a single pole.
 */
function calculatePricePerPole(width, length) {
  const numericWidth = parseFloat(width);
  // This will now correctly parse "192" instead of "192" (16.0')"
  const numericLengthInches = parseInt(length);
  const numericLengthFeet = numericLengthInches / 12;

  const widthModifier = (numericWidth - 2) * PRICE_PER_INCH_WIDTH;
  const lengthModifier = (numericLengthFeet - 7) * PRICE_PER_FOOT_LENGTH;

  const finalPrice = BASE_PRICE_PER_POLE + widthModifier + lengthModifier;

  return Math.max(BASE_PRICE_PER_POLE, finalPrice);
}

export const pricing = {
  calculatePricePerPole,
};
