// You will need to get these images from the presentation slides
// and place them in src/assets/
import selectTrailerImg from "../assets/trailer.jpeg";
import selectLift2Img from "../assets/2_pole_lift.jpeg";
import selectLift4Img from "../assets/4_pole_lift.jpeg";

// Based on the price from the slide: $717.00 / 4 poles = $179.25 per pole
const PRICE_PER_POLE = 179.25;
export const RENDER_EXTENSION = "jpg";

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

// Helper to generate the length options for lifts
const generateLiftLengths = () => {
  const lengths = [];
  // From 7' to 20' in 0.5' increments
  for (let feet = 7; feet <= 20; feet += 0.5) {
    const inches = feet * 12;
    // Format as: 84" (7.0')
    lengths.push(`${inches}" (${feet.toFixed(1)}')`);
  }
  return lengths;
};

export const options = {
  trailer: {
    widths: ['2"', '2.5"', '3.0"', '3.5"', '4.0"', '4.5"'],
    lengths: ['36"', '42"', '48"', '54"', '60"', '66"', '72"'],
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

export const pricing = {
  perPole: PRICE_PER_POLE,
};
