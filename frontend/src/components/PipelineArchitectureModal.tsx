"use client";

import React, { useEffect } from "react";
import { X, Database, Terminal, Cpu, Layers, Server, Activity, ArrowRight, ShieldCheck } from "lucide-react";

interface PipelineArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PipelineArchitectureModal: React.FC<PipelineArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="console-panel"
        style={{
          width: "100%",
          maxWidth: "900px",
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
          }}
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="status-pill status-pill-cyan" style={{ marginBottom: "0.5rem" }}>
            SYSTEM SPECIFICATION
          </span>
          <h2 style={{ fontSize: "1.65rem", fontWeight: 700, color: "var(--text-primary)" }}>
            FSSAI INDIA FOOD RECALL DATA ENGINEERING PIPELINE ARCHITECTURE
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.35rem" }}>
            End-to-end stream ingestion, PySpark deduplication, PostgreSQL persistence, REST API, and RECALL//X Dashboard.
          </p>
        </div>

        {/* Architecture Flow Diagram */}
        <div
          style={{
            background: "var(--bg-panel-elevated)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--border-radius-md)",
            padding: "1.5rem",
            marginBottom: "1.75rem",
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 800, color: "var(--accent-cyan)", marginBottom: "1rem" }}>
            PIPELINE DATA FLOW
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "0.75rem",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ background: "var(--bg-panel)", padding: "0.85rem 0.5rem", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
              <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--accent-cyan)", fontWeight: 800 }}>SOURCE</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "0.2rem" }}>FSSAI Excel</div>
            </div>

            <div style={{ color: "var(--text-muted)", display: "flex", justifyContent: "center" }}>➔</div>

            <div style={{ background: "var(--bg-panel)", padding: "0.85rem 0.5rem", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
              <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--accent-green)", fontWeight: 800 }}>STREAM</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "0.2rem" }}>Apache Kafka</div>
            </div>

            <div style={{ color: "var(--text-muted)", display: "flex", justifyContent: "center" }}>➔</div>

            <div style={{ background: "var(--bg-panel)", padding: "0.85rem 0.5rem", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
              <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--accent-amber)", fontWeight: 800 }}>COMPUTE</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "0.2rem" }}>PySpark 3.5</div>
            </div>

            <div style={{ color: "var(--text-muted)", display: "flex", justifyContent: "center" }}>➔</div>

            <div style={{ background: "var(--bg-panel)", padding: "0.85rem 0.5rem", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
              <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--accent-green)", fontWeight: 800 }}>STORAGE</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "0.2rem" }}>PostgreSQL</div>
            </div>

            <div style={{ color: "var(--text-muted)", display: "flex", justifyContent: "center" }}>➔</div>

            <div style={{ background: "var(--bg-panel)", padding: "0.85rem 0.5rem", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
              <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--accent-purple)", fontWeight: 800 }}>PRESENTATION</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "0.2rem" }}>Next.js UI</div>
            </div>
          </div>
        </div>

        {/* Technical Specs List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", fontSize: "0.85rem" }}>
          <div style={{ background: "var(--bg-panel-elevated)", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent-cyan)", marginBottom: "0.4rem" }}>
              DATA INGESTION
            </h4>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.4" }}>
              Reads 199 official FSSAI food recall records from <code>data/india_food_recalls.xlsx</code>, preserving exact 13 attributes and missing NULL states.
            </p>
          </div>

          <div style={{ background: "var(--bg-panel-elevated)", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent-amber)", marginBottom: "0.4rem" }}>
              STREAMING & SPARK
            </h4>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.4" }}>
              Kafka topic <code>india_food_recalls</code> feeds PySpark structured streaming micro-batches, enforcing schema validation and primary key deduplication.
            </p>
          </div>

          <div style={{ background: "var(--bg-panel-elevated)", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent-green)", marginBottom: "0.4rem" }}>
              POSTGRESQL & FASTAPI
            </h4>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.4" }}>
              PostgreSQL table <code>india_food_recalls_table</code> queried by FastAPI REST endpoints serving high-performance paginated queries and analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
