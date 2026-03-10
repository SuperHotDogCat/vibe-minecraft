import base64
from PIL import Image, ImageDraw
import io
import random

def img_to_base64(img):
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

def create_sword():
    img = Image.new('RGBA', (16, 16), (0,0,0,0))
    # Blade
    for i in range(8):
        img.putpixel((15-i, i), (200, 200, 200, 255))
        img.putpixel((14-i, i+1), (150, 150, 150, 255))
    # Guard
    img.putpixel((7, 8), (139, 69, 19, 255))
    img.putpixel((8, 7), (139, 69, 19, 255))
    img.putpixel((6, 9), (139, 69, 19, 255))
    # Handle
    for i in range(3):
        img.putpixel((5-i, 10+i), (101, 67, 33, 255))
    return img_to_base64(img)

def create_pickaxe():
    img = Image.new('RGBA', (16, 16), (0,0,0,0))
    # Head
    for i in range(6):
        img.putpixel((15-i, i), (150, 150, 150, 255))
        img.putpixel((14-i, i+1), (150, 150, 150, 255))
        img.putpixel((i, 15-i), (150, 150, 150, 255))
        img.putpixel((i+1, 14-i), (150, 150, 150, 255))
    # Handle
    for i in range(10):
        img.putpixel((i+3, i+3), (139, 69, 19, 255))
    return img_to_base64(img)

sword = create_sword()
pickaxe = create_pickaxe()
print(f"export const swordImg = 'data:image/png;base64,{sword}'")
print(f"export const pickaxeImg = 'data:image/png;base64,{pickaxe}'")
