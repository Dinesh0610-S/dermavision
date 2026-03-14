from sqlalchemy import create_engine

URI = "mysql+mysqlconnector://root:root@127.0.0.1:3306/dermavision"
engine = create_engine(URI)

try:
    with engine.connect() as conn:
        print("SUCCESS! Connected to Database.")
except Exception as e:
    import traceback
    traceback.print_exc()
