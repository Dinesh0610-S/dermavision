import cv2
import numpy as np
import os

def calculate_redness_index(image_path):
    try:
        img = cv2.imread(image_path)
        if img is None: 
            print(f"Failed to read {image_path}")
            return 0.0
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        red_score = float(np.sum(a[a > 140]) / (a.size + 1e-6) * 10)
        return red_score
    except Exception as e:
        print(f"Error: {e}")
        return 0.0

# Find two similar but different images in uploads to test
upload_dir = r"c:\a.DineshProject\backend\static\uploads"
files = [f for f in os.listdir(upload_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
if len(files) >= 2:
    f1 = os.path.join(upload_dir, files[0])
    f2 = os.path.join(upload_dir, files[1])
    print(f"Testing Redness on: {files[0]} and {files[1]}")
    r1 = calculate_redness_index(f1)
    r2 = calculate_redness_index(f2)
    print(f"Score 1: {r1:.4f}")
    print(f"Score 2: {r2:.4f}")
    if r1 != r2:
        print("SUCCESS: Detects delta between images.")
    else:
        print("WARNING: Identical scores for different images.")
else:
    print("Not enough files to test.")
