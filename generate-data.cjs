const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const inputFilePath = path.join(__dirname, "pricing_data.csv");
const outputFilePath = path.join(__dirname, "src/data", "pricing_data.json");

const productsData = {};

const environments = {
  lift2: {
    id: "lift2",
    name: "2 Pole Boat Lift",
    image: "/assets/2_pole_lift.jpeg",
    poles: 2,
    variants: [],
    optionValues: { widths: new Set(), lengths: new Set(), colors: new Set() },
  },
  lift4: {
    id: "lift4",
    name: "4 Pole Boat Lift",
    image: "/assets/4_pole_lift.jpeg",
    poles: 4,
    variants: [],
    optionValues: { widths: new Set(), lengths: new Set(), colors: new Set() },
  },
};

console.log("Starting data conversion from CSV...");

fs.createReadStream(inputFilePath)
  .pipe(csv({ headers: false }))
  .on("data", (row) => {
    const productName = row["0"];
    const variantName = row["1"];
    const sku = row["2"];
    const retailPriceRaw = row["3"];
    const salePriceRaw = row["4"];
    const lengthRaw = row["5"];
    const widthRaw = row["6"];
    const colorRaw = row["12"];
    const description = row["13"];

    // Skip any rows that don't seem to be valid PolePads
    if (productName !== "PolePad" || !variantName) {
      return;
    }

    // --- Data Cleaning ---
    const salePrice =
      parseFloat(String(salePriceRaw).replace(/[^0-9.-]+/g, "")) || 0;
    const retailPrice =
      parseFloat(String(retailPriceRaw).replace(/[^0-9.-]+/g, "")) || salePrice;
    const color = String(colorRaw).trim().toLowerCase() || "none";
    const width = `${parseFloat(widthRaw).toFixed(1)}"`; // Format to "X.X""
    const length = String(lengthRaw).trim();

    if (sku && salePrice > 0 && width && length && color) {
      const variant = {
        sku,
        variantName,
        description,
        price: salePrice,
        retailPrice,
        width,
        length,
        color,
      };

      environments.lift2.variants.push(variant);
      environments.lift4.variants.push(variant);

      // Collect unique option values for both
      environments.lift2.optionValues.widths.add(width);
      environments.lift2.optionValues.lengths.add(length);
      environments.lift2.optionValues.colors.add(color);

      environments.lift4.optionValues.widths.add(width);
      environments.lift4.optionValues.lengths.add(length);
      environments.lift4.optionValues.colors.add(color);
    }
  })
  .on("end", () => {
    console.log("CSV file processed. Finalizing JSON structure...");

    for (const envId in environments) {
      const env = environments[envId];
      const options = env.optionValues;

      env.options = {
        widths: Array.from(options.widths).sort(
          (a, b) => parseFloat(a) - parseFloat(b)
        ),
        lengths: Array.from(options.lengths)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((l) => ({ value: l, label: `${l}"` })),
        colors: Array.from(options.colors).sort((a, b) =>
          a === "black" ? -1 : 1
        ),
      };

      delete env.optionValues;
      productsData[envId] = env;
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(productsData, null, 2));
    console.log(`✅ Success! Data has been written to ${outputFilePath}`);
  });
