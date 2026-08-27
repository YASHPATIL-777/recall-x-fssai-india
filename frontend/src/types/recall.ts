export interface Recall {
  recall_id: string;
  sr_no: number;
  fbo_name: string;
  brand_name?: string | null;
  batch_lot_no?: string | null;
  product_name: string;
  reason_for_recall?: string | null;
  recall_start_date: string;
  recall_status: string; // Initiated | In progress | Completed
  recall_termination_date?: string | null;
  license_registration_no: string;
  license_type: string; // State License | Central License
  nature_of_recall: string; // Initiated by Authority | Initiated by FBO

  // Backward compatibility optional aliases
  reference_fiche?: string;
  categorie_de_produit?: string | null;
  nom_de_la_marque_du_produit?: string | null;
  noms_des_modeles_ou_references?: string | null;
  motif_du_rappel?: string | null;
  date_de_publication?: string | null;
  risques_pour_le_consommateur?: string | null;
}

export interface SummaryStats {
  total_recalls: number;
  min_publication_date: string;
  max_publication_date: string;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface RiskStat {
  risk: string;
  count: number;
}

export interface NatureStat {
  nature: string;
  count: number;
}

export interface FBOStat {
  fbo_name: string;
  count: number;
}

export interface YearlyStat {
  year: string;
  count: number;
}

export interface ApiStatsResponse {
  summary: SummaryStats;
  recent_recalls: number;
  top_categories: CategoryStat[];
  top_risks: RiskStat[];
  nature_breakdown?: NatureStat[];
  top_fbos?: FBOStat[];
  yearly_distribution: YearlyStat[];
}

export interface CategoryItem {
  name: string;
  count: number;
}

export interface CategoriesResponse {
  categories: CategoryItem[];
}

export interface RecallsResponse {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  results: Recall[];
}

export interface HealthResponse {
  status: string;
  database: string;
  table?: string;
}
