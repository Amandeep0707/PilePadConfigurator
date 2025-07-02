import os
import json
import shutil
from PIL import Image, ImageDraw, ImageFont

# --- CONFIGURATION ---
OUTPUT_DIR = 'renders'
# The single source of truth for all product variants
PRICING_DATA_FILE = 'src/data/pricing_data.json' 
# The placeholder image to be copied
PLACEHOLDER_IMAGE_NAME = 'src/assets/Placeholder.jpg' 
# The environments we need to generate renders for
ENVIRONMENTS = ['lift2', 'lift4'] 

def create_placeholder_image():
    """Creates a basic placeholder image if one doesn't exist."""
    if os.path.exists(PLACEHOLDER_IMAGE_NAME):
        # print(f"'{PLACEHOLDER_IMAGE_NAME}' already exists, using it.")
        return

    print(f"'{PLACEHOLDER_IMAGE_NAME}' not found. Creating a new one.")
    try:
        img = Image.new('RGB', (1280, 720), color='#DDDDDD')
        draw = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.truetype("arial.ttf", 50)
        except IOError:
            font = ImageFont.load_default()
            
        text = "Placeholder Render"
        # Use getbbox for modern Pillow versions
        if hasattr(draw, 'getbbox'):
            _, _, text_width, text_height = draw.getbbox(text, font=font)
        else: # Fallback for older versions
            text_width, text_height = draw.textsize(text, font=font)

        position = ((img.width - text_width) / 2, (img.height - text_height) / 2)
        draw.text(position, text, fill='#555555', font=font)
        
        img.save(PLACEHOLDER_IMAGE_NAME)
        print(f"Successfully created '{PLACEHOLDER_IMAGE_NAME}'")
    except Exception as e:
        print(f"Error creating placeholder image: {e}")
        print(f"Please create a '{PLACEHOLDER_IMAGE_NAME}' image manually in the root directory.")
        exit(1)

def load_variants_from_json():
    """Loads and returns the list of variants from the JSON file."""
    try:
        with open(PRICING_DATA_FILE, 'r') as f:
            data = json.load(f)
        # The data is a dictionary of objects, we need the values
        return list(data.values())
    except FileNotFoundError:
        print(f"Error: Pricing data file not found at '{PRICING_DATA_FILE}'")
        print("Please ensure the path is correct and the file exists.")
        exit(1)
    except json.JSONDecodeError:
        print(f"Error: Could not parse JSON from '{PRICING_DATA_FILE}'")
        print("Please ensure it is a valid JSON file.")
        exit(1)

def main():
    """Main function to generate render files based on pricing_data.json."""
    print("--- Starting Render Generation Script (from JSON) ---")
    
    # 1. Ensure a placeholder image exists to be copied
    create_placeholder_image()

    # 2. Load all product variants from the single source of truth
    variants = load_variants_from_json()
    print(f"Loaded {len(variants)} product variants from '{PRICING_DATA_FILE}'.")

    # 3. Create the output directory, clearing it first for a clean slate
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
        print(f"Cleared existing '{OUTPUT_DIR}' directory.")
    os.makedirs(OUTPUT_DIR)
    print(f"Output directory is '{OUTPUT_DIR}'")

    file_count = 0
    generated_paths = set()

    # 4. Loop through each variant and generate the necessary render files
    for variant in variants:
        # The imagePaths object tells us which files to create for this variant
        image_paths_to_create = variant.get('imagePaths', {})
        
        for env in ENVIRONMENTS:
            if env in image_paths_to_create:
                # Get the relative path, e.g., "renders/lift2_black_w2_l36"
                relative_path = image_paths_to_create[env]
                
                # We only need the filename part
                filename = f"{os.path.basename(relative_path)}.jpg"
                destination_path = os.path.join(OUTPUT_DIR, filename)

                # Avoid duplicating work if multiple variants point to the same image
                if destination_path not in generated_paths:
                    shutil.copy(PLACEHOLDER_IMAGE_NAME, destination_path)
                    generated_paths.add(destination_path)
                    file_count += 1

    # Also create the fallback and base images the frontend expects
    print("\nCreating essential fallback and base images...")
    base_images_to_create = ["fallback.jpg"]
    for env in ENVIRONMENTS:
        base_images_to_create.append(f"{env}_base.jpg")

    for relative_path in base_images_to_create:
        filename = os.path.basename(relative_path)
        destination_path = os.path.join(OUTPUT_DIR, filename)
        if destination_path not in generated_paths:
            shutil.copy(PLACEHOLDER_IMAGE_NAME, destination_path)
            generated_paths.add(destination_path)
            file_count += 1

    print("\n--- Generation Complete! ---")
    print(f"Successfully created {file_count} unique render files in '{OUTPUT_DIR}'.")
    print("You can now upload this folder's contents to Cloudinary.")


if __name__ == '__main__':
    main()