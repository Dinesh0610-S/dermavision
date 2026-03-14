import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, callbacks, regularizers
from tensorflow.keras.applications import ResNet50
from sklearn.utils import class_weight

# -----------------------------
# CPU OPTIMIZATION (Ryzen 7)
# -----------------------------
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
tf.config.threading.set_intra_op_parallelism_threads(16)
tf.config.threading.set_inter_op_parallelism_threads(2)

# -----------------------------
# PATH SETUP
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Ensure this path leads to where your folders 'train' and 'val' are
DATASET_DIR = os.path.join(BASE_DIR, "..", "dataset", "archive")
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
VAL_DIR = os.path.join(DATASET_DIR, "val")

if not os.path.exists(TRAIN_DIR) or not os.path.exists(VAL_DIR):
    print(f"❌ ERROR: Folders not found at {TRAIN_DIR}")
    print("Please ensure your dataset is inside 'dataset/archive/' relative to this script.")
    exit()

# -----------------------------
# DATA SETTINGS
# -----------------------------
IMG_SIZE = (224, 224)
BATCH_SIZE = 32

print("📂 Loading dataset...")
train_ds = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    shuffle=True
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    VAL_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int"
)

class_names = train_ds.class_names
NUM_CLASSES = len(class_names)
print("✅ Classes detected:", class_names)

# Save class labels for backend reference
os.makedirs(os.path.join(BASE_DIR, "model"), exist_ok=True)
with open(os.path.join(BASE_DIR, "model", "classes.txt"), "w") as f:
    for c in class_names:
        f.write(c + "\n")

# Prefetching and Preprocessing for ResNet-50
def preprocess_dataset(images, labels):
    # ResNet50 expects BGR format and ImageNet zero-centering
    return tf.keras.applications.resnet50.preprocess_input(images), labels

train_ds = train_ds.map(preprocess_dataset, num_parallel_calls=tf.data.AUTOTUNE)
val_ds = val_ds.map(preprocess_dataset, num_parallel_calls=tf.data.AUTOTUNE)

train_ds = train_ds.prefetch(tf.data.AUTOTUNE)
val_ds = val_ds.prefetch(tf.data.AUTOTUNE)

# -----------------------------
# CLASS WEIGHTS
# -----------------------------
print("⚡ Balancing data with class weights...")
# This calculates class weights so that under-represented classes get a higher penalty during training.
labels = []
for i, name in enumerate(class_names):
    folder = os.path.join(TRAIN_DIR, name)
    labels.extend([i] * len(os.listdir(folder)))

labels = np.array(labels)
weights = class_weight.compute_class_weight(
    class_weight="balanced",
    classes=np.unique(labels),
    y=labels
)
class_weights = {i: weights[i] for i in range(len(weights))}

# -----------------------------
# MODEL ARCHITECTURE (ResNet-50)
# -----------------------------
print("🧠 Building ResNet-50 Model...")

data_aug = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.15),
    layers.RandomZoom(0.1)
])

# Use ResNet50 instead of MobileNetV2
base_model = ResNet50(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)
base_model.trainable = False

model = models.Sequential([
    layers.Input(shape=(224, 224, 3)),
    data_aug,
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(512, activation="relu", kernel_regularizer=regularizers.l2(0.001)),
    layers.BatchNormalization(),
    layers.Dropout(0.5),
    layers.Dense(NUM_CLASSES, activation="softmax")
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

# -----------------------------
# TRAINING
# -----------------------------
MODEL_PATH = os.path.join(BASE_DIR, "best_skin_model.keras")

callbacks_list = [
    callbacks.ModelCheckpoint(MODEL_PATH, monitor="val_accuracy", save_best_only=True, mode="max", verbose=1),
    callbacks.EarlyStopping(monitor="val_accuracy", patience=6, restore_best_weights=True),
    callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=2, verbose=1)
]

print("\n🚀 Phase 1: Training top layers (Transfer Learning)...")
# Note: if it is slow, try reducing epochs or batch size
model.fit(train_ds, validation_data=val_ds, epochs=5, class_weight=class_weights)

print("\n🔬 Phase 2: Fine-tuning ResNet-50...")
base_model.trainable = True
# Freeze early layers. ResNet50 has 175 layers. We'll fine-tune from layer 143 onwards (the last few conv blocks).
print(f"Total layers in base model: {len(base_model.layers)}")
fine_tune_at = 143 
for layer in base_model.layers[:fine_tune_at]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=40,
    initial_epoch=5,
    class_weight=class_weights,
    callbacks=callbacks_list
)

model.save(MODEL_PATH)
print(f"\n✅ SUCCESS! ResNet-50 Model trained and saved as: {MODEL_PATH}")
