"use client";

import React from "react";
import { Recall } from "@/types/recall";
import {
  formatNullField,
  formatDateString,
  getStatusStyle,
  getLicenseStyle,
} from "@/lib/localization";
import { ArrowRight, Calendar, Building2, Tag, ShieldCheck } from "lucide-react";

interface RecallCardProps {
  recall: Recall;
  onSelect: (recall: Recall) => void;
}

export const RecallCard: React.FC<RecallCardProps> = ({ recall, onSelect }) => {
  const statusStyle = getStatusStyle(recall.recall_status);
  const licenseStyle = getLicenseStyle(recall.license_type);

  const productName = recall.product_name || "UNSPECIFIED PRODUCT";
  const fboName = recall.fbo_name || "UNSPECIFIED FBO";
  const brandName = formatNullField(recall.brand_name);
  const reasonText = formatNullField(recall.reason_for_recall, "Reason not specified");
  const recallId = recall.recall_id || `ID-${recall.sr_no}`;
  const startDate = recall.recall_start_date;

  return (
    <div
      className="console-panel console-panel-interactive"
      style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1rem",
        position: "relative",
      }}
    >
      <div>
        {/* Header Ticker: LICENSE TYPE + RECALL STATUS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            marginBottom: "0.75rem",
            paddingBottom: "0.5rem",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <span className={licenseStyle.className} style={{ fontSize: "0.68rem" }}>
            {licenseStyle.label}
          </span>

          <span className={statusStyle.className} style={{ fontSize: "0.68rem" }}>
            <span className="pulse-dot" />
            {statusStyle.label}
          </span>
        </div>

        {/* FBO / PRODUCT NAME */}
        <div style={{ marginBottom: "0.5rem" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              fontWeight: 800,
              color: "var(--accent-cyan)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              marginBottom: "0.15rem",
            }}
          >
            <Building2 size={12} /> {fboName}
          </div>

          <h3
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: "1.25",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {productName}
          </h3>
        </div>

        {/* BRAND & BATCH INFO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.78rem",
            fontFamily: "var(--font-mono)",
            color: "var(--text-secondary)",
            marginBottom: "0.85rem",
          }}
        >
          <span>
            <strong style={{ color: "var(--text-muted)" }}>BRAND:</strong> {brandName}
          </span>
          <span>•</span>
          <span>
            <strong style={{ color: "var(--text-muted)" }}>BATCH:</strong>{" "}
            {formatNullField(recall.batch_lot_no)}
          </span>
        </div>

        {/* RECALL REASON */}
        <div
          style={{
            background: "var(--bg-panel-elevated)",
            borderLeft: "2px solid var(--accent-amber)",
            padding: "0.55rem 0.75rem",
            fontSize: "0.8rem",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: "0.85rem",
            borderRadius: "0 4px 4px 0",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: "var(--accent-amber)",
              fontWeight: 800,
              marginBottom: "0.15rem",
            }}
          >
            REASON FOR RECALL
          </div>
          <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {reasonText}
          </span>
        </div>
      </div>

      {/* Footer Meta & Action */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "0.6rem",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            gap: "0.1rem",
          }}
        >
          <span>ID: {recallId}</span>
          <span style={{ fontSize: "0.68rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.2rem" }}>
            <Calendar size={10} /> {formatDateString(startDate)}
          </span>
        </div>

        <button
          onClick={() => onSelect(recall)}
          className="btn-console btn-console-primary btn-console-sm"
        >
          INSPECT <ArrowRight size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
