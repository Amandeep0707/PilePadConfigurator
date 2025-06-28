// rename-script.cjs
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

// Load environment variables from .env
dotenv.config();

// Configure with your credentials
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function bulkRename() {
  console.log("Starting bulk rename process...");
  try {
    let nextCursor = null;
    let processedCount = 0;
    const folderName = "renders/";

    do {
      console.log(
        nextCursor
          ? `Fetching next batch... (cursor: ${nextCursor})`
          : "Fetching first batch of assets..."
      );

      // Fetch a batch of assets from the specified folder
      const { resources, next_cursor } = await cloudinary.api.resources({
        type: "upload",
        prefix: folderName,
        max_results: 500, // Fetch up to 500 at a time
        next_cursor: nextCursor, // Use the cursor to get the next page
      });

      if (resources.length === 0) {
        console.log("No more assets to process in this batch.");
        break;
      }

      console.log(`Found ${resources.length} assets in this batch to process.`);

      for (const resource of resources) {
        processedCount++;
        const oldPublicId = resource.public_id;

        // NEW LOGIC: Remove the folder prefix before processing
        const filename = oldPublicId.substring(folderName.length);

        // Regex to find a suffix of `_` followed by 6 random alphanumeric characters
        const suffixRegex = /_[a-z0-9]{6}$/;

        if (suffixRegex.test(filename)) {
          // NEW LOGIC: Generate the new Public ID without the folder prefix
          const newPublicIdWithoutFolder = filename.replace(suffixRegex, "");
          const newPublicId = `${folderName}${newPublicIdWithoutFolder}`; // Add the folder back on

          console.log(
            `[${processedCount}] Renaming: ${oldPublicId}  ->  ${newPublicId}`
          );

          await cloudinary.uploader.rename(oldPublicId, newPublicId);
        } else {
          console.log(
            `[${processedCount}] Skipping (no suffix): ${oldPublicId}`
          );
        }
      }

      // Set the cursor for the next iteration
      nextCursor = next_cursor;
    } while (nextCursor); // Continue looping as long as Cloudinary provides a 'next_cursor'

    console.log(
      `\nBulk rename completed successfully! Total assets processed: ${processedCount}`
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

bulkRename();
