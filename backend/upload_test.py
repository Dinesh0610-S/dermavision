import requests
import os
from PIL import Image

test_img_path = "test_image.jpg"
img = Image.new('RGB', (100, 100), color = 'red')
img.save(test_img_path)

url = "http://127.0.0.1:5000/api/predict"

try:
    with open(test_img_path, "rb") as img_file:
        files = {"file": img_file}
        data = {"user_email": "test@dermavision.ai"}
        response = requests.post(url, files=files, data=data)
        print("STATUS:", response.status_code)
        print("RESPONSE:", response.json())
except Exception as e:
    print("Test Failed:", e)

if os.path.exists(test_img_path):
    os.remove(test_img_path)
