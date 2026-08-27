from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import math
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend")

app = FastAPI(
    title="India FSSAI Food Recall Data Engineering API",
    description="REST API serving FSSAI Indian food recall notices from PostgreSQL",
    version="2.0.0",
)

# Configure CORS
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allow_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
if "*" in allow_origins:
    allow_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TABLE_NAME = os.getenv("TABLE_NAME", "india_food_recalls_table")


def get_db_connection():
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

    pghost = os.getenv("PGHOST", "127.0.0.1")
    pgport = int(os.getenv("PGPORT", "5432"))
    pgdb = os.getenv("PGDATABASE", "airflow")
    pguser = os.getenv("PGUSER", "airflow")
    pgpassword = os.getenv("PGPASSWORD", "airflow")

    return psycopg2.connect(
        host=pghost,
        port=pgport,
        database=pgdb,
        user=pguser,
        password=pgpassword,
        cursor_factory=RealDictCursor,
    )


@app.get("/health")
def health():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        cur.close()
        conn.close()
        return {"status": "healthy", "database": "connected", "table": TABLE_NAME}
    except Exception as e:
        logger.error(f"Health check database connection failed: {e}")
        return {"status": "degraded", "database": f"error: {str(e)}"}


@app.get("/api/stats")
def get_stats():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Summary
        cur.execute(f"""
            SELECT 
                COUNT(*) AS total_recalls,
                MIN(recall_start_date) AS min_publication_date,
                MAX(recall_start_date) AS max_publication_date
            FROM {TABLE_NAME};
        """)
        summary = cur.fetchone()

        # Recall Status Breakdown
        cur.execute(f"""
            SELECT 
                COALESCE(recall_status, 'Unknown') AS category,
                COUNT(*) AS count
            FROM {TABLE_NAME}
            GROUP BY recall_status
            ORDER BY count DESC;
        """)
        status_breakdown = cur.fetchall()

        # License Type Breakdown
        cur.execute(f"""
            SELECT 
                COALESCE(license_type, 'Unspecified') AS risk,
                COUNT(*) AS count
            FROM {TABLE_NAME}
            GROUP BY license_type
            ORDER BY count DESC;
        """)
        license_type_breakdown = cur.fetchall()

        # Nature of Recall Breakdown
        cur.execute(f"""
            SELECT 
                COALESCE(nature_of_recall, 'Unspecified') AS nature,
                COUNT(*) AS count
            FROM {TABLE_NAME}
            GROUP BY nature_of_recall
            ORDER BY count DESC;
        """)
        nature_breakdown = cur.fetchall()

        # Top FBOs
        cur.execute(f"""
            SELECT 
                fbo_name,
                COUNT(*) AS count
            FROM {TABLE_NAME}
            GROUP BY fbo_name
            ORDER BY count DESC
            LIMIT 10;
        """)
        top_fbos = cur.fetchall()

        # Yearly / Monthly timeline
        cur.execute(f"""
            SELECT 
                SUBSTRING(recall_start_date FROM 1 FOR 7) AS year,
                COUNT(*) AS count
            FROM {TABLE_NAME}
            WHERE recall_start_date IS NOT NULL AND LENGTH(recall_start_date) >= 7
            GROUP BY year
            ORDER BY year ASC;
        """)

        yearly_distribution = cur.fetchall()

        cur.close()
        conn.close()

        return {
            "summary": summary,
            "recent_recalls": summary["total_recalls"] if summary else 0,
            "top_categories": status_breakdown,
            "top_risks": license_type_breakdown,
            "nature_breakdown": nature_breakdown,
            "top_fbos": top_fbos,
            "yearly_distribution": yearly_distribution,
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/categories")
def get_categories():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(f"""
            SELECT 
                COALESCE(license_type, 'Unknown') AS name,
                COUNT(*) AS count
            FROM {TABLE_NAME}
            GROUP BY license_type
            ORDER BY count DESC;
        """)
        categories = cur.fetchall()
        cur.close()
        conn.close()
        return {"categories": categories}
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/recalls")
def list_recalls(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    limit: Optional[int] = Query(None, ge=1, le=100),
    offset: Optional[int] = Query(None, ge=0),
    category: Optional[str] = None,          # Filters by license_type or status if provided
    license_type: Optional[str] = None,
    recall_status: Optional[str] = None,
    nature_of_recall: Optional[str] = None,
    search: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    sort_by: Optional[str] = Query("recall_start_date"),
    sort_order: Optional[str] = Query("desc"),
):
    try:
        effective_page_size = limit if limit is not None else page_size
        effective_offset = offset if offset is not None else (page - 1) * effective_page_size
        effective_page = (effective_offset // effective_page_size) + 1

        conn = get_db_connection()
        cur = conn.cursor()

        where_clauses = []
        params: List[Any] = []

        if license_type and license_type.strip() and license_type.lower() != "all":
            where_clauses.append("LOWER(license_type) = LOWER(%s)")
            params.append(license_type.strip())
        elif category and category.strip() and category.lower() != "all":
            # Map category query to license_type or status
            where_clauses.append("(LOWER(license_type) = LOWER(%s) OR LOWER(recall_status) = LOWER(%s))")
            params.extend([category.strip(), category.strip()])

        if recall_status and recall_status.strip() and recall_status.lower() != "all":
            where_clauses.append("LOWER(recall_status) = LOWER(%s)")
            params.append(recall_status.strip())

        if nature_of_recall and nature_of_recall.strip() and nature_of_recall.lower() != "all":
            where_clauses.append("LOWER(nature_of_recall) = LOWER(%s)")
            params.append(nature_of_recall.strip())

        if search and search.strip():
            pattern = f"%{search.strip().lower()}%"
            where_clauses.append("""
                (LOWER(product_name) LIKE %s 
                 OR LOWER(brand_name) LIKE %s
                 OR LOWER(fbo_name) LIKE %s 
                 OR LOWER(reason_for_recall) LIKE %s
                 OR LOWER(license_registration_no) LIKE %s
                 OR LOWER(recall_id) LIKE %s)
            """)
            params.extend([pattern, pattern, pattern, pattern, pattern, pattern])

        if date_from and date_from.strip():
            where_clauses.append("recall_start_date >= %s")
            params.append(date_from.strip())

        if date_to and date_to.strip():
            where_clauses.append("recall_start_date <= %s")
            params.append(date_to.strip())

        where_sql = ("WHERE " + " AND ".join(where_clauses)) if where_clauses else ""

        cur.execute(f"SELECT COUNT(*) AS total FROM {TABLE_NAME} {where_sql};", params)
        total_count = cur.fetchone()["total"]

        allowed_sort_fields = {
            "recall_start_date": "recall_start_date",
            "product_name": "product_name",
            "brand_name": "brand_name",
            "fbo_name": "fbo_name",
            "recall_id": "recall_id",
            "recall_status": "recall_status",
            "license_type": "license_type",
            "nature_of_recall": "nature_of_recall",
        }
        sort_column = allowed_sort_fields.get(str(sort_by).lower(), "recall_start_date")
        direction = "ASC" if str(sort_order).upper() == "ASC" else "DESC"

        query_sql = f"""
            SELECT * FROM {TABLE_NAME}
            {where_sql}
            ORDER BY {sort_column} {direction}, recall_id DESC
            LIMIT %s OFFSET %s;
        """
        cur.execute(query_sql, params + [effective_page_size, effective_offset])
        results = cur.fetchall()

        cur.close()
        conn.close()

        total_pages = math.ceil(total_count / effective_page_size) if effective_page_size > 0 else 1

        return {
            "page": effective_page,
            "page_size": effective_page_size,
            "total": total_count,
            "total_pages": total_pages,
            "results": results,
        }
    except Exception as e:
        logger.error(f"Error listing recalls: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/recalls/{recall_id}")
def get_recall_by_id(recall_id: str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            f"SELECT * FROM {TABLE_NAME} WHERE recall_id = %s OR sr_no::text = %s LIMIT 1;",
            (recall_id, recall_id),
        )
        record = cur.fetchone()
        cur.close()
        conn.close()

        if not record:
            raise HTTPException(status_code=404, detail=f"Recall with identifier '{recall_id}' not found")

        return record
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching recall {recall_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
