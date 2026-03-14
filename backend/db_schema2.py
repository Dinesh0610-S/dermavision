import mysql.connector
import sys

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
        print(f"\n--- {table} ---")
        try:
            cursor.execute(f"DESCRIBE {table}")
            for row in cursor.fetchall():
                # print just the column name and type
                print(f"{row[0]}: {row[1]}")
        except Exception as e:
            pass
            
    conn.close()
except:
    pass
