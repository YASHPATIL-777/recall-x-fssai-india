"""
Migration / Seeding Script for Railway PostgreSQL.

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

# 25 DB Fields matching rappel_conso_table
DB_FIELDS = [
    "reference_fiche",
    "liens_vers_les_images",
    "lien_vers_la_liste_des_produits",
    "lien_vers_la_liste_des_distributeurs",
    "lien_vers_affichette_pdf",
    "lien_vers_la_fiche_rappel",
    "date_de_publication",
    "date_de_fin_de_la_procedure_de_rappel",
    "categorie_de_produit",
    "sous_categorie_de_produit",
    "nom_de_la_marque_du_produit",
    "noms_des_modeles_ou_references",
    "identification_des_produits",
    "conditionnements",
    "temperature_de_conservation",
    "zone_geographique_de_vente",
    "distributeurs",
    "motif_du_rappel",
    "numero_de_contact",
    "modalites_de_compensation",
    "risques_pour_le_consommateur",
    "recommandations_sante",
    "date_debut_commercialisation",
    "date_fin_commercialisation",
    "informations_complementaires",
]


def create_schema_in_target(target_conn):
    """Creates the rappel_conso_table in the target Railway database."""
    print("--> [1/3] Creating table schema and indexes in Railway PostgreSQL...")
    columns_sql = ",\n    ".join(
        [f"{col} VARCHAR(255) PRIMARY KEY" if col == "reference_fiche" else f"{col} TEXT" for col in DB_FIELDS]
    )
    create_sql = f"""
    CREATE TABLE IF NOT EXISTS rappel_conso_table (
        {columns_sql}
    );
    CREATE INDEX IF NOT EXISTS idx_rappel_date ON rappel_conso_table (date_de_publication);
    CREATE INDEX IF NOT EXISTS idx_rappel_category ON rappel_conso_table (categorie_de_produit);
    """
    with target_conn.cursor() as cur:
        cur.execute(create_sql)
    target_conn.commit()
    print("    [OK] Table 'rappel_conso_table' & indexes created.")


def migrate_data(target_url: str, local_api_url: str = "http://localhost:8001"):
    """Fetches records from local stack and streams them in batches into Railway PostgreSQL."""
    print(f"--> [2/3] Connecting to Railway Database...")
    target_conn = psycopg2.connect(target_url)

    try:
        create_schema_in_target(target_conn)

        print(f"--> [3/3] Streaming records from local backend ({local_api_url})...")
        
        # Test first page
        res0 = requests.get(f"{local_api_url}/api/recalls?page=1&page_size=100").json()
        total_records = res0.get("total", 0)
        total_pages = res0.get("total_pages", 0)
        print(f"    Total records to migrate: {total_records} across {total_pages} batches.")

        cols = DB_FIELDS
        insert_sql = f"""
        INSERT INTO rappel_conso_table ({", ".join(cols)})
        VALUES %s
        ON CONFLICT (reference_fiche) DO NOTHING;
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

        # Verify final count in target
        with target_conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM rappel_conso_table;")
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
