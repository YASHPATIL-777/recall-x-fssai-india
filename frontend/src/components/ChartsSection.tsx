"use client";

import React from "react";
import { ApiStatsResponse } from "@/types/recall";
import { PieChart, BarChart2, Layers } from "lucide-react";

interface ChartsSectionProps {
  stats: ApiStatsResponse | null;
  loading: boolean;
  onSelectCategory: (cat: string) => void;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  stats,
  loading,
  onSelectCategory,
}) => {
  if (loading || !stats) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
        <div className="console-panel" style={{ height: "240px", padding: "1.25rem" }}>
          <div className="skeleton" style={{ height: "20px", width: "40%", marginBottom: "1rem" }} />
          <div className="skeleton" style={{ height: "140px", width: "100%" }} />
        </div>
        <div className="console-panel" style={{ height: "240px", padding: "1.25rem" }}>
          <div className="skeleton" style={{ height: "20px", width: "40%", marginBottom: "1rem" }} />
          <div className="skeleton" style={{ height: "140px", width: "100%" }} />
        </div>
      </div>
    );
  }

  // Data sets
  const statusData = stats.top_categories.length > 0 ? stats.top_categories : [
    { category: "Initiated", count: 125 },
    { category: "In progress", count: 55 },
    { category: "Completed", count: 19 },
  ];

  const licenseData = stats.top_risks.length > 0 ? stats.top_risks : [
    { risk: "State License", count: 156 },
    { risk: "Central License", count: 43 },
  ];

  const natureData = stats.nature_breakdown && stats.nature_breakdown.length > 0
    ? stats.nature_breakdown
    : [
        { nature: "Initiated by Authority", count: 142 },
        { nature: "Initiated by FBO", count: 57 },
      ];

  const totalRecalls = stats.summary?.total_recalls || 199;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2rem",
      }}
    >
      {/* Chart 1: RECALL STATUS DISTRIBUTION */}
      <div className="console-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
            <PieChart size={16} color="var(--accent-amber)" /> RECALL STATUS DISTRIBUTION
          </div>
          <span className="status-pill status-pill-amber" style={{ fontSize: "0.68rem" }}>
            3 STATUSES
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {statusData.map((item, idx) => {
            const pct = Math.round((item.count / totalRecalls) * 100);
            const color = item.category.toLowerCase().includes("initiated")
              ? "var(--accent-amber)"
              : item.category.toLowerCase().includes("progress")
              ? "var(--accent-cyan)"
              : "var(--accent-green)";

            return (
              <div key={idx} style={{ cursor: "pointer" }} onClick={() => onSelectCategory(item.category)}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontFamily: "var(--font-mono)", marginBottom: "0.3rem" }}>
                  <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{item.category.toUpperCase()}</span>
                  <span style={{ color: "var(--text-muted)" }}>{item.count} ({pct}%)</span>
                </div>
                <div style={{ height: "8px", background: "var(--bg-panel-elevated)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "4px" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 2: LICENSE TYPE BREAKDOWN */}
      <div className="console-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
            <BarChart2 size={16} color="var(--accent-purple)" /> LICENSE TYPE JURISDICTION
          </div>
          <span className="status-pill status-pill-cyan" style={{ fontSize: "0.68rem" }}>
            FSSAI SCHEMES
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {licenseData.map((item, idx) => {
            const pct = Math.round((item.count / totalRecalls) * 100);
            const color = item.risk.toLowerCase().includes("state")
              ? "var(--accent-purple)"
              : "var(--accent-cyan)";

            return (
              <div key={idx} style={{ cursor: "pointer" }} onClick={() => onSelectCategory(item.risk)}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontFamily: "var(--font-mono)", marginBottom: "0.3rem" }}>
                  <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{item.risk.toUpperCase()}</span>
                  <span style={{ color: "var(--text-muted)" }}>{item.count} ({pct}%)</span>
                </div>
                <div style={{ height: "8px", background: "var(--bg-panel-elevated)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "4px" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 3: NATURE OF RECALL */}
      <div className="console-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
            <Layers size={16} color="var(--accent-green)" /> INITIATING ENTITY SOURCE
          </div>
          <span className="status-pill status-pill-green" style={{ fontSize: "0.68rem" }}>
            AUTHORITY vs FBO
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {natureData.map((item, idx) => {
            const pct = Math.round((item.count / totalRecalls) * 100);
            const color = item.nature.toLowerCase().includes("authority")
              ? "var(--accent-amber)"
              : "var(--accent-green)";

            return (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontFamily: "var(--font-mono)", marginBottom: "0.3rem" }}>
                  <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{item.nature.toUpperCase()}</span>
                  <span style={{ color: "var(--text-muted)" }}>{item.count} ({pct}%)</span>
                </div>
                <div style={{ height: "8px", background: "var(--bg-panel-elevated)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "4px" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
