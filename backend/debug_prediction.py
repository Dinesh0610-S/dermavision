import os
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

def resnet50_preprocess(x):
    return tf.keras.applications.resnet50.preprocess_input(x)

try:
    print("Loading model...")
    model = tf.keras.models.load_model(
        "best_skin_model.keras",
        custom_objects={
            "tf": tf,
            "resnet50_preprocess": resnet50_preprocess 
        },
        safe_mode=False
    )
    print("Model loaded.")

    # Find the latest uploaded image
    upload_dir = os.path.join("static", "uploads")
    files = [f for f in os.listdir(upload_dir) if f.endswith(('.jpg', '.png'))]
    if not files:
        print("No images found in uploads.")
        exit()
    
    latest_file = max([os.path.join(upload_dir, f) for f in files], key=os.path.getmtime)
    print(f"Testing with: {latest_file}")

    img = image.load_img(latest_file, target_size=(224, 224))
    img_arr = image.img_to_array(img)
    img_arr = np.expand_dims(img_arr, axis=0)
    img_arr = resnet50_preprocess(img_arr)

    print("Predicting...")
    preds = model.predict(img_arr)[0]
    print(f"Predictions: {preds}")
    idx = np.argmax(preds)
    print(f"Detected Index: {idx}")

except Exception as e:
    import traceback
    traceback.print_exc()
