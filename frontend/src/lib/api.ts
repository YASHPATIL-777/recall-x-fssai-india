import {
  ApiStatsResponse,
  CategoriesResponse,
  HealthResponse,
  Recall,
  RecallsResponse,
} from "@/types/recall";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8001";

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchStats(): Promise<ApiStatsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/stats`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch stats: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchCategories(): Promise<CategoriesResponse> {
  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.statusText}`);
  }
  return res.json();
}

export interface RecallQueryParams {
  page?: number;
  pageSize?: number;
  category?: string;
  licenseType?: string;
  recallStatus?: string;
  natureOfRecall?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function fetchRecalls(params: RecallQueryParams = {}): Promise<RecallsResponse> {
  const query = new URLSearchParams();

  if (params.page) query.set("page", params.page.toString());
  if (params.pageSize) query.set("page_size", params.pageSize.toString());
  if (params.category && params.category !== "all") query.set("category", params.category);
  if (params.licenseType && params.licenseType !== "all") query.set("license_type", params.licenseType);
  if (params.recallStatus && params.recallStatus !== "all") query.set("recall_status", params.recallStatus);
  if (params.natureOfRecall && params.natureOfRecall !== "all") query.set("nature_of_recall", params.natureOfRecall);
  if (params.search && params.search.trim()) query.set("search", params.search.trim());
  if (params.dateFrom) query.set("date_from", params.dateFrom);
  if (params.dateTo) query.set("date_to", params.dateTo);
  if (params.sortBy) query.set("sort_by", params.sortBy);
  if (params.sortOrder) query.set("sort_order", params.sortOrder);

  const url = `${API_BASE_URL}/api/recalls?${query.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch recalls: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchRecallById(id: string): Promise<Recall> {
  const res = await fetch(`${API_BASE_URL}/api/recalls/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Recall ${id} not found (${res.status})`);
  }
  return res.json();
}
