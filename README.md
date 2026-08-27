# RECALL//X

## PRODUCT RECALL INTELLIGENCE CONSOLE

[![Pipeline](https://img.shields.io/badge/Pipeline-Kafka%20%7C%20Spark%20%7C%20Postgres%20%7C%20Airflow-6366f1?style=for-the-badge)](https://github.com)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-06b6d4?style=for-the-badge)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015%20%7C%20TypeScript%20%7C%20Terminal%20Noir-10b981?style=for-the-badge)](https://nextjs.org)
[![Cloud Target](https://img.shields.io/badge/Deploy-Railway%20%7C%20Vercel-a855f7?style=for-the-badge)](https://railway.app)

**RECALL//X** is an end-to-end, event-driven Data Engineering and Analytics console that ingests, streams, deduplicates, and visualizes official French Government Product Recall Notices (*RappelConso* Open Data API) in real time. Features a **Terminal Noir** observability application backed by Apache Kafka, PySpark, PostgreSQL, Apache Airflow, and FastAPI.

---

## 🏗️ Architecture

```
                       [ French Government Open API ]
                       (data.economie.gouv.fr v2.1)
                                    │
                                    │ Daily Automated Extract
                                    ▼
                         [ Kafka Producer Service ]
                         (Accents & JSON Normalizer)
                                    │
                                    │ Event Stream
                                    ▼
                         [ Apache Kafka Broker ]
                           (Topic: rappel_conso)
                                    │
                                    │ Micro-Batches
                                    ▼
                       [ PySpark Stream Consumer ]
                      (Leftanti Join Deduplication)
                                    │
                                    │ JDBC Bulk Insert
                                    ▼
                         [ PostgreSQL Database ]
                        (Table: rappel_conso_table)
                         12,269+ Verified Notices
                                    ▲
                                    │ Orchestrates Pipeline
                         [ Apache Airflow DAG ]
                         (`kafka_spark_dag`)
                                    │
               ┌────────────────────┴────────────────────┐
               │                                         │
               ▼                                         ▼
   [ FastAPI REST Backend ]                   [ Next.js Editorial Dashboard ]
    Port: 8001 / Railway                      Port: 3000 / Vercel
    - GET /health                             - Neo-Brutalist Layout (#F5F3EA)
    - GET /api/stats                          - Real-Time KPI Cards (12,269 Recalls)
    - GET /api/categories                     - Category Distribution & Trends
    - GET /api/recalls                        - Search, Filters, & Pagination
    - GET /api/recalls/{reference_fiche}      - Detailed 25-Field Recall Dossier
```

---

## 🎨 Neo-Brutalist Visual Design System

The frontend dashboard is designed in an unapologetic, technical **Neo-Brutalist** aesthetic:
- **Paper & Ink Foundation**: Warm paper background (`#F5F3EA`), high-contrast ink black (`#111111`), white cards (`#FFFFFF`).
- **Tactile Accents**: 🟡 Acid Yellow (`#F4E600`), 🟢 Mint Green (`#35D07F`), 🔴 Hot Pink (`#FF3B9D`), 🔵 Electric Blue (`#2348FF`), 🟠 Safety Orange (`#FF4B16`).
- **Physical Geometry**: Thick 2px–4px solid `#111111` borders, sharp corners (`0px`), hard offset drop shadows (`5px 5px 0 #111111` & `8px 8px 0 #111111`).
- **Typography**: Space Grotesk display headers paired with JetBrains Mono data & metadata tags.

---

## 🧰 Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Ingestion** | Python 3.11, Requests | Paginated API ingestion with UTF-8 normalization |
| **Event Stream** | Apache Kafka 3.5.0, KRaft Mode | Distributed streaming buffer (`rappel_conso` topic) |
| **Stream Processor** | PySpark 3.5.0, Java 11 | Structured Streaming with `leftanti` join deduplication |
| **Storage** | PostgreSQL 13 | Primary store with indexed `reference_fiche` PK and 25 fields |
| **Orchestration** | Apache Airflow 2.7.3 | Scheduled execution, task monitoring, and error retries |
| **REST API** | FastAPI, Uvicorn, Psycopg2-binary | High-throughput async REST service with parameterized queries |
| **Frontend UI** | Next.js 15, React 19, TypeScript | Neo-Brutalist dashboard, interactive charts, card/table views |
| **Production Targets**| Railway & Vercel | Railway PostgreSQL + FastAPI backend & Vercel Next.js edge CDN |

---

## 📊 Database Schema (`rappel_conso_table`)

Holds 25 standardized fields covering complete safety notice specifications:

| Column Name | Data Type | Primary Key | Description |
|---|---|---|---|
| `reference_fiche` | `VARCHAR(255)` | YES | Unique recall notice identifier (e.g. `2025-01-0012`) |
| `date_de_publication` | `VARCHAR(50)` | NO | Publication date (`YYYY-MM-DD`) |
| `date_de_fin_de_la_procedure_de_rappel` | `VARCHAR(50)` | NO | End date of recall procedure |
| `categorie_de_produit` | `VARCHAR(255)` | NO | Product category (*alimentation, bébés-enfants, etc.*) |
| `sous_categorie_de_produit` | `VARCHAR(255)` | NO | Granular sub-category |
| `nom_de_la_marque_du_produit` | `VARCHAR(255)` | NO | Brand name |
| `noms_des_modeles_ou_references` | `TEXT` | NO | Model names, batch numbers, variations |
| `identification_des_produits` | `TEXT` | NO | GTIN codes, lot numbers, barcodes |
| `conditionnements` | `TEXT` | NO | Packaging details |
| `temperature_de_conservation` | `VARCHAR(255)` | NO | Storage requirements |
| `zone_geographique_de_vente` | `TEXT` | NO | Sales distribution zone |
| `distributeurs` | `TEXT` | NO | Retailers / Supermarkets where item was sold |
| `motif_du_rappel` | `TEXT` | NO | Reason for recall (*Listeria, Salmonella, foreign object*) |
| `risques_pour_le_consommateur` | `TEXT` | NO | Health risks |
| `recommandations_sante` | `TEXT` | NO | Health guidelines for consumers |
| `numero_de_contact` | `VARCHAR(255)` | NO | Consumer support phone number |
| `modalites_de_compensation` | `TEXT` | NO | Refund / exchange policy |
| `date_debut_commercialisation` | `VARCHAR(50)` | NO | Start of sale period |
| `date_fin_commercialisation` | `VARCHAR(50)` | NO | End of sale period |
| `informations_complementaires` | `TEXT` | NO | Additional notes |
| `liens_vers_les_images` | `TEXT` | NO | Product photo URLs |
| `lien_vers_la_fiche_rappel` | `TEXT` | NO | Official government notice URL |
| `lien_vers_affichette_pdf` | `TEXT` | NO | Official PDF flyer URL |
| `lien_vers_la_liste_des_produits` | `TEXT` | NO | Product list URL |
| `lien_vers_la_liste_des_distributeurs` | `TEXT` | NO | Distributor list URL |

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | Returns status (`healthy`) and database connectivity |
| `/api/stats` | `GET` | Returns aggregated metrics, top 10 categories, top 8 risks, and multi-year distribution |
| `/api/categories` | `GET` | Returns distinct category breakdown with record counts |
| `/api/recalls` | `GET` | Parameterized search, date range filter, category filter, sorting, and pagination |
| `/api/recalls/{reference_fiche}` | `GET` | Returns complete 25-field dictionary for a specific recall |

---

## 🚀 Deployment Guide (Railway & Vercel)

### Architecture Separation
- **Data Engineering Pipeline**: Runs locally/on-premise (Government API ➔ Kafka ➔ PySpark ➔ PostgreSQL ➔ Airflow).
- **Web Application Stack**: Runs in the Cloud (Vercel Next.js ➔ Railway FastAPI ➔ Railway PostgreSQL).

### Step 1: Railway Database & Backend
1. **Create Railway PostgreSQL**:
   - In Railway Dashboard, click **New Project ➔ PostgreSQL**.
   - Copy the provided `DATABASE_URL` (e.g. `postgresql://postgres:password@...railway.app:5432/railway`).

2. **Migrate Local Data to Railway**:
   Run the high-speed streaming batch migration script:
   ```bash
   python scripts/migrate_to_railway.py "<RAILWAY_DATABASE_URL>"
   ```

3. **Deploy Backend Service**:
   - In Railway, click **New Service ➔ GitHub Repo ➔ Root directory: `backend/`**.
   - Configure Environment Variables:
     - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}`
     - `CORS_ORIGINS`: `https://your-frontend.vercel.app,http://localhost:3000`
   - Verify health check: `GET https://your-backend.up.railway.app/health`.

### Step 2: Vercel Frontend
1. In Vercel, click **New Project ➔ Import GitHub Repo**.
2. Set **Root Directory**: `frontend`.
3. Framework Preset: **Next.js**.
4. Environment Variable:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://your-backend.up.railway.app`
5. Click **Deploy**.

---

## 🔒 Security Audit & Best Practices

- ✅ **No Hardcoded Secrets**: Database credentials and URLs are dynamically read from `DATABASE_URL`, `CORS_ORIGINS`, and `PORT`.
- ✅ **Strict `.gitignore`**: `.env`, `.env.local`, `node_modules`, `frontend/.next`, `scratch/`, and `__pycache__` are excluded from tracking.
- ✅ **Zero Build / Lint Errors**: `npm run build` in `frontend/` and `git diff --check` pass cleanly.
