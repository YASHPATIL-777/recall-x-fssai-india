"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalRecords === 0) return null;

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="console-panel" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "1rem",
      padding: "1rem 1.25rem",
      marginBottom: "2rem",
    }}>
      {/* Information & Per Page Selector */}
      <div style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        fontFamily: "var(--font-mono)",
        fontSize: "0.78rem",
        fontWeight: 700,
      }}>
        <span className="status-pill status-pill-cyan">
          SHOWING {startRecord.toLocaleString()}—{endRecord.toLocaleString()} OF {totalRecords.toLocaleString()} NOTICES
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)" }}>
          <span>PER PAGE:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="console-input"
            style={{
              padding: "0.2rem 1.8rem 0.2rem 0.5rem",
              fontSize: "0.75rem",
              width: "auto",
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Page Navigation Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="btn-console btn-console-sm"
          style={{ opacity: currentPage <= 1 ? 0.35 : 1, cursor: currentPage <= 1 ? "not-allowed" : "pointer" }}
        >
          <ChevronsLeft size={14} /> FIRST
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn-console btn-console-sm"
          style={{ opacity: currentPage <= 1 ? 0.35 : 1, cursor: currentPage <= 1 ? "not-allowed" : "pointer" }}
        >
          <ChevronLeft size={14} /> PREV
        </button>

        <span className="status-pill status-pill-green">
          PAGE {currentPage} / {totalPages || 1}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn-console btn-console-sm"
          style={{ opacity: currentPage >= totalPages ? 0.35 : 1, cursor: currentPage >= totalPages ? "not-allowed" : "pointer" }}
        >
          NEXT <ChevronRight size={14} />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="btn-console btn-console-sm"
          style={{ opacity: currentPage >= totalPages ? 0.35 : 1, cursor: currentPage >= totalPages ? "not-allowed" : "pointer" }}
        >
          LAST <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
};
