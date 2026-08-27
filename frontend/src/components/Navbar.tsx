"use client";

import React from "react";
import { Terminal, ShieldCheck, Activity, Cpu } from "lucide-react";

interface NavbarProps {
  onOpenArchitecture: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenArchitecture }) => {
  return (
    <header
      style={{
        background: "var(--bg-panel)",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          padding: "0 1.25rem",
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "var(--accent-cyan-dim)",
              border: "1px solid var(--accent-cyan)",
              borderRadius: "var(--border-radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-cyan)",
            }}
          >
            <Terminal size={20} strokeWidth={2.5} />
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              RECALL<span style={{ color: "var(--accent-green)" }}>//X</span>
              <span
                className="status-pill status-pill-cyan"
                style={{ fontSize: "0.62rem", padding: "0.15rem 0.4rem", marginLeft: "0.4rem" }}
              >
                FSSAI INDIA
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                letterSpacing: "0.04em",
              }}
            >
              FOOD SAFETY RECALL INTELLIGENCE PIPELINE
            </div>
          </div>
        </div>

        {/* System Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <button
            onClick={onOpenArchitecture}
            className="btn-console btn-console-secondary btn-console-sm"
            style={{ fontSize: "0.78rem" }}
          >
            <Cpu size={14} color="var(--accent-cyan)" /> PIPELINE SPECS
          </button>
        </div>
      </div>
    </header>
  );
};
