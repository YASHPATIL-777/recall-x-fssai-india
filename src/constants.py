import os

# API params
PATH_LAST_PROCESSED = os.getenv("CHECKPOINT_FILE", "./data/last_processed.json")
MAX_LIMIT = 100
MAX_OFFSET = 10000

# We have three parameters in the URL:
# 1. MAX_LIMIT: the maximum number of records to be returned by the API
# 2. date_publication: the date from which we want to get the data
# 3. offset: the index of the first result
URL_API = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-trie/records?limit={}&where=date_publication%20%3E%20'{}'&order_by=date_publication%20ASC&offset={}"
URL_API = URL_API.format(MAX_LIMIT, "{}", "{}")

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

NEW_COLUMNS = [
    "risques_pour_le_consommateur",
    "recommandations_sante",
    "date_debut_commercialisation",
    "date_fin_commercialisation",
    "informations_complementaires",
]

COLUMNS_TO_NORMALIZE = [
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
]

COLUMNS_TO_KEEP = [
    "reference_fiche",
    "liens_vers_les_images",
    "lien_vers_la_liste_des_produits",
    "lien_vers_la_liste_des_distributeurs",
    "lien_vers_affichette_pdf",
    "lien_vers_la_fiche_rappel",
    "date_de_publication",
    "date_de_fin_de_la_procedure_de_rappel",
]
DB_FIELDS = COLUMNS_TO_KEEP + COLUMNS_TO_NORMALIZE + NEW_COLUMNS

# INDIA FSSAI PIPELINE PARAMS
INDIA_KAFKA_TOPIC = os.getenv("INDIA_KAFKA_TOPIC", "india_food_recalls")
INDIA_DB_TABLE = os.getenv("INDIA_DB_TABLE", "india_food_recalls_table")
INDIA_EXCEL_PATH = os.getenv("INDIA_EXCEL_PATH", "./data/india_food_recalls.xlsx")

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

