import base64
import sys

def image_to_base64(filepath):
    with open(filepath, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python to_b64.py <filepath>")
        sys.exit(1)
    print(image_to_base64(sys.argv[1]))
