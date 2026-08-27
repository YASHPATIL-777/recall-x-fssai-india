"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsOverview } from "@/components/StatsOverview";
import { ChartsSection } from "@/components/ChartsSection";
import { FilterBar } from "@/components/FilterBar";
import { RecallCard } from "@/components/RecallCard";
import { RecallTable } from "@/components/RecallTable";
import { RecallDetailModal } from "@/components/RecallDetailModal";
import { PipelineArchitectureModal } from "@/components/PipelineArchitectureModal";
import { Pagination } from "@/components/Pagination";
import {
  fetchStats,
  fetchCategories,
  fetchRecalls,
  RecallQueryParams,
} from "@/lib/api";
import {
  ApiStatsResponse,
  CategoryItem,
  Recall,
  RecallsResponse,
} from "@/types/recall";
import { AlertCircle, RefreshCw, Terminal, ShieldCheck, Database, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  // Global & Data state
  const [stats, setStats] = useState<ApiStatsResponse | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [recallsData, setRecallsData] = useState<RecallsResponse | null>(null);

  // Filter & Pagination state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [licenseType, setLicenseType] = useState("all");
  const [recallStatus, setRecallStatus] = useState("all");
  const [natureOfRecall, setNatureOfRecall] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("recall_start_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals & UI state
  const [selectedRecall, setSelectedRecall] = useState<Recall | null>(null);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecalls, setLoadingRecalls] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stats and categories on mount
  useEffect(() => {
    setLoadingStats(true);
    Promise.all([fetchStats(), fetchCategories()])
      .then(([statsRes, catsRes]) => {
        setStats(statsRes);
        setCategories(catsRes.categories);
      })
      .catch((err) => {
        console.error("Failed to load initial metadata:", err);
      })
      .finally(() => setLoadingStats(false));
  }, []);

  // Fetch recalls whenever filters or pagination change
  const loadRecalls = useCallback(() => {
    setLoadingRecalls(true);
    setError(null);

    const params: RecallQueryParams = {
      page,
      pageSize,
      category: category !== "all" ? category : undefined,
      licenseType: licenseType !== "all" ? licenseType : undefined,
      recallStatus: recallStatus !== "all" ? recallStatus : undefined,
      natureOfRecall: natureOfRecall !== "all" ? natureOfRecall : undefined,
      search: search.trim() || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy,
      sortOrder,
    };

    fetchRecalls(params)
      .then((res) => {
        setRecallsData(res);
      })
      .catch((err) => {
        console.error("Error loading recalls:", err);
        setError(err.message || "Failed to load recall records");
      })
      .finally(() => setLoadingRecalls(false));
  }, [page, pageSize, category, licenseType, recallStatus, natureOfRecall, search, dateFrom, dateTo, sortBy, sortOrder]);

  useEffect(() => {
    loadRecalls();
  }, [loadRecalls]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("all");
    setLicenseType("all");
    setRecallStatus("all");
    setNatureOfRecall("all");
    setDateFrom("");
    setDateTo("");
    setSortBy("recall_start_date");
    setSortOrder("desc");
    setPage(1);
  };

  const handleCategorySelectFromChart = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes("state") || lower.includes("central")) {
      setLicenseType(catName);
    } else if (lower.includes("initiated") || lower.includes("progress") || lower.includes("completed")) {
      setRecallStatus(catName);
    } else {
      setCategory(catName);
    }
    setPage(1);
    const element = document.getElementById("recall-records-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Navbar onOpenArchitecture={() => setIsArchitectureOpen(true)} />

      {/* Main Content Container */}
      <main className="container" style={{ flex: 1, padding: "2rem 1.25rem" }}>
        {/* Terminal Hero Section */}
        <section
          className="console-panel"
          style={{
            padding: "2rem",
            marginBottom: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            <div>
              {/* Badges Ticker */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <span className="status-pill status-pill-green">
                  <span className="pulse-dot" /> INDIA FSSAI LIVE DATA
                </span>
                <span className="status-pill status-pill-cyan">KAFKA</span>
                <span className="status-pill status-pill-cyan">SPARK 3.5</span>
                <span className="status-pill status-pill-cyan">POSTGRESQL</span>
                <span className="status-pill status-pill-cyan">AIRFLOW</span>
              </div>

              {/* Main Heading */}
              <h1
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.05",
                  color: "var(--text-primary)",
                  marginBottom: "0.85rem",
                }}
              >
                INDIA FSSAI FOOD RECALL<br />
                INTELLIGENCE CONSOLE<span style={{ color: "var(--accent-green)" }}>.</span>
              </h1>

              {/* Supporting Text */}
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  maxWidth: "720px",
                  lineHeight: "1.45",
                  marginBottom: "1.25rem",
                }}
              >
                Automated data engineering pipeline ingesting 199 official Indian Food Safety and Standards Authority (FSSAI) food recall notices via Kafka → PySpark → PostgreSQL.
              </p>

              {/* Data Pipeline Flow Diagram */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  flexWrap: "wrap",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  background: "var(--bg-panel-elevated)",
                  padding: "0.6rem 0.85rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--border-radius-sm)",
                  width: "fit-content",
                }}
              >
                <span style={{ color: "var(--accent-cyan)" }}>FSSAI EXCEL</span>
                <span>➔</span>
                <span style={{ color: "var(--accent-green)" }}>KAFKA</span>
                <span>➔</span>
                <span style={{ color: "var(--accent-amber)" }}>PYSPARK</span>
                <span>➔</span>
                <span style={{ color: "var(--accent-green)" }}>POSTGRESQL</span>
                <span>➔</span>
                <span style={{ color: "var(--accent-cyan)" }}>FASTAPI</span>
                <span>➔</span>
                <span style={{ color: "var(--text-primary)" }}>NEXT.JS</span>
              </div>
            </div>

            {/* System Telemetry Side Panel */}
            <div
              style={{
                background: "var(--bg-panel-elevated)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--border-radius-md)",
                padding: "1.15rem 1.25rem",
                minWidth: "260px",
                boxShadow: "var(--panel-shadow)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                  marginBottom: "0.85rem",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "0.4rem",
                }}
              >
                SYSTEM TELEMETRY
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>EXCEL INGESTION</span>
                  <span style={{ color: "var(--accent-green)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span className="pulse-dot" /> ONLINE
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>KAFKA STREAM</span>
                  <span style={{ color: "var(--accent-green)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span className="pulse-dot" /> ONLINE
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>POSTGRES DB</span>
                  <span style={{ color: "var(--accent-green)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span className="pulse-dot" /> ONLINE
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>FASTAPI REST API</span>
                  <span style={{ color: "var(--accent-green)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span className="pulse-dot" /> ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPI Metric Panels */}
        <StatsOverview stats={stats} loading={loadingStats} />

        {/* Analytics & Distribution Charts */}
        <ChartsSection
          stats={stats}
          loading={loadingStats}
          onSelectCategory={handleCategorySelectFromChart}
        />

        {/* Search & Filter Command Bar */}
        <div id="recall-records-section">
          <FilterBar
            categories={categories}
            search={search}
            category={category}
            licenseType={licenseType}
            recallStatus={recallStatus}
            natureOfRecall={natureOfRecall}
            dateFrom={dateFrom}
            dateTo={dateTo}
            sortBy={sortBy}
            sortOrder={sortOrder}
            viewMode={viewMode}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            onCategoryChange={(val) => {
              setCategory(val);
              setPage(1);
            }}
            onLicenseTypeChange={(val) => {
              setLicenseType(val);
              setPage(1);
            }}
            onRecallStatusChange={(val) => {
              setRecallStatus(val);
              setPage(1);
            }}
            onNatureOfRecallChange={(val) => {
              setNatureOfRecall(val);
              setPage(1);
            }}
            onDateFromChange={(val) => {
              setDateFrom(val);
              setPage(1);
            }}
            onDateToChange={(val) => {
              setDateTo(val);
              setPage(1);
            }}
            onSortByChange={(val) => setSortBy(val)}
            onSortOrderToggle={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            onViewModeChange={(mode) => setViewMode(mode)}
            onReset={handleResetFilters}
          />
        </div>

        {/* Error Banner */}
        {error && (
          <div
            className="console-panel"
            style={{
              padding: "2rem",
              marginBottom: "2rem",
              border: "1px solid var(--accent-danger)",
              background: "var(--accent-danger-dim)",
              textAlign: "center",
            }}
          >
            <AlertCircle size={36} color="var(--accent-danger)" strokeWidth={2.5} style={{ margin: "0 auto 0.85rem" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              DATABASE QUERY ERROR
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              {error}. Ensure the FastAPI REST service is running and connected to local PostgreSQL.
            </p>
            <button onClick={loadRecalls} className="btn-console btn-console-primary btn-console-sm">
              <RefreshCw size={14} /> RETRY QUERY
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loadingRecalls && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2rem",
            }}
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="console-panel" style={{ padding: "1.25rem", height: "220px" }}>
                <div className="skeleton" style={{ height: "20px", width: "40%", marginBottom: "0.85rem" }} />
                <div className="skeleton" style={{ height: "24px", width: "75%", marginBottom: "0.5rem" }} />
                <div className="skeleton" style={{ height: "16px", width: "90%", marginBottom: "1.25rem" }} />
                <div className="skeleton" style={{ height: "40px", width: "100%" }} />
              </div>
            ))}
          </div>
        )}

        {/* Recall Records Grid vs Table */}
        {!loadingRecalls && !error && recallsData && (
          <>
            {recallsData.results.length === 0 ? (
              <div
                className="console-panel"
                style={{
                  padding: "3.5rem 2rem",
                  textAlign: "center",
                  marginBottom: "2rem",
                }}
              >
                <Terminal size={48} strokeWidth={2} color="var(--text-muted)" style={{ margin: "0 auto 1rem" }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                  NO RECALL NOTICES MATCH QUERY
                </h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text-muted)",
                    maxWidth: "460px",
                    margin: "0 auto 1.25rem",
                  }}
                >
                  Zero notices match your active query criteria. Try adjusting search keywords, license type, or recall status filter.
                </p>
                <button onClick={handleResetFilters} className="btn-console btn-console-primary btn-console-sm">
                  CLEAR ALL FILTERS
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.25rem",
                  marginBottom: "2rem",
                }}
              >
                {recallsData.results.map((recall, idx) => (
                  <RecallCard
                    key={idx}
                    recall={recall}
                    onSelect={(r) => setSelectedRecall(r)}
                  />
                ))}
              </div>
            ) : (
              <RecallTable
                recalls={recallsData.results}
                onSelect={(r) => setSelectedRecall(r)}
              />
            )}

            {/* Pagination Controls */}
            <Pagination
              currentPage={recallsData.page}
              totalPages={recallsData.total_pages}
              totalRecords={recallsData.total}
              pageSize={recallsData.page_size}
              onPageChange={(p) => setPage(p)}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPage(1);
              }}
            />
          </>
        )}
      </main>

      {/* Terminal Noir Footer */}
      <footer
        style={{
          background: "var(--bg-panel)",
          borderTop: "1px solid var(--border-color)",
          padding: "2rem 0",
          marginTop: "auto",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.2rem",
              }}
            >
              RECALL<span style={{ color: "var(--accent-green)" }}>//X</span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "var(--text-muted)",
              }}
            >
              FSSAI INDIA FOOD SAFETY RECALL PIPELINE
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span className="status-pill status-pill-green" style={{ fontSize: "0.7rem" }}>
              <span className="pulse-dot" /> API ONLINE
            </span>
            <span className="status-pill status-pill-cyan" style={{ fontSize: "0.7rem" }}>
              LOCAL POSTGRESQL CONNECTED
            </span>
            <span className="status-pill status-pill-green" style={{ fontSize: "0.7rem" }}>
              PIPELINE ONLINE
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
            }}
          >
            <span>STACK:</span>
            <span className="status-pill" style={{ fontSize: "0.68rem" }}>Kafka</span>
            <span className="status-pill" style={{ fontSize: "0.68rem" }}>PySpark</span>
            <span className="status-pill" style={{ fontSize: "0.68rem" }}>PostgreSQL</span>
            <span className="status-pill" style={{ fontSize: "0.68rem" }}>Airflow</span>
            <span className="status-pill" style={{ fontSize: "0.68rem" }}>FastAPI</span>
            <span className="status-pill" style={{ fontSize: "0.68rem" }}>Next.js</span>
          </div>
        </div>
      </footer>

      {/* Detail Dossier Modal */}
      <RecallDetailModal
        recall={selectedRecall}
        onClose={() => setSelectedRecall(null)}
      />

      {/* Architecture Poster Modal */}
      <PipelineArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
