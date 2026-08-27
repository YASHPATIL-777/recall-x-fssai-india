import logging
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from pyspark.sql import SparkSession
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    IntegerType,
)
from pyspark.sql.functions import from_json, col

from src.constants import (
    POSTGRES_URL,
    POSTGRES_PROPERTIES,
    KAFKA_BOOTSTRAP_SERVERS,
    INDIA_KAFKA_TOPIC,
    INDIA_DB_TABLE,
    INDIA_DB_FIELDS,
)

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s:%(funcName)s:%(levelname)s:%(message)s"
)


def create_spark_session() -> SparkSession:
    os.environ["IVY_HOME"] = os.getenv("IVY_HOME", "/tmp/.ivy2")
    spark = (
        SparkSession.builder.appName("PostgreSQL Connection with PySpark (India FSSAI)")
        .config(
            "spark.jars.packages",
            "org.postgresql:postgresql:42.5.4,org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0",
        )
        .config("spark.driver.memory", "1g")
        .config("spark.sql.shuffle.partitions", "4")
        .getOrCreate()
    )
    logging.info("Spark session created successfully for India pipeline")
    return spark


def create_initial_dataframe(spark_session):
    try:
        df = (
            spark_session.readStream.format("kafka")
            .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVERS)
            .option("subscribe", INDIA_KAFKA_TOPIC)
            .option("startingOffsets", "earliest")
            .load()
        )
        logging.info(f"Initial dataframe created for Kafka topic '{INDIA_KAFKA_TOPIC}'")
    except Exception as e:
        logging.warning(f"Initial dataframe couldn't be created due to exception: {e}")
        raise
    return df


def create_final_dataframe(df):
    fields = []
    for field_name in INDIA_DB_FIELDS:
        if field_name == "sr_no":
            fields.append(StructField(field_name, IntegerType(), True))
        else:
            fields.append(StructField(field_name, StringType(), True))

    schema = StructType(fields)
    df_out = (
        df.selectExpr("CAST(value AS STRING)")
        .select(from_json(col("value"), schema).alias("data"))
        .select("data.*")
    )
    return df_out


def start_streaming(df_parsed, spark):
    unique_column = "recall_id"

    def write_batch(batch_df, batch_id):
        logging.info(f"Processing batch ID: {batch_id} with {batch_df.count()} records")
        batch_clean = batch_df.filter(col(unique_column).isNotNull()).dropDuplicates([unique_column])

        try:
            existing_data_df = spark.read.jdbc(
                POSTGRES_URL, INDIA_DB_TABLE, properties=POSTGRES_PROPERTIES
            )
            new_records_df = batch_clean.join(
                existing_data_df, batch_clean[unique_column] == existing_data_df[unique_column], "leftanti"
            )
        except Exception as e:
            logging.warning(f"Could not read existing table '{INDIA_DB_TABLE}': {e}")
            new_records_df = batch_clean

        count_to_insert = new_records_df.count()
        logging.info(f"Inserting {count_to_insert} new records into PostgreSQL table '{INDIA_DB_TABLE}'")
        if count_to_insert > 0:
            new_records_df.write.jdbc(
                POSTGRES_URL, INDIA_DB_TABLE, "append", properties=POSTGRES_PROPERTIES
            )
            logging.info(f"Batch {batch_id} successfully written to PostgreSQL table '{INDIA_DB_TABLE}'")

    query = (
        df_parsed.writeStream
        .foreachBatch(write_batch)
        .trigger(once=True)
        .start()
    )
    return query.awaitTermination()


def write_to_postgres_india():
    spark = create_spark_session()
    try:
        df = create_initial_dataframe(spark)
        df_final = create_final_dataframe(df)
        start_streaming(df_final, spark=spark)
    finally:
        logging.info("Stopping Spark session...")
        try:
            spark.stop()
        except Exception as e:
            logging.warning(f"Error stopping spark session: {e}")


if __name__ == "__main__":
    write_to_postgres_india()
