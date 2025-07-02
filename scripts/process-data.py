import json
import os

# --- CONFIGURATION ---
INPUT_JSON_PATH = '../src/data/pricing_data.json'
OUTPUT_JSON_PATH = '../src/data/pricing_data.json' 

ENVIRONMENTS = ['lift2', 'lift4']
COLORS_TO_GENERATE = ['none', 'black', 'grey']

def sanitize_for_filename(type, value_str):
    try:
        if type == 'width':
            # "2.5"" -> "w2p5" or "2.0"" -> "w2"
            sanitized = value_str.replace('"', '').replace('.', 'p')
            if sanitized.endswith('p0'):
                sanitized = sanitized[:-2]
            return f'w{sanitized}'
        
        if type == 'length':
            # "36.0"" -> "l36"
            # Parse the float first to handle ".0", then convert to int
            parsed_float = float(value_str.replace('"', ''))
            return f'l{int(parsed_float)}'
            
    except (ValueError, TypeError):
        return ""
    return value_str

def transform_pricing_data():
    print(f"--- Starting Data Transformation ---")
    print(f"Reading variants from: {INPUT_JSON_PATH}")

    try:
        with open(INPUT_JSON_PATH, 'r') as f:
            original_data = json.load(f)
        variants = list(original_data.values())
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error reading input file: {e}")
        return

    size_variant_map = {}
    for variant in variants:
        size_key = f"w{variant['width']}_l{variant['length']}"
        
        if size_key not in size_variant_map:
            base_variant = {k: v for k, v in variant.items() if k != 'color'}
            size_variant_map[size_key] = base_variant

    print(f"Found {len(size_variant_map)} unique sizes from {len(variants)} total variants.")

    final_variants = []
    for variant in size_variant_map.values():
        sanitized_width = sanitize_for_filename('width', variant['width'])
        sanitized_length = sanitize_for_filename('length', variant['length'])
        
        new_image_paths = {}
        for env in ENVIRONMENTS:
            for color in COLORS_TO_GENERATE:
                # e.g., key becomes "lift2Black" or "lift4None"
                image_path_key = f"{env}{color.capitalize()}"
                
                # e.g., value becomes "renders/lift2_black_w2p5_l144"
                public_id = f"renders/{env}_{color}_{sanitized_width}_{sanitized_length}"
                
                new_image_paths[image_path_key] = public_id
        
        variant['imagePaths'] = new_image_paths
        final_variants.append(variant)

    final_data_object = {str(i): variant for i, variant in enumerate(final_variants)}

    try:
        output_dir = os.path.dirname(OUTPUT_JSON_PATH)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        with open(OUTPUT_JSON_PATH, 'w') as f:
            json.dump(final_data_object, f, indent=2)
        print(f"\n--- Transformation Complete! ---")
        print(f"Successfully wrote {len(final_variants)} de-duplicated variants to: {OUTPUT_JSON_PATH}")
    except IOError as e:
        print(f"Error writing to output file: {e}")

if __name__ == '__main__':
    transform_pricing_data()