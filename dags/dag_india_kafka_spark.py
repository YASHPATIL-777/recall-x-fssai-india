from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator

from src.kafka_client.kafka_stream_india import stream_india
from src.spark_pgsql.spark_streaming_india import write_to_postgres_india

start_date = datetime.today() - timedelta(days=1)

default_args = {
    "owner": "airflow",
    "start_date": start_date,
    "retries": 1,
    "retry_delay": timedelta(seconds=5),
}

with DAG(
    dag_id="india_kafka_spark_dag",
    default_args=default_args,
    schedule_interval=timedelta(days=1),
    catchup=False,
    tags=["india", "fssai", "kafka", "spark", "food_recalls"],
) as dag:

    kafka_stream_task = PythonOperator(
        task_id="india_kafka_data_stream",
        python_callable=stream_india,
        dag=dag,
    )

    spark_stream_task = PythonOperator(
        task_id="india_pyspark_consumer",
        python_callable=write_to_postgres_india,
        dag=dag,
    )

    kafka_stream_task >> spark_stream_task
