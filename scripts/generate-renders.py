import os
import json
import shutil
from PIL import Image, ImageDraw, ImageFont

# This script is temporary, just for creating placeholders.

# --- CONFIGURATION ---
OUTPUT_DIR = 'renders'
PRICING_DATA_FILE = './src/data/pricing_data.json'
PLACEHOLDER_IMAGE_NAME = './src/assets/Placeholder.jpg'
ENVIRONMENTS = ['lift2', 'lift4']
IMAGE_EXTENSION = 'jpg'

def create_placeholder_image():

    assets_dir = os.path.dirname(PLACEHOLDER_IMAGE_NAME)
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)
        print(f"Created assets directory at '{assets_dir}'")

    if os.path.exists(PLACEHOLDER_IMAGE_NAME):
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
        if hasattr(draw, 'getbbox'):
            _, _, text_width, text_height = draw.getbbox(text, font=font)
        else:
            text_width, text_height = draw.textsize(text, font=font)

        position = ((img.width - text_width) / 2, (img.height - text_height) / 2)
        draw.text(position, text, fill='#555555', font=font)
        
        img.save(PLACEHOLDER_IMAGE_NAME)
        print(f"Successfully created '{PLACEHOLDER_IMAGE_NAME}'")
    except Exception as e:
        print(f"Error creating placeholder image: {e}")
        exit(1)

def load_variants_from_json():
    try:
        with open(PRICING_DATA_FILE, 'r') as f:
            data = json.load(f)
        return list(data.values())
    except FileNotFoundError:
        print(f"Error: Pricing data file not found at '{PRICING_DATA_FILE}'")
        exit(1)
    except json.JSONDecodeError:
        print(f"Error: Could not parse JSON from '{PRICING_DATA_FILE}'")
        exit(1)

def main():

    print("--- Starting Render Generation Script ---")
    
    create_placeholder_image()

    variants = load_variants_from_json()
    print(f"Loaded {len(variants)} unique product sizes from '{PRICING_DATA_FILE}'.")

    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
        print(f"Cleared existing '{OUTPUT_DIR}' directory.")
    os.makedirs(OUTPUT_DIR)
    print(f"Output directory is '{OUTPUT_DIR}'")

    generated_paths = set()

    for variant in variants:
        image_paths_dict = variant.get('imagePaths', {})

        for path_value in image_paths_dict.values():
            filename = f"{os.path.basename(path_value)}.{IMAGE_EXTENSION}"
            destination_path = os.path.join(OUTPUT_DIR, filename)

            if destination_path not in generated_paths:
                shutil.copy(PLACEHOLDER_IMAGE_NAME, destination_path)
                generated_paths.add(destination_path)

    print("\nCreating essential fallback and base images...")
    base_images_to_create = [
        f"fallback.{IMAGE_EXTENSION}",
        f"lift2_base.{IMAGE_EXTENSION}",
        f"lift4_base.{IMAGE_EXTENSION}"
    ]

    for filename in base_images_to_create:
        destination_path = os.path.join(OUTPUT_DIR, filename)
        if destination_path not in generated_paths:
            shutil.copy(PLACEHOLDER_IMAGE_NAME, destination_path)
            generated_paths.add(destination_path)
    
    file_count = len(generated_paths)
    print("\n--- Generation Complete! ---")
    print(f"Successfully created {file_count} unique render files in '{OUTPUT_DIR}'.")
    print("You can now upload this folder's contents to Cloudinary.")


if __name__ == '__main__':
    main()