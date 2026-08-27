# RECALL//X – FSSAI INDIA FOOD RECALL PIPELINE & INTELLIGENCE CONSOLE

[![Pipeline](https://img.shields.io/badge/Pipeline-Kafka%20%7C%20Spark%20%7C%20Postgres%20%7C%20Airflow-6366f1?style=for-the-badge)](https://github.com)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-06b6d4?style=for-the-badge)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015%20%7C%20TypeScript%20%7C%20Terminal%20Noir-10b981?style=for-the-badge)](https://nextjs.org)

**RECALL//X** is an end-to-end, event-driven Data Engineering and Analytics console that ingests, streams, deduplicates, and visualizes official Indian Food Safety and Standards Authority (FSSAI) Food Recall Notices in real time. Features a **Terminal Noir** observability dashboard backed by Apache Kafka, PySpark, PostgreSQL, Apache Airflow, and FastAPI.

---

## 🏗️ Architecture Flow

```
                      [ FSSAI India Excel Dataset ]
                     (data/india_food_recalls.xlsx)
                                   │
                                   │ Dataset Extraction & Ingestion
                                   ▼
                       [ Kafka Producer Service ]
                     (src/kafka_client/kafka_stream_india.py)
                                   │
                                   │ Event Stream
                                   ▼
                       [ Apache Kafka Broker ]
                      (Topic: india_food_recalls)
                                   │
                                   │ Micro-Batches
                                   ▼
                      [ PySpark Stream Consumer ]
                     (src/spark_pgsql/spark_streaming_india.py)
                                   │
                                   │ JDBC Append (Deduplication via recall_id)
                                   ▼
                       [ PostgreSQL Database ]
                     (Table: india_food_recalls_table)
                        199 Verified FSSAI Notices
                                   ▲
                                   │ Orchestrates Pipeline
                       [ Apache Airflow DAG ]
                    (`india_kafka_spark_dag`)
                                   │
               ┌───────────────────┴───────────────────┐
               │                                       │
               ▼                                       ▼
   [ FastAPI REST Backend ]                 [ Next.js RECALL//X Dashboard ]
    Port: 8001                               Port: 3000
    - GET /health                            - Dark Terminal Noir Layout
    - GET /api/stats                         - Real-Time KPI Overview (199 Recalls)
    - GET /api/categories                    - Status & License Distribution Charts
    - GET /api/recalls                       - Search, Multi-Filter, & Pagination
    - GET /api/recalls/{recall_id}           - Detailed FSSAI Recall Dossier Modal
```

---

## 🎨 Visual Design System

The frontend dashboard is designed in a technical **Terminal Noir** aesthetic:
- **Dark Obsidian Foundation**: Dark background (`#0A0D14`), elevated panels (`#121824`), crisp borders (`#1E293B`).
- **Tactile Status Accents**: 🟡 Amber (`#F59E0B`) for Initiated, 🔵 Cyan (`#06B6D4`) for In Progress, 🟢 Mint Green (`#10B981`) for Completed, 🟣 Purple (`#8B5CF6`) for State Licenses.
- **Typography**: Inter display headers paired with JetBrains Mono data & metadata tags.
- **NULL Handling**: Missing values (e.g. absent Brand Names, Lot Numbers, Termination Dates) are displayed cleanly as `NOT PROVIDED`.

---

## 🧰 Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Ingestion** | Python 3.11, Pandas, OpenPyXL | Excel dataset parsing with date standardization (`YYYY-MM-DD`) |
| **Event Stream** | Apache Kafka 3.5.0, KRaft Mode | Distributed streaming buffer (`india_food_recalls` topic) |
| **Stream Processor** | PySpark 3.5.0, Java 11 | Structured Streaming with `recall_id` deduplication |
| **Storage** | PostgreSQL 13 | Primary store with indexed `recall_id` PK and 13 FSSAI fields |
| **Orchestration** | Apache Airflow 2.7.3 | Scheduled execution, task monitoring, and error retries |
| **REST API** | FastAPI, Uvicorn, Psycopg2-binary | High-throughput async REST service serving `india_food_recalls_table` |
| **Frontend UI** | Next.js 15, React 19, TypeScript | Terminal Noir dashboard, interactive charts, card/table views |

---

## 📊 Database Schema (`india_food_recalls_table`)

Holds 13 standardized fields matching official FSSAI recall notices:

| Column Name | Data Type | Primary Key | Nullable | Description |
|---|---|---|---|---|
| `sr_no` | `INT` | NO | NO | Serial number (1 to 199) |
| `recall_id` | `VARCHAR(255)` | YES | NO | Unique recall notice identifier (e.g. `230` or `FSSAI-REC-2025-001`) |
| `fbo_name` | `TEXT` | NO | NO | Food Business Operator (FBO) Name |
| `brand_name` | `TEXT` | NO | YES | Brand name (7 missing $\rightarrow$ `NULL`) |
| `batch_lot_no` | `TEXT` | NO | YES | Batch / Lot number (10 missing $\rightarrow$ `NULL`) |
| `product_name` | `TEXT` | NO | NO | Product description |
| `reason_for_recall` | `TEXT` | NO | YES | Official reason for recall (1 missing $\rightarrow$ `NULL`) |
| `recall_start_date` | `DATE` | NO | NO | Recall start date (`YYYY-MM-DD`) |
| `recall_status` | `VARCHAR(50)` | NO | NO | Recall status (`Initiated`, `In progress`, `Completed`) |
| `recall_termination_date` | `DATE` | NO | YES | Recall termination date (161 missing $\rightarrow$ `NULL`) |
| `license_registration_no` | `TEXT` | NO | NO | FSSAI License / Registration Number |
| `license_type` | `VARCHAR(50)` | NO | NO | Jurisdiction (`State License`, `Central License`) |
| `nature_of_recall` | `VARCHAR(100)` | NO | NO | Initiating entity (`Initiated by Authority`, `Initiated by FBO`) |

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | Returns status (`healthy`), database connectivity, and active table (`india_food_recalls_table`) |
| `/api/stats` | `GET` | Returns total recall count, status breakdown, license type breakdown, nature breakdown, and timeline |
| `/api/categories` | `GET` | Returns distinct category breakdown with record counts |
| `/api/recalls` | `GET` | Parameterized search, date range filter, license type filter, recall status filter, and pagination |
| `/api/recalls/{recall_id}` | `GET` | Returns complete 13-field record for a specific recall by `recall_id` |

---

## 🚀 Local Setup & Execution Guide

### 1. Database Initialization
Create the database schema and seed local PostgreSQL:
```bash
python scripts/create_india_table.py
python scripts/seed_india_local_db.py
```

### 2. Stream Ingestion Pipeline
Publish records to Kafka and run PySpark stream processing:
```bash
python src/kafka_client/kafka_stream_india.py
python src/spark_pgsql/spark_streaming_india.py
```

### 3. Start Backend & Frontend Services
```bash
# Start FastAPI backend
cd backend && uvicorn main:app --port 8001 --reload

# Start Next.js frontend
cd frontend && npm run dev
```

---

## 🔒 Security Audit & Best Practices

- ✅ **No Hardcoded Secrets**: Database credentials and URLs are dynamically read from environment variables (`PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PORT`).
- ✅ **Strict `.gitignore`**: `.env`, `.env.local`, `node_modules`, `frontend/.next`, `scratch/`, and `__pycache__` are excluded from tracking.
- ✅ **Zero Build / Lint Errors**: `npm run build` in `frontend/` passes cleanly.
