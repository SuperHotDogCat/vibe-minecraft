import base64
from PIL import Image, ImageDraw
import io

def img_to_base64(img):
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

def create_block(base_color, noise_colors):
    img = Image.new('RGB', (16, 16), base_color)
    pixels = img.load()
    import random
    for x in range(16):
        for y in range(16):
            if random.random() < 0.3:
                pixels[x,y] = random.choice(noise_colors)
    return img_to_base64(img)

def create_grass():
    img = Image.new('RGB', (16, 16), (110, 70, 40)) # Dirt bottom
    pixels = img.load()
    for x in range(16):
        for y in range(5): # Grass top
            pixels[x, y] = (random_color((60, 140, 40), 20))
    # Add some hanging grass
    for x in range(16):
        if random.random() > 0.5:
            pixels[x, 5] = (random_color((60, 140, 40), 20))
    return img_to_base64(img)

def random_color(base, variance):
    import random
    return (
        max(0, min(255, base[0] + random.randint(-variance, variance))),
        max(0, min(255, base[1] + random.randint(-variance, variance))),
        max(0, min(255, base[2] + random.randint(-variance, variance)))
    )

import random

# Blocks
dirt = create_block((110, 75, 50), [(90, 60, 40), (130, 90, 60)])
grass = create_grass()
glass = Image.new('RGBA', (16, 16), (200, 240, 255, 100))
d = ImageDraw.Draw(glass)
d.line([(2,2), (6,6)], fill=(255, 255, 255, 200), width=1)
d.line([(10,10), (13,13)], fill=(255, 255, 255, 200), width=1)
glass_b64 = img_to_base64(glass)

wood = create_block((180, 140, 80), [(160, 120, 60), (200, 160, 100)])
log = Image.new('RGB', (16, 16), (100, 70, 40))
pixels = log.load()
for x in range(16):
    for y in range(16):
        if x in [0, 1, 14, 15] or y in [0, 1, 14, 15]:
             pixels[x,y] = (80, 50, 30)
log_b64 = img_to_base64(log)

water = create_block((40, 100, 200), [(30, 80, 180), (60, 120, 220)])
iron = create_block((150, 150, 150), [(130, 130, 130), (200, 190, 170)]) # Iron ore style
leaves = create_block((40, 110, 30), [(30, 90, 20), (50, 130, 40)])

# Tools
def create_sword():
    img = Image.new('RGBA', (16, 16), (0,0,0,0))
    d = ImageDraw.Draw(img)
    # Blade
    for i in range(8):
        img.putpixel((15-i, i), (200, 200, 200, 255))
        img.putpixel((14-i, i+1), (180, 180, 180, 255))
    # Crossguard
    img.putpixel((6, 9), (100, 70, 40, 255))
    img.putpixel((7, 8), (100, 70, 40, 255))
    img.putpixel((5, 10), (100, 70, 40, 255))
    # Handle
    img.putpixel((4, 11), (139, 69, 19, 255))
    img.putpixel((3, 12), (139, 69, 19, 255))
    return img_to_base64(img)

def create_pickaxe():
    img = Image.new('RGBA', (16, 16), (0,0,0,0))
    # Handle
    for i in range(10):
        img.putpixel((i+3, 15-i-3), (139, 69, 19, 255))
    # Head
    for i in range(5):
        img.putpixel((15-i, i), (150, 150, 150, 255))
        img.putpixel((i, 15-i), (150, 150, 150, 255))
    return img_to_base64(img)

sword = create_sword()
pickaxe = create_pickaxe()

print(f"export const dirtImg = 'data:image/png;base64,{dirt}'")
print(f"export const grassImg = 'data:image/png;base64,{grass}'")
print(f"export const glassImg = 'data:image/png;base64,{glass_b64}'")
print(f"export const woodImg = 'data:image/png;base64,{wood}'")
print(f"export const logImg = 'data:image/png;base64,{log_b64}'")
print(f"export const waterImg = 'data:image/png;base64,{water}'")
print(f"export const ironImg = 'data:image/png;base64,{iron}'")
print(f"export const leavesImg = 'data:image/png;base64,{leaves}'")
print(f"export const swordImg = 'data:image/png;base64,{sword}'")
print(f"export const pickaxeImg = 'data:image/png;base64,{pickaxe}'")
