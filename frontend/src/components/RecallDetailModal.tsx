"use client";

import React, { useEffect } from "react";
import { Recall } from "@/types/recall";
import {
  formatNullField,
  formatDateString,
  getStatusStyle,
  getLicenseStyle,
  getNatureStyle,
} from "@/lib/localization";
import {
  X,
  Building2,
  Calendar,
  FileText,
  ShieldAlert,
  Tag,
  AlertTriangle,
  Award,
  Hash,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

interface RecallDetailModalProps {
  recall: Recall | null;
  onClose: () => void;
}

export const RecallDetailModal: React.FC<RecallDetailModalProps> = ({
  recall,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (recall) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [recall, onClose]);

  if (!recall) return null;

  const statusStyle = getStatusStyle(recall.recall_status);
  const licenseStyle = getLicenseStyle(recall.license_type);
  const natureStyle = getNatureStyle(recall.nature_of_recall);

  const recallId = recall.recall_id || `ID-${recall.sr_no}`;
  const productName = recall.product_name || "UNSPECIFIED PRODUCT";
  const fboName = recall.fbo_name || "UNSPECIFIED FBO";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="console-panel"
        style={{
          width: "100%",
          maxWidth: "820px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          position: "relative",
          boxShadow: "var(--panel-shadow)",
          border: "1px solid var(--accent-cyan-dim)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "var(--bg-panel-elevated)",
            border: "1px solid var(--border-color)",
            color: "var(--text-secondary)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header Ticker */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <span className="status-pill status-pill-cyan" style={{ fontFamily: "var(--font-mono)", fontWeight: 800 }}>
            RECALL DOSSIER #{recallId}
          </span>
          <span className={licenseStyle.className}>{licenseStyle.label}</span>
          <span className={statusStyle.className}>
            <span className="pulse-dot" /> {statusStyle.label}
          </span>
          <span className={natureStyle.className}>{natureStyle.label}</span>
        </div>

        {/* Title & FBO */}
        <div style={{ marginBottom: "1.75rem" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              fontWeight: 800,
              color: "var(--accent-cyan)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              marginBottom: "0.35rem",
            }}
          >
            <Building2 size={16} /> {fboName}
          </div>

          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1.65rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
            }}
          >
            {productName}
          </h2>
        </div>

        {/* Grid Attribute Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* Brand Name */}
          <div
            style={{
              background: "var(--bg-panel-elevated)",
              padding: "1rem",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.25rem" }}>
              BRAND NAME
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: recall.brand_name ? "var(--text-primary)" : "var(--text-muted)" }}>
              {formatNullField(recall.brand_name)}
            </div>
          </div>

          {/* Batch / Lot No. */}
          <div
            style={{
              background: "var(--bg-panel-elevated)",
              padding: "1rem",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.25rem" }}>
              BATCH / LOT NO.
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: recall.batch_lot_no ? "var(--text-primary)" : "var(--text-muted)" }}>
              {formatNullField(recall.batch_lot_no)}
            </div>
          </div>

          {/* License / Reg No */}
          <div
            style={{
              background: "var(--bg-panel-elevated)",
              padding: "1rem",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.25rem" }}>
              LICENSE / REGISTRATION NO.
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
              {recall.license_registration_no || "NOT PROVIDED"}
            </div>
          </div>

          {/* Start Date */}
          <div
            style={{
              background: "var(--bg-panel-elevated)",
              padding: "1rem",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.25rem" }}>
              RECALL START DATE
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Calendar size={14} /> {formatDateString(recall.recall_start_date)}
            </div>
          </div>

          {/* Termination Date */}
          <div
            style={{
              background: "var(--bg-panel-elevated)",
              padding: "1rem",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.25rem" }}>
              TERMINATION DATE
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: recall.recall_termination_date ? "var(--accent-green)" : "var(--text-muted)" }}>
              {formatDateString(recall.recall_termination_date)}
            </div>
          </div>

          {/* Serial Number */}
          <div
            style={{
              background: "var(--bg-panel-elevated)",
              padding: "1rem",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.25rem" }}>
              RECORD SR. NO.
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
              #{recall.sr_no}
            </div>
          </div>
        </div>

        {/* Reason for Recall Section */}
        <div
          style={{
            background: "var(--bg-panel-elevated)",
            border: "1px solid var(--border-color)",
            borderLeft: "4px solid var(--accent-amber)",
            padding: "1.25rem",
            borderRadius: "var(--border-radius-sm)",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "var(--accent-amber)",
              marginBottom: "0.4rem",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <AlertTriangle size={15} /> REASON FOR RECALL
          </div>

          <p style={{ fontSize: "0.95rem", color: recall.reason_for_recall ? "var(--text-primary)" : "var(--text-muted)", lineHeight: "1.5" }}>
            {formatNullField(recall.reason_for_recall, "No specific reason detailed in official notice.")}
          </p>
        </div>

        {/* License & Authority Metadata Footer */}
        <div
          style={{
            background: "var(--bg-panel-elevated)",
            padding: "1.15rem 1.25rem",
            borderRadius: "var(--border-radius-sm)",
            border: "1px solid var(--border-color)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            fontSize: "0.82rem",
            fontFamily: "var(--font-mono)",
          }}
        >
          <div>
            <span style={{ color: "var(--text-muted)" }}>LICENSE JURISDICTION: </span>
            <strong style={{ color: "var(--text-primary)" }}>{recall.license_type}</strong>
          </div>

          <div>
            <span style={{ color: "var(--text-muted)" }}>INITIATING AUTHORITY / FBO: </span>
            <strong style={{ color: "var(--text-primary)" }}>{recall.nature_of_recall}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
