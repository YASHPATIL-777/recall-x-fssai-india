import os
import sys
import json
import logging
import pandas as pd
import kafka.errors
from kafka import KafkaProducer

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from src.constants import KAFKA_BOOTSTRAP_SERVERS, INDIA_KAFKA_TOPIC, INDIA_EXCEL_PATH
from src.kafka_client.transformations_india import transform_india_row

logging.basicConfig(format="%(asctime)s - %(message)s", level=logging.INFO, force=True)


def create_kafka_producer():
    bootstrap_servers = [os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9094")]
    if bootstrap_servers[0] == "kafka:9092":
        bootstrap_servers = ["localhost:9094", "kafka:9092"]
    
    for server in bootstrap_servers:
        try:
            logging.info(f"Attempting connection to Kafka at {server}...")
            producer = KafkaProducer(bootstrap_servers=[server], request_timeout_ms=5000)
            logging.info(f"Connected to Kafka broker at {server}")
            return producer
        except Exception as e:
            logging.warning(f"Unable to connect to Kafka at {server}: {e}")
    
    raise RuntimeError("Could not connect to any Kafka bootstrap server.")



def stream_india():
    excel_path = os.getenv("INDIA_EXCEL_PATH", INDIA_EXCEL_PATH)
    if not os.path.exists(excel_path):
        excel_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "india_food_recalls.xlsx")

    logging.info(f"Reading FSSAI recall dataset from {excel_path}...")
    df = pd.read_excel(excel_path)
    records = df.to_dict(orient="records")

    producer = create_kafka_producer()
    transformed_records = [transform_india_row(row) for row in records]

    logging.info(
        f"Publishing {len(transformed_records)} messages to Kafka topic '{INDIA_KAFKA_TOPIC}'..."
    )
    for record in transformed_records:
        producer.send(INDIA_KAFKA_TOPIC, json.dumps(record).encode("utf-8"))
    producer.flush()
    logging.info(
        f"Successfully published {len(transformed_records)} messages to Kafka topic '{INDIA_KAFKA_TOPIC}'"
    )


if __name__ == "__main__":
    stream_india()
