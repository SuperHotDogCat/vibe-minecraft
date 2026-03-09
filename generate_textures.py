import base64
from PIL import Image, ImageDraw
import random
import io

def generate_noise_texture(color_base, filename):
    img = Image.new('RGB', (16, 16))
    pixels = img.load()
    for x in range(16):
        for y in range(16):
            r_off = random.randint(-20, 20)
            g_off = random.randint(-20, 20)
            b_off = random.randint(-20, 20)
            pixels[x, y] = (
                max(0, min(255, color_base[0] + r_off)),
                max(0, min(255, color_base[1] + g_off)),
                max(0, min(255, color_base[2] + b_off))
            )

    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return img_str

water = generate_noise_texture((30, 60, 200), "water.png")
iron = generate_noise_texture((180, 180, 180), "iron.png")
leaves = generate_noise_texture((40, 120, 40), "leaves.png")

print(f"export const waterImg = 'data:image/png;base64,{water}'")
print(f"export const ironImg = 'data:image/png;base64,{iron}'")
print(f"export const leavesImg = 'data:image/png;base64,{leaves}'")
