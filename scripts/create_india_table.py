import sys
import os
import psycopg2

# Database connection parameters
dbname = os.getenv("PGDATABASE", "airflow")
user = os.getenv("PGUSER", "airflow")
password = os.getenv("PGPASSWORD", "airflow")
host = os.getenv("PGHOST", "localhost")
port = os.getenv("PGPORT", "5432")


def create_india_table():
    """
    Creates the india_food_recalls_table in local PostgreSQL.
    Does not drop or modify existing tables.
    """
    print(f"Connecting to PostgreSQL at {host}:{port}/{dbname}...")
    conn = psycopg2.connect(
        dbname=dbname, user=user, password=password, host=host, port=port
    )
    cur = conn.cursor()

    create_table_sql = """
    CREATE TABLE IF NOT EXISTS india_food_recalls_table (
        recall_id VARCHAR(255) PRIMARY KEY,
        sr_no INT NOT NULL,
        fbo_name TEXT NOT NULL,
        brand_name TEXT,
        batch_lot_no TEXT,
        product_name TEXT NOT NULL,
        reason_for_recall TEXT,
        recall_start_date DATE NOT NULL,
        recall_status VARCHAR(50) NOT NULL,
        recall_termination_date DATE,
        license_registration_no TEXT NOT NULL,
        license_type VARCHAR(50) NOT NULL,
        nature_of_recall VARCHAR(100) NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_india_recall_start_date ON india_food_recalls_table (recall_start_date);
    CREATE INDEX IF NOT EXISTS idx_india_recall_status ON india_food_recalls_table (recall_status);
    CREATE INDEX IF NOT EXISTS idx_india_license_type ON india_food_recalls_table (license_type);
    """

    try:
        cur.execute(create_table_sql)
        conn.commit()
        print("Successfully created 'india_food_recalls_table' and indexes in PostgreSQL.")
    except Exception as e:
        conn.rollback()
        print(f"Error creating table: {e}")
        raise
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    create_india_table()
