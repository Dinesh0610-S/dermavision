import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="dermavision"
    )
    cursor = conn.cursor()
    
    tables_to_check = ["users", "skin_scans", "healing_timeline"]
    
    for table in tables_to_check:
        print(f"\n--- DESCRIBE {table} ---")
        try:
            cursor.execute(f"DESCRIBE {table}")
            for row in cursor.fetchall():
                print(row)
        except Exception as e:
            print(f"Error reading {table}: {e}")
            
    conn.close()
except Exception as e:
    print(f"Connection Failed: {e}")
