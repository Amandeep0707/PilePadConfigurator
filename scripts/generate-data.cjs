const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const inputFilePath = path.join(__dirname, "../pricing_data.csv");
const outputFilePath = path.join(__dirname, "../src/data", "client_data.json");

const ENVIRONMENTS = ["lift2", "lift4"];
const COLORS_TO_GENERATE = ["black", "grey", "none"];

console.log("Starting data conversion from CSV...");

function sanitizeForFilename(type, value) {
  if (type === "width") {
    const sanitized = String(value).replace('"', "").replace(".", "p");
    const final = sanitized.endsWith("p0") ? sanitized.slice(0, -2) : sanitized;
    return `w${final}`;
  }
  if (type === "length") {
    const intValue = parseInt(value, 10);
    return `l${intValue}`;
  }
  return value;
}

const sizeVariantMap = new Map();

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

    if (productName !== "PolePad" || !variantName) {
      return;
    }

    const salePrice =
      parseFloat(String(salePriceRaw).replace(/[^0-9.-]+/g, "")) || 0;
    const retailPrice =
      parseFloat(String(retailPriceRaw).replace(/[^0-9.-]+/g, "")) || salePrice;
    const flatRate =
      parseFloat(String(flatRateRaw).replace(/[^0-9.-]+/g, "")) || 0;
    const color = String(colorRaw).trim().toLowerCase();

    const width = `${parseFloat(widthRaw).toFixed(1)}"`;
    const length = `${parseFloat(lengthRaw).toFixed(1)}"`;

    if (sku && salePrice > 0 && width && length) {
      const sizeKey = `${color}_w${width}_l${length}`;
      if (!sizeVariantMap.has(sizeKey)) {
        sizeVariantMap.set(sizeKey, {
          sku,
          variantName,
          price: salePrice,
          retailPrice,
          color,
          width,
          length,
          description,
          shop,
          flatRate,
          variantId,
          imagePaths: {},
        });
      }
      // If color is black, also add a 'none' color duplicate
      if (color === "black") {
        const noneSizeKey = `none_w${width}_l${length}`;
        if (!sizeVariantMap.has(noneSizeKey)) {
          sizeVariantMap.set(noneSizeKey, {
            sku,
            variantName: variantName.replace(/black/i, "none"),
            price: salePrice,
            retailPrice,
            color: "none",
            width,
            length,
            description,
            shop,
            flatRate,
            variantId,
            imagePaths: {},
          });
        }
      }
    }
  })
  .on("end", () => {
    console.log("CSV processing complete. Building final data structure...");

    const finalVariants = [];

    for (const [sizeKey, variant] of sizeVariantMap.entries()) {
      const sanitizedWidth = sanitizeForFilename("width", variant.width);
      const sanitizedLength = sanitizeForFilename("length", variant.length);

      for (const env of ENVIRONMENTS) {
        for (const color of COLORS_TO_GENERATE) {
          const imagePathKey = `${env}${
            color.charAt(0).toUpperCase() + color.slice(1)
          }`;

          const publicId = `renders/${env}_${color}_${sanitizedWidth}_${sanitizedLength}`;

          variant.imagePaths[imagePathKey] = publicId;
        }
      }
      finalVariants.push(variant);
    }

    const productsData = {};
    finalVariants.forEach((variant, index) => {
      productsData[index] = variant;
    });

    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(productsData, null, 2));
    console.log(`✅ Success! Data has been written to ${outputFilePath}`);
    console.log(
      `Total de-duplicated variants created: ${finalVariants.length}`
    );
  });
