import base64
from PIL import Image, ImageDraw
import io
import random

def img_to_base64(img):
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

def create_block(colors):
    img = Image.new('RGB', (16, 16))
    pixels = img.load()
    for x in range(16):
        for y in range(16):
            pixels[x, y] = random.choice(colors)
    return img_to_base64(img)

# Colors from standard MC palette
dirt_colors = [(134, 96, 67), (119, 85, 59), (145, 103, 73), (121, 86, 60)]
grass_side_colors = [(134, 96, 67), (119, 85, 59), (71, 106, 52), (89, 133, 65)]
wood_colors = [(162, 130, 81), (175, 140, 90), (150, 120, 75)]
iron_colors = [(216, 216, 216), (180, 180, 180), (145, 145, 145), (212, 175, 55)] # Iron Ore
leaves_colors = [(60, 100, 30), (50, 90, 25), (40, 80, 20)]
water_colors = [(63, 118, 228), (50, 100, 200), (70, 130, 240)]

def create_grass_side():
    img = Image.new('RGB', (16, 16))
    pixels = img.load()
    for x in range(16):
        for y in range(16):
            if y < 4:
                pixels[x, y] = random.choice([(71, 106, 52), (89, 133, 65)])
            elif y < 6 and random.random() > 0.5:
                pixels[x, y] = random.choice([(71, 106, 52), (89, 133, 65)])
            else:
                pixels[x, y] = random.choice(dirt_colors)
    return img_to_base64(img)

def create_log_side():
    img = Image.new('RGB', (16, 16))
    pixels = img.load()
    for x in range(16):
        for y in range(16):
            if x in [0, 1, 14, 15]:
                pixels[x, y] = (60, 40, 20)
            else:
                pixels[x, y] = (100, 70, 40) if (x+y)%4 != 0 else (80, 55, 30)
    return img_to_base64(img)

def create_glass():
    img = Image.new('RGBA', (16, 16), (255, 255, 255, 30))
    draw = ImageDraw.Draw(img)
    # Highlight streaks
    draw.line((2, 2, 5, 5), fill=(255, 255, 255, 150))
    draw.line((10, 10, 13, 13), fill=(255, 255, 255, 100))
    # Border
    for i in range(16):
        img.putpixel((i, 0), (200, 200, 255, 100))
        img.putpixel((i, 15), (200, 200, 255, 100))
        img.putpixel((0, i), (200, 200, 255, 100))
        img.putpixel((15, i), (200, 200, 255, 100))
    return img_to_base64(img)

def create_sword():
    img = Image.new('RGBA', (16, 16), (0,0,0,0))
    # Blade
    for i in range(8):
        x, y = 14-i, i+1
        img.putpixel((x, y), (200, 200, 200, 255))
        img.putpixel((x+1, y), (230, 230, 230, 255))
        img.putpixel((x, y-1), (170, 170, 170, 255))
    # Guard
    for x, y in [(5, 10), (6, 9), (6, 10), (6, 11), (5, 9), (7, 9)]:
        img.putpixel((x, y), (139, 69, 19, 255))
    for x, y in [(9, 6), (10, 5), (10, 6), (11, 6), (9, 5), (9, 7)]:
        img.putpixel((x, y), (139, 69, 19, 255))
    # Handle
    for i in range(4):
        img.putpixel((i+1, 14-i), (101, 67, 33, 255))
    return img_to_base64(img)

def create_pickaxe():
    img = Image.new('RGBA', (16, 16), (0,0,0,0))
    # Head
    for x in range(16):
        y = abs(x-8) // 2
        if x < 13 and x > 2:
           img.putpixel((x, y), (200, 200, 200, 255))
           img.putpixel((x, y+1), (150, 150, 150, 255))
    # Handle
    for i in range(12):
        img.putpixel((8, i+2), (101, 67, 33, 255))
    # Rotate to diagonal
    img = img.rotate(-45)
    return img_to_base64(img)

print(f"export const dirtImg = 'data:image/png;base64,{create_block(dirt_colors)}'")
print(f"export const grassImg = 'data:image/png;base64,{create_grass_side()}'")
print(f"export const glassImg = 'data:image/png;base64,{create_glass()}'")
print(f"export const woodImg = 'data:image/png;base64,{create_block(wood_colors)}'")
print(f"export const ironImg = 'data:image/png;base64,{create_block(iron_colors)}'")
print(f"export const leavesImg = 'data:image/png;base64,{create_block(leaves_colors)}'")
print(f"export const waterImg = 'data:image/png;base64,{create_block(water_colors)}'")
print(f"export const logImg = 'data:image/png;base64,{create_log_side()}'")
print(f"export const swordImg = 'data:image/png;base64,{create_sword()}'")
print(f"export const pickaxeImg = 'data:image/png;base64,{create_pickaxe()}'")
print(f"export const groundImg = grassImg")
