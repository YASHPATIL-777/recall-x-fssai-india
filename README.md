# End-to-End Data Engineering Pipeline: Kafka, Spark, PostgreSQL, and Airflow

This project implements a robust, scalable data engineering pipeline that extracts product recall notices from the official French Government Open Data API (`rappelconso-v2-gtin-trie`), streams events through Apache Kafka, processes and deduplicates batches in Apache Spark Structured Streaming, persists clean records to PostgreSQL, and orchestrates the entire workflow on Apache Airflow using Docker.

---

## Architecture Overview

```
French Government API (Explore API v2.1)
                 │
                 ▼
      Kafka Producer (Python)
                 │
                 ▼
       Kafka Broker (`rappel_conso`)
                 │
                 ▼
   Spark Streaming Consumer (`rappel-conso/spark`)
                 │
                 ▼
  PostgreSQL Database (`rappel_conso_table`)
                 ▲
                 │ (Orchestrated by)
          Apache Airflow (DAG: `kafka_spark_dag`)
```

1. **Data Ingestion**: Airflow triggers the Python producer task `kafka_data_stream`, querying new records from the government API and publishing them to Kafka topic `rappel_conso`.
2. **Data Streaming & Processing**: Airflow launches a Spark container via `DockerOperator` (`pyspark_consumer`), consuming messages from Kafka, performing schema mapping, deduplicating within batches, and appending new records to PostgreSQL `rappel_conso_table`.
3. **Orchestration**: Scheduled daily on Apache Airflow with custom tags (`dag_kafka_spark`, `kafka`, `spark`, `rappel_conso`).

---

## Services & Ports

| Service | Container Name | Port | Description |
| :--- | :--- | :--- | :--- |
| **Airflow Webserver** | `...-airflow-webserver-1` | `http://localhost:8080` | Airflow Web UI (Default login: `airflow` / `airflow`) |
| **Airflow Scheduler** | `...-airflow-scheduler-1` | Internal | DAG Scheduler and Task Executor |
| **PostgreSQL** | `...-postgres-1` | `5432` | Storage for Airflow metadata & target `rappel_conso_table` |
| **Kafka Broker** | `...-kafka-1` | `9092` (internal) / `9094` (external) | Event streaming message broker (KRaft mode) |
| **Kafka UI** | `kafka-ui-1` | `http://localhost:8000` | Web UI for inspecting Kafka topics and consumer groups |
| **Docker Proxy** | `...-docker-proxy-1` | `2375` (internal) / `2376` (external) | Exposes Docker socket securely to Airflow DockerOperator |

---

## Prerequisites

- **Docker Desktop** (with Compose v2 enabled)
- **Git**
- Minimum recommended memory for Docker: 4GB+

---

## Getting Started

### 1. Start the Docker Infrastructure

Start the Kafka and Docker proxy stack:
```powershell
docker compose -f docker-compose.yml up -d
```

Start the Airflow and PostgreSQL stack:
```powershell
docker compose -f docker-compose-airflow.yaml up -d
```

### 2. Build the Spark Consumer Image

```powershell
docker build -t rappel-conso/spark:latest -f spark/Dockerfile .
```

### 3. Verify All Services Are Running

```powershell
docker ps
```
Ensure all 6 services (`postgres`, `airflow-webserver`, `airflow-scheduler`, `kafka`, `kafka-ui`, `docker-proxy`) are in `Up` / `healthy` state.

---

## Running the Pipeline

### Airflow UI
1. Navigate to [http://localhost:8080](http://localhost:8080) in your browser.
2. Login with username `airflow` and password `airflow`.
3. Locate **`kafka_spark_dag`** (tagged with `dag_kafka_spark`).
4. Unpause the DAG and click **Trigger DAG** (play icon).

### Airflow CLI
You can also trigger and monitor directly from the terminal:
```powershell
# Unpause the DAG
docker compose -f docker-compose-airflow.yaml exec airflow-webserver airflow dags unpause kafka_spark_dag

# Trigger execution
docker compose -f docker-compose-airflow.yaml exec airflow-webserver airflow dags trigger kafka_spark_dag

# Check task states
docker compose -f docker-compose-airflow.yaml exec airflow-webserver airflow tasks states-for-dag-run kafka_spark_dag <RUN_ID>
```

---

## Validating Results

### 1. Check Kafka Messages in Kafka UI
Open [http://localhost:8000](http://localhost:8000) and click on Topics -> **`rappel_conso`** -> Messages to inspect ingested JSON payloads.

### 2. Query PostgreSQL Database
```powershell
# Check total ingested rows and date range
docker compose -f docker-compose-airflow.yaml exec postgres psql -U airflow -d airflow -c "SELECT count(*), min(date_de_publication), max(date_de_publication) FROM rappel_conso_table;"

# Inspect sample records
docker compose -f docker-compose-airflow.yaml exec postgres psql -U airflow -d airflow -x -c "SELECT reference_fiche, date_de_publication, categorie_de_produit, nom_de_la_marque_du_produit, motif_du_rappel, risques_pour_le_consommateur FROM rappel_conso_table LIMIT 3;"
```

---

## Stopping the Stack

```powershell
docker compose -f docker-compose.yml down
docker compose -f docker-compose-airflow.yaml down
```

---

## Troubleshooting

- **DAG not visible in UI**: Confirm `AIRFLOW__CORE__LOAD_EXAMPLES: 'false'` in `docker-compose-airflow.yaml` and search for DAG ID `kafka_spark_dag` or tag `dag_kafka_spark`.
- **Spark DockerOperator socket error**: Verify `docker-proxy` is running with `docker ps` and reachable at `tcp://docker-proxy:2375`.
- **Duplicate key errors in Spark batch**: Spark streaming uses `batch_df.dropDuplicates(["reference_fiche"])` and `leftanti` join against existing records to ensure strict deduplication.


