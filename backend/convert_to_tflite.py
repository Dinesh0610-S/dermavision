import tensorflow as tf
import os

def convert_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "best_skin_model.keras")
    tflite_path = os.path.join(base_dir, "best_skin_model.tflite")

    if not os.path.exists(model_path):
        print(f"❌ Error: {model_path} not found.")
        return

    print(f"🧠 Loading Keras model from {model_path}...")
    try:
        # Define the custom preprocessing function just in case it's needed during loading
        def resnet50_preprocess(x):
            return tf.keras.applications.resnet50.preprocess_input(x)

        model = tf.keras.models.load_model(
            model_path,
            custom_objects={"resnet50_preprocess": resnet50_preprocess}
        )
        
        print("⚡ Converting to TFLite format...")
        converter = tf.lite.TFLiteConverter.from_keras_model(model)
        
        # Optimization: Default optimization for size/latency
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        
        tflite_model = converter.convert()

        print(f"💾 Saving TFLite model to {tflite_path}...")
        with open(tflite_path, 'wb') as f:
            f.write(tflite_model)
        
        old_size = os.path.getsize(model_path) / (1024 * 1024)
        new_size = os.path.getsize(tflite_path) / (1024 * 1024)
        print(f"✅ Success! Size reduced from {old_size:.2f}MB to {new_size:.2f}MB")
        print("🚀 You can now use tflite-runtime in your backend.")

    except Exception as e:
        print(f"❌ Conversion failed: {e}")

if __name__ == "__main__":
    convert_model()
