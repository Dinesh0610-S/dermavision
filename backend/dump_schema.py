import mysql.connector
import json

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="dermavision"
    )
    cursor = conn.cursor()
    
    tables_to_check = [
        "users", 
        "diseases", 
        "skin_scans", 
        "symptom_logs", 
        "healing_timeline", 
        "smart_mirror_scans", 
        "chatbot_conversations", 
        "nutrition_recommendations", 
        "treatments", 
        "ai_logs"
    ]
    
    schema_dict = {}
    for table in tables_to_check:
        try:
            cursor.execute(f"DESCRIBE {table}")
            columns = []
            for row in cursor.fetchall():
                columns.append({"field": row[0], "type": row[1]})
            schema_dict[table] = columns
        except Exception as e:
            schema_dict[table] = {"error": str(e)}
            
    conn.close()
    
    with open("schema_dump.json", "w") as f:
        json.dump(schema_dict, f, indent=4)
        print("Schema dumped to schema_dump.json")
except Exception as e:
    print(f"Connection Failed: {e}")
