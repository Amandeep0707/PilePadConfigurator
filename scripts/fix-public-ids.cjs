const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config();

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

      const { resources, next_cursor } = await cloudinary.api.resources({
        type: "upload",
        prefix: folderName,
        max_results: 500,
        next_cursor: nextCursor,
      });

      if (resources.length === 0) {
        console.log("No more assets to process in this batch.");
        break;
      }

      console.log(`Found ${resources.length} assets in this batch to process.`);

      for (const resource of resources) {
        processedCount++;
        const oldPublicId = resource.public_id;

        const filename = oldPublicId.substring(folderName.length);

        const suffixRegex = /_[a-z0-9]{6}$/;

        if (suffixRegex.test(filename)) {
          const newPublicIdWithoutFolder = filename.replace(suffixRegex, "");
          const newPublicId = `${folderName}${newPublicIdWithoutFolder}`;

          console.log(
            `[${processedCount}] Renaming: ${oldPublicId}  ->  ${newPublicId}`
          );

          try {
            await cloudinary.uploader.rename(oldPublicId, newPublicId);
          } catch (error) {
            if (error.message.includes("already exists")) {
              console.log(
                `[${processedCount}] SKIPPING - ${newPublicId} already exists.`
              );
            } else {
              throw error;
            }
          }
        } else {
          console.log(
            `[${processedCount}] Skipping (no suffix): ${oldPublicId}`
          );
        }
      }

      nextCursor = next_cursor;
    } while (nextCursor);

    console.log(
      `\nBulk rename completed successfully! Total assets processed: ${processedCount}`
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

bulkRename();
