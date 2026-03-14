import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="dermavision"
    )
    cursor = conn.cursor(dictionary=True)
        
    tables_to_check = ["diseases", "treatments", "nutrition_recommendations", "ai_logs", "symptom_logs", "skin_scans", "healing_timeline"]
    
    with open("db_counts.txt", "w") as f:
        for t in tables_to_check:
            cursor.execute(f"SELECT COUNT(*) as count FROM {t};")
            count = cursor.fetchone()["count"]
            f.write(f"Table '{t}' has {count} records.\n")
            
            if count > 0:
                cursor.execute(f"SELECT * FROM {t} ORDER BY id DESC LIMIT 1;")
                latest = cursor.fetchone()
                # Print just the first few characters of each value to avoid massive lines
                f.write(f"  Latest {t}: { {k: str(v)[:50] for k, v in latest.items()} }\n")

    conn.close()
    print("Done")
except Exception as e:
    print(f"Connection Failed: {e}")
