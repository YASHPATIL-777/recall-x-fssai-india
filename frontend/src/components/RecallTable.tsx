"use client";

import React from "react";
import { Recall } from "@/types/recall";
import {
  formatNullField,
  formatDateString,
  getStatusStyle,
  getLicenseStyle,
} from "@/lib/localization";
import { ArrowRight, Calendar, Building2, Tag } from "lucide-react";

interface RecallTableProps {
  recalls: Recall[];
  onSelect: (recall: Recall) => void;
}

export const RecallTable: React.FC<RecallTableProps> = ({ recalls, onSelect }) => {
  return (
    <div
      className="console-panel"
      style={{
        width: "100%",
        overflowX: "auto",
        marginBottom: "2rem",
      }}
    >
      <table className="console-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color)", background: "var(--bg-panel-elevated)" }}>
            <th style={{ padding: "0.85rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800 }}>
              RECALL ID
            </th>
            <th style={{ padding: "0.85rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800 }}>
              PRODUCT NAME
            </th>
            <th style={{ padding: "0.85rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800 }}>
              FBO / BRAND
            </th>
            <th style={{ padding: "0.85rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800 }}>
              LICENSE TYPE
            </th>
            <th style={{ padding: "0.85rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800 }}>
              RECALL STATUS
            </th>
            <th style={{ padding: "0.85rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800 }}>
              START DATE
            </th>
            <th style={{ padding: "0.85rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800, textAlign: "right" }}>
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>
          {recalls.map((recall, idx) => {
            const statusStyle = getStatusStyle(recall.recall_status);
            const licenseStyle = getLicenseStyle(recall.license_type);

            const recallId = recall.recall_id || recall.reference_fiche || `ID-${recall.sr_no}`;
            const productName = recall.product_name || recall.noms_des_modeles_ou_references || "UNSPECIFIED PRODUCT";
            const fboName = recall.fbo_name || "UNSPECIFIED FBO";
            const brandName = formatNullField(recall.brand_name || recall.nom_de_la_marque_du_produit);
            const startDate = recall.recall_start_date || recall.date_de_publication;

            return (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid var(--border-color)",
                  transition: "background 0.15s ease",
                }}
                className="table-row-hover"
              >
                {/* ID */}
                <td style={{ padding: "0.85rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700, color: "var(--accent-cyan)" }}>
                  {recallId}
                </td>

                {/* Product */}
                <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", maxWidth: "260px" }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {productName}
                  </div>
                </td>

                {/* FBO / Brand */}
                <td style={{ padding: "0.85rem 1rem", fontSize: "0.82rem" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{fboName}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Brand: {brandName}
                  </div>
                </td>

                {/* License */}
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span className={licenseStyle.className} style={{ fontSize: "0.68rem" }}>
                    {licenseStyle.label}
                  </span>
                </td>

                {/* Status */}
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span className={statusStyle.className} style={{ fontSize: "0.68rem" }}>
                    <span className="pulse-dot" /> {statusStyle.label}
                  </span>
                </td>

                {/* Start Date */}
                <td style={{ padding: "0.85rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                  {formatDateString(startDate)}
                </td>

                {/* Action */}
                <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                  <button
                    onClick={() => onSelect(recall)}
                    className="btn-console btn-console-primary btn-console-sm"
                  >
                    INSPECT <ArrowRight size={12} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
