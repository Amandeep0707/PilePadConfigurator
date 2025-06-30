import os
import shutil
from PIL import Image, ImageDraw, ImageFont

# --- CONFIGURATION ---
OUTPUT_DIR = 'renders'
PLACEHOLDER_IMAGE_NAME = 'placeholder.jpg'

# This data is replicated from src/data/configOptions.js
ENVIRONMENTS = ['trailer', 'lift2', 'lift4']
COLORS = ['none', 'black', 'grey']

def generate_lift_lengths():
    """Generates the length options for lifts from 7' to 20'."""
    lengths = []
    # Use integers to avoid floating point issues by doubling the values
    for i in range(7 * 2, 20 * 2 + 1):
        feet = i / 2.0
        inches = int(feet * 12)
        # Format: "144\" (12.0')"
        lengths.append(f'{inches}" ({feet:.1f}\')')
    return lengths

SIZES = {
    'trailer': {
        'widths': ["2\"", "2.5\"", "3.0\"", "3.5\"", "4.0\"", "4.5\""],
        'lengths': ["36\"", "42\"", "48\"", "54\"", "60\"", "66\"", "72\""],
    },
    'lift': {
        'widths': ["2\"", "2.5\"", "3.0\"", "3.5\"", "4.0\"", "4.5\""],
        'lengths': generate_lift_lengths(),
    }
}

def sanitize_for_filename(type, value):
    """
    Replicates the exact sanitization logic from the JavaScript code.
    This is CRITICAL for matching the frontend's generated URLs.
    """
    if type == 'width':
        # Input: "2.5\"" -> Output: "w2p5"
        sanitized = value.replace('"', '').replace('.', 'p')
        # Handle cases like "3.0" which should be "w3", not "w3p0"
        if sanitized.endswith('p0'):
            sanitized = sanitized[:-2]
        return f'w{sanitized}'
    
    if type == 'length':
        # Input: "144\" (12.0')" -> Output: "l144"
        inches = value.split('"')[0]
        return f'l{inches}'
    
    return value

def create_placeholder_image():
    """Creates a basic placeholder image if one doesn't exist."""
    if os.path.exists(PLACEHOLDER_IMAGE_NAME):
        print(f"'{PLACEHOLDER_IMAGE_NAME}' already exists, using it.")
        return

    print(f"'{PLACEHOLDER_IMAGE_NAME}' not found. Creating a new one.")
    try:
        # Create a grey image
        img = Image.new('RGB', (800, 600), color='#4A4A4A')
        draw = ImageDraw.Draw(img)
        
        # Add text to the image
        try:
            # Try to use a common system font
            font = ImageFont.truetype("arial.ttf", 40)
        except IOError:
            # If not found, use a default font
            font = ImageFont.load_default()
            
        text = "Placeholder Render"
        # To get text size in Pillow 10+ use getbbox, older versions use textsize
        if hasattr(draw, 'getbbox'):
            _, _, text_width, text_height = draw.getbbox(text, font=font)
        else:
            text_width, text_height = draw.textsize(text, font=font)

        position = ((800 - text_width) / 2, (600 - text_height) / 2)
        draw.text(position, text, fill='#FFFFFF', font=font)
        
        img.save(PLACEHOLDER_IMAGE_NAME)
        print("Successfully created placeholder.png")
    except Exception as e:
        print(f"Error creating placeholder image: {e}")
        print("Please create a 'placeholder.png' image manually in the root directory.")
        exit(1)


def main():
    """Main function to generate all the render files."""
    print("--- Starting Render Generation Script ---")
    
    # 1. Ensure a placeholder image exists
    create_placeholder_image()

    # 2. Create the output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Output directory is '{OUTPUT_DIR}'")

    file_count = 0
    # 3. Loop through all combinations and create files
    for env in ENVIRONMENTS:
        # Determine if it's a trailer or lift to get the correct sizes
        size_key = 'trailer' if env == 'trailer' else 'lift'
        
        for color in COLORS:
            for width in SIZES[size_key]['widths']:
                for length in SIZES[size_key]['lengths']:
                    # Sanitize all parts for the filename
                    s_width = sanitize_for_filename('width', width)
                    s_length = sanitize_for_filename('length', length)

                    # Construct the final filename
                    filename = f"{env}_{color}_{s_width}_{s_length}.jpg"
                    destination_path = os.path.join(OUTPUT_DIR, filename)
                    
                    # Copy the placeholder to the new destination
                    shutil.copy(PLACEHOLDER_IMAGE_NAME, destination_path)
                    file_count += 1

    print("\n--- Generation Complete! ---")
    print(f"Successfully created {file_count} render files in '{OUTPUT_DIR}'.")
    print("You can now test the configurator in your browser.")


if __name__ == '__main__':
    main()