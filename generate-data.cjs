const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const inputFilePath = path.join(__dirname, "pricing_data.csv");
const outputFilePath = path.join(__dirname, "src/data", "pricing_data.json");

const productsData = {};
const variants = [];

// --- NEW: Define the environments we need to generate image paths for ---
const ENVIRONMENTS = ["lift2", "lift4"];
const IMAGE_EXTENSION = "jpg"; // Set the image extension here

console.log("Starting data conversion from CSV...");

/**
 * --- NEW: Helper function to sanitize values for the filename ---
 * This function takes a type ('width' or 'length') and a value
 * and returns the formatted string as per your naming convention.
 * @param {string} type - 'width' or 'length'
 * @param {string} value - The raw value, e.g., "2.5"" or "36.0""
 * @returns {string} The sanitized part of the filename, e.g., "w2p5" or "l36"
 */
function sanitizeForFilename(type, value) {
  if (type === "width") {
    // Converts "2.5"" -> "w2p5" or "2.0"" -> "w2"
    const sanitized = String(value).replace('"', "").replace(".", "p");
    const final = sanitized.endsWith("p0") ? sanitized.slice(0, -2) : sanitized;
    return `w${final}`;
  }
  if (type === "length") {
    // Converts "36.0"" -> "l36"
    const intValue = parseInt(value, 10);
    return `l${intValue}`;
  }
  return value;
}

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
    const colorRaw = row["11"];
    const description = row["12"];
    const shop = row["16"];
    const flatRateRaw = row["17"];
    const variantId = row["25"];

    // Skip any rows that don't seem to be valid PolePads
    if (productName !== "PolePad" || !variantName) {
      return;
    }

    // --- Data Cleaning ---
    const salePrice =
      parseFloat(String(salePriceRaw).replace(/[^0-9.-]+/g, "")) || 0;
    const retailPrice =
      parseFloat(String(retailPriceRaw).replace(/[^0-9.-]+/g, "")) || salePrice;
    const flatRate =
      parseFloat(String(flatRateRaw).replace(/[^0-g.-]+/g, "")) || 0;
    const color = String(colorRaw).trim().toLowerCase() || "none";

    // Normalize width and length strings
    const width = `${parseFloat(widthRaw).toFixed(1)}"`; // Format to "X.X""
    const length = `${parseFloat(lengthRaw).toFixed(1)}"`; // Format to "X.X""

    if (
      sku &&
      salePrice > 0 &&
      width &&
      length &&
      color &&
      (color === "black" || color === "grey")
    ) {
      // --- NEW: Generate Image Paths ---
      const sanitizedWidth = sanitizeForFilename("width", width);
      const sanitizedLength = sanitizeForFilename("length", length);

      const imagePaths = {};
      for (const env of ENVIRONMENTS) {
        // Construct the full Cloudinary Public ID without the folder
        const publicId = `renders/${env}_${color}_${sanitizedWidth}_${sanitizedLength}`;
        // Store it in the imagePaths object. We don't add the extension here,
        // as Cloudinary handles that. The React app will add the folder.
        imagePaths[env] = publicId;
      }

      const variant = {
        sku,
        variantName,
        price: salePrice,
        retailPrice,
        width,
        length,
        color,
        description,
        shop,
        flatRate,
        variantId,
        imagePaths,
      };

      variants.push(variant);
    }
  })
  .on("end", () => {
    console.log("CSV file processed. Finalizing JSON structure...");

    // This loop structure is from your original script. It assigns numeric keys.
    for (const varId in variants) {
      productsData[varId] = variants[varId];
    }

    // Ensure the output directory exists
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(productsData, null, 2));
    console.log(`✅ Success! Data has been written to ${outputFilePath}`);
    console.log(`Total variants processed: ${variants.length}`);
  });
