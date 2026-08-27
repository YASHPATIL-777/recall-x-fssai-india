import os

# KAFKA PARAMS
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

# POSTGRES PARAMS
PG_HOST = os.getenv("PGHOST", "postgres")
PG_PORT = os.getenv("PGPORT", "5432")
PG_DATABASE = os.getenv("PGDATABASE", "airflow")
PG_USER = os.getenv("PGUSER", "airflow")
PG_PASSWORD = os.getenv("PGPASSWORD", "airflow")

POSTGRES_URL = f"jdbc:postgresql://{PG_HOST}:{PG_PORT}/{PG_DATABASE}"

POSTGRES_PROPERTIES = {
    "user": PG_USER,
    "password": PG_PASSWORD,
    "driver": "org.postgresql.Driver",
}

# FSSAI INDIA PIPELINE PARAMS
INDIA_KAFKA_TOPIC = os.getenv("INDIA_KAFKA_TOPIC", "india_food_recalls")
INDIA_DB_TABLE = os.getenv("INDIA_DB_TABLE", "india_food_recalls_table")
INDIA_EXCEL_PATH = os.getenv("INDIA_EXCEL_PATH", "./data/india_food_recalls.xlsx")

KAFKA_TOPIC = INDIA_KAFKA_TOPIC
DB_TABLE = INDIA_DB_TABLE

INDIA_DB_FIELDS = [
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

DB_FIELDS = INDIA_DB_FIELDS
