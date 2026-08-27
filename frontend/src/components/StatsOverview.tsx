"use client";

import React from "react";
import { ApiStatsResponse } from "@/types/recall";
import { Database, AlertTriangle, ShieldCheck, Award, Activity, Calendar } from "lucide-react";

interface StatsOverviewProps {
  stats: ApiStatsResponse | null;
  loading: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="console-panel" style={{ padding: "1.25rem", height: "110px" }}>
            <div className="skeleton" style={{ height: "16px", width: "50%", marginBottom: "0.75rem" }} />
            <div className="skeleton" style={{ height: "32px", width: "70%" }} />
          </div>
        ))}
      </div>
    );
  }

  const total = stats?.summary?.total_recalls ?? 199;
  
  // Extract breakdown numbers
  let initiatedCount = 125;
  let inProgressCount = 55;
  let completedCount = 19;
  let stateLicenseCount = 156;
  let centralLicenseCount = 43;
  let authorityCount = 142;
  let fboCount = 57;

  if (stats?.top_categories) {
    stats.top_categories.forEach((cat) => {
      const name = cat.category.toLowerCase();
      if (name.includes("initiated")) initiatedCount = cat.count;
      else if (name.includes("in progress")) inProgressCount = cat.count;
      else if (name.includes("completed")) completedCount = cat.count;
    });
  }

  if (stats?.top_risks) {
    stats.top_risks.forEach((risk) => {
      const name = risk.risk.toLowerCase();
      if (name.includes("state")) stateLicenseCount = risk.count;
      else if (name.includes("central")) centralLicenseCount = risk.count;
    });
  }

  if (stats?.nature_breakdown) {
    stats.nature_breakdown.forEach((nat) => {
      const name = nat.nature.toLowerCase();
      if (name.includes("authority")) authorityCount = nat.count;
      else if (name.includes("fbo")) fboCount = nat.count;
    });
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2rem",
      }}
    >
      {/* 1. TOTAL FSSAI RECALLS */}
      <div className="console-panel" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800 }}>
            TOTAL RECALL NOTICES
          </span>
          <Database size={16} color="var(--accent-cyan)" />
        </div>
        <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)", lineHeight: "1" }}>
          {total}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.4rem", fontFamily: "var(--font-mono)" }}>
          FSSAI Official Dataset (2025)
        </div>
      </div>

      {/* 2. RECALL STATUS */}
      <div className="console-panel" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800 }}>
            RECALL STATUS SPLIT
          </span>
          <Activity size={16} color="var(--accent-amber)" />
        </div>
        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)", lineHeight: "1" }}>
          <span style={{ color: "var(--accent-amber)" }}>{initiatedCount}</span> Initiated
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.4rem", fontFamily: "var(--font-mono)" }}>
          <span style={{ color: "var(--accent-cyan)" }}>{inProgressCount} In Progress</span> • <span style={{ color: "var(--accent-green)" }}>{completedCount} Completed</span>
        </div>
      </div>

      {/* 3. LICENSE JURISDICTION */}
      <div className="console-panel" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800 }}>
            LICENSE TYPE BREAKDOWN
          </span>
          <Award size={16} color="var(--accent-purple)" />
        </div>
        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)", lineHeight: "1" }}>
          <span style={{ color: "var(--accent-purple)" }}>{stateLicenseCount}</span> State License
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.4rem", fontFamily: "var(--font-mono)" }}>
          <span style={{ color: "var(--accent-cyan)" }}>{centralLicenseCount} Central Licenses</span>
        </div>
      </div>

      {/* 4. INITIATION SOURCE */}
      <div className="console-panel" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800 }}>
            INITIATING ENTITY
          </span>
          <ShieldCheck size={16} color="var(--accent-green)" />
        </div>
        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)", lineHeight: "1" }}>
          <span style={{ color: "var(--accent-amber)" }}>{authorityCount}</span> Authority
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.4rem", fontFamily: "var(--font-mono)" }}>
          <span style={{ color: "var(--accent-cyan)" }}>{fboCount} Voluntary FBO</span>
        </div>
      </div>
    </div>
  );
};
