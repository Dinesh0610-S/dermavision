import os
import pymongo
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get("MONGODB_URI")
print(f"Testing connection to: {MONGO_URI}")

try:
    client = pymongo.MongoClient(MONGO_URI)
    # The ping command is cheap and does not require auth
    client.admin.command('ping')
    print("✅ MongoDB Atlas connection successful!")
    
    db = client.get_database("dermavision")
    print(f"Connected to database: {db.name}")
    
    # Check collections
    collections = db.list_collection_names()
    print(f"Existing collections: {collections}")
    
except Exception as e:
    import traceback
    print("❌ Connection failed:")
    traceback.print_exc()
