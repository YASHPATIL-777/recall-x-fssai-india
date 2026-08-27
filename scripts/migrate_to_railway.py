"""
Migration / Seeding Script for Railway PostgreSQL (FSSAI India Food Recalls).

Usage:
    python scripts/migrate_to_railway.py "<TARGET_DATABASE_URL>"

Example:
    python scripts/migrate_to_railway.py "postgresql://postgres:password@postgres.railway.internal:5432/railway"
"""

import sys
import os
import requests
import psycopg2
from psycopg2.extras import execute_values

DB_TABLE = "india_food_recalls_table"

DB_FIELDS = [
    "recall_id",
    "sr_no",
    "fbo_name",
    "brand_name",
    "batch_lot_no",
    "product_name",
    "reason_for_recall",
    "recall_start_date",
    "recall_status",
    "recall_termination_date",
    "license_registration_no",
    "license_type",
    "nature_of_recall",
]


def create_schema_in_target(target_conn):
    """Creates the india_food_recalls_table in the target Railway database."""
    print("--> [1/3] Creating table schema and indexes in Railway PostgreSQL...")
    create_sql = f"""
    CREATE TABLE IF NOT EXISTS {DB_TABLE} (
        recall_id VARCHAR(255) PRIMARY KEY,
        sr_no INT,
        fbo_name TEXT,
        brand_name TEXT,
        batch_lot_no TEXT,
        product_name TEXT,
        reason_for_recall TEXT,
        recall_start_date DATE,
        recall_status VARCHAR(50),
        recall_termination_date DATE,
        license_registration_no TEXT,
        license_type VARCHAR(50),
        nature_of_recall VARCHAR(100)
    );
    CREATE INDEX IF NOT EXISTS idx_india_recall_date ON {DB_TABLE} (recall_start_date);
    CREATE INDEX IF NOT EXISTS idx_india_recall_status ON {DB_TABLE} (recall_status);
    CREATE INDEX IF NOT EXISTS idx_india_license_type ON {DB_TABLE} (license_type);
    """
    with target_conn.cursor() as cur:
        cur.execute(create_sql)
    target_conn.commit()
    print(f"    [OK] Table '{DB_TABLE}' & indexes created.")


def migrate_data(target_url: str, local_api_url: str = "http://localhost:8001"):
    """Fetches records from local stack and streams them into Railway PostgreSQL."""
    print("--> [2/3] Connecting to Railway Database...")
    target_conn = psycopg2.connect(target_url)

    try:
        create_schema_in_target(target_conn)

        print(f"--> [3/3] Streaming records from local backend ({local_api_url})...")
        
        res0 = requests.get(f"{local_api_url}/api/recalls?page=1&page_size=100").json()
        total_records = res0.get("total", 0)
        total_pages = res0.get("total_pages", 0)
        print(f"    Total records to migrate: {total_records} across {total_pages} batches.")

        cols = DB_FIELDS
        insert_sql = f"""
        INSERT INTO {DB_TABLE} ({", ".join(cols)})
        VALUES %s
        ON CONFLICT (recall_id) DO NOTHING;
        """

        total_migrated = 0
        with target_conn.cursor() as cur:
            for page in range(1, total_pages + 1):
                res = requests.get(f"{local_api_url}/api/recalls?page={page}&page_size=100").json()
                results = res.get("results", [])
                if not results:
                    break

                values = [
                    tuple(rec.get(col) for col in cols)
                    for rec in results
                ]
                execute_values(cur, insert_sql, values)
                target_conn.commit()
                total_migrated += len(results)
                print(f"    Progress: {total_migrated}/{total_records} records synced (Page {page}/{total_pages})...", end="\r")

        print(f"\n    [OK] All {total_migrated} records synced successfully!")

        with target_conn.cursor() as cur:
            cur.execute(f"SELECT COUNT(*) FROM {DB_TABLE};")
            verified_count = cur.fetchone()[0]
            print(f"\n[SUCCESS] Migration Complete! Railway Database verified count: {verified_count} records.")

    finally:
        target_conn.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Target DATABASE_URL is required.")
        print("Usage: python scripts/migrate_to_railway.py '<TARGET_DATABASE_URL>'")
        sys.exit(1)

    target_url = sys.argv[1].strip()
    migrate_data(target_url)
