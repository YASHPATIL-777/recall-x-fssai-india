import pandas as pd
import datetime


def parse_date_string(val):
    if pd.isna(val) or val is None or str(val).strip() == "":
        return None
    val_str = str(val).strip()
    if isinstance(val, (pd.Timestamp, datetime.date, datetime.datetime)):
        return val.strftime("%Y-%m-%d")
    try:
        parts = val_str.split("-")
        if len(parts) == 3:
            if len(parts[0]) == 2 and len(parts[2]) == 4:
                day, month, year = parts[0], parts[1], parts[2]
                return f"{year}-{month:0>2}-{day:0>2}"
            elif len(parts[0]) == 4:
                return val_str
        dt = pd.to_datetime(val_str, dayfirst=True)
        return dt.strftime("%Y-%m-%d")
    except Exception:
        return None


def clean_string_val(val):
    if pd.isna(val) or val is None:
        return None
    val_str = str(val).strip()
    return val_str if val_str != "" else None


def transform_india_row(row: dict) -> dict:
    """
    Transforms a single Excel row dict into standardized India recall schema dictionary.
    Preserves None for missing fields.
    """
    return {
        "sr_no": int(row["Sr.No"]) if "Sr.No" in row and not pd.isna(row["Sr.No"]) else None,
        "recall_id": clean_string_val(row.get("Recall Id")),
        "fbo_name": clean_string_val(row.get("FBO Name")),
        "brand_name": clean_string_val(row.get("Brand Name")),
        "batch_lot_no": clean_string_val(row.get("Batch / Lot No.")),
        "product_name": clean_string_val(row.get("Product")),
        "reason_for_recall": clean_string_val(row.get("Reason for Recall")),
        "recall_start_date": parse_date_string(row.get("Recall Start Date")),
        "recall_status": clean_string_val(row.get("Recall Status")),
        "recall_termination_date": parse_date_string(row.get("Recall Termination Date")),
        "license_registration_no": clean_string_val(row.get("License / Registration No.")),
        "license_type": clean_string_val(row.get("License Type [Central/State/Registration]")),
        "nature_of_recall": clean_string_val(row.get("Nature of Recall")),
    }
