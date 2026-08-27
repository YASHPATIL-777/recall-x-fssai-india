import os
import sys
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import datetime

# Database connection parameters
dbname = os.getenv("PGDATABASE", "airflow")
user = os.getenv("PGUSER", "airflow")
password = os.getenv("PGPASSWORD", "airflow")
host = os.getenv("PGHOST", "localhost")
port = os.getenv("PGPORT", "5432")

EXCEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "india_food_recalls.xlsx")
)


def parse_date(val):
    if pd.isna(val) or val is None or str(val).strip() == "":
        return None
    val_str = str(val).strip()
    # Handle DD-MM-YYYY or YYYY-MM-DD or datetime objects
    if isinstance(val, (pd.Timestamp, datetime.date, datetime.datetime)):
        return val.strftime("%Y-%m-%d")
    try:
        # Check DD-MM-YYYY format
        parts = val_str.split("-")
        if len(parts) == 3:
            if len(parts[0]) == 2 and len(parts[2]) == 4:
                day, month, year = parts[0], parts[1], parts[2]
                return f"{year}-{month:0>2}-{day:0>2}"
            elif len(parts[0]) == 4:
                return val_str
        dt = pd.to_datetime(val_str, dayfirst=True)
        return dt.strftime("%Y-%m-%d")
    except Exception:
        return None


def clean_val(val):
    if pd.isna(val) or val is None:
        return None
    val_str = str(val).strip()
    return val_str if val_str != "" else None


def seed_india_db():
    print(f"Reading FSSAI Excel from '{EXCEL_PATH}'...")
    df = pd.read_excel(EXCEL_PATH)

    rows_to_insert = []
    for idx, row in df.iterrows():
        sr_no = int(row["Sr.No"])
        recall_id = clean_val(row["Recall Id"])
        fbo_name = clean_val(row["FBO Name"])
        brand_name = clean_val(row["Brand Name"])
        batch_lot_no = clean_val(row["Batch / Lot No."])
        product_name = clean_val(row["Product"])
        reason_for_recall = clean_val(row["Reason for Recall"])
        recall_start_date = parse_date(row["Recall Start Date"])
        recall_status = clean_val(row["Recall Status"])
        recall_termination_date = parse_date(row["Recall Termination Date"])
        license_registration_no = clean_val(row["License / Registration No."])
        license_type = clean_val(
            row["License Type [Central/State/Registration]"]
        )
        nature_of_recall = clean_val(row["Nature of Recall"])

        rows_to_insert.append(
            (
                recall_id,
                sr_no,
                fbo_name,
                brand_name,
                batch_lot_no,
                product_name,
                reason_for_recall,
                recall_start_date,
                recall_status,
                recall_termination_date,
                license_registration_no,
                license_type,
                nature_of_recall,
            )
        )

    print(f"Connecting to PostgreSQL at {host}:{port}/{dbname}...")
    conn = psycopg2.connect(
        dbname=dbname, user=user, password=password, host=host, port=port
    )
    cur = conn.cursor()

    insert_sql = """
    INSERT INTO india_food_recalls_table (
        recall_id, sr_no, fbo_name, brand_name, batch_lot_no,
        product_name, reason_for_recall, recall_start_date,
        recall_status, recall_termination_date, license_registration_no,
        license_type, nature_of_recall
    ) VALUES %s
    ON CONFLICT (recall_id) DO UPDATE SET
        sr_no = EXCLUDED.sr_no,
        fbo_name = EXCLUDED.fbo_name,
        brand_name = EXCLUDED.brand_name,
        batch_lot_no = EXCLUDED.batch_lot_no,
        product_name = EXCLUDED.product_name,
        reason_for_recall = EXCLUDED.reason_for_recall,
        recall_start_date = EXCLUDED.recall_start_date,
        recall_status = EXCLUDED.recall_status,
        recall_termination_date = EXCLUDED.recall_termination_date,
        license_registration_no = EXCLUDED.license_registration_no,
        license_type = EXCLUDED.license_type,
        nature_of_recall = EXCLUDED.nature_of_recall;
    """

    execute_values(cur, insert_sql, rows_to_insert)
    conn.commit()
    print("Successfully seeded 'india_food_recalls_table'. Running verification assertions...")

    # Verification checks
    cur.execute("SELECT COUNT(*) FROM india_food_recalls_table;")
    total_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM india_food_recalls_table WHERE brand_name IS NULL;")
    null_brand = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM india_food_recalls_table WHERE batch_lot_no IS NULL;")
    null_batch = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM india_food_recalls_table WHERE reason_for_recall IS NULL;")
    null_reason = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM india_food_recalls_table WHERE recall_termination_date IS NULL;")
    null_term = cur.fetchone()[0]

    cur.execute("SELECT recall_status, COUNT(*) FROM india_food_recalls_table GROUP BY recall_status;")
    statuses = dict(cur.fetchall())

    cur.execute("SELECT license_type, COUNT(*) FROM india_food_recalls_table GROUP BY license_type;")
    license_types = dict(cur.fetchall())

    cur.execute("SELECT nature_of_recall, COUNT(*) FROM india_food_recalls_table GROUP BY nature_of_recall;")
    natures = dict(cur.fetchall())

    cur.close()
    conn.close()

    print("\n--- VERIFICATION RESULTS ---")
    print(f"Total records: {total_count} (Expected: 199)")
    print(f"Brand Name NULL count: {null_brand} (Expected: 7)")
    print(f"Batch/Lot No. NULL count: {null_batch} (Expected: 10)")
    print(f"Reason for Recall NULL count: {null_reason} (Expected: 1)")
    print(f"Recall Termination Date NULL count: {null_term} (Expected: 161)")
    print(f"Recall Statuses: {statuses}")
    print(f"License Types: {license_types}")
    print(f"Natures of Recall: {natures}")

    assert total_count == 199, f"Expected 199 records, got {total_count}"
    assert null_brand == 7, f"Expected 7 null brands, got {null_brand}"
    assert null_batch == 10, f"Expected 10 null batches, got {null_batch}"
    assert null_reason == 1, f"Expected 1 null reason, got {null_reason}"
    assert null_term == 161, f"Expected 161 null termination dates, got {null_term}"
    assert statuses.get("Initiated") == 125
    assert statuses.get("In progress") == 55
    assert statuses.get("Completed") == 19
    assert license_types.get("State License") == 156
    assert license_types.get("Central License") == 43
    assert natures.get("Initiated by Authority") == 142
    assert natures.get("Initiated by FBO") == 57

    print("\nALL VERIFICATION ASSERTIONS PASSED PERFECTLY!")


if __name__ == "__main__":
    seed_india_db()
