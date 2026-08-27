"use client";

import React from "react";
import { CategoryItem } from "@/types/recall";
import {
  Search,
  Filter,
  Calendar,
  RotateCcw,
  LayoutGrid,
  List,
  ArrowUpDown,
  Tag,
} from "lucide-react";

interface FilterBarProps {
  categories: CategoryItem[];
  search: string;
  category: string;
  licenseType?: string;
  recallStatus?: string;
  natureOfRecall?: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  viewMode: "grid" | "table";
  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onLicenseTypeChange?: (val: string) => void;
  onRecallStatusChange?: (val: string) => void;
  onNatureOfRecallChange?: (val: string) => void;
  onDateFromChange: (val: string) => void;
  onDateToChange: (val: string) => void;
  onSortByChange: (val: string) => void;
  onSortOrderToggle: () => void;
  onViewModeChange: (mode: "grid" | "table") => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  category,
  licenseType = "all",
  recallStatus = "all",
  natureOfRecall = "all",
  dateFrom,
  dateTo,
  sortBy,
  sortOrder,
  viewMode,
  onSearchChange,
  onCategoryChange,
  onLicenseTypeChange,
  onRecallStatusChange,
  onNatureOfRecallChange,
  onDateFromChange,
  onDateToChange,
  onSortByChange,
  onSortOrderToggle,
  onViewModeChange,
  onReset,
}) => {
  return (
    <div
      className="console-panel"
      style={{
        padding: "1.25rem",
        marginBottom: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Top Row: Search input + View Mode Toggles */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        {/* Search Bar */}
        <div
          style={{
            flex: "1 1 300px",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "0.85rem",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Product, Brand, FBO Name, Reason, License No, or Recall ID..."
            className="console-input"
            style={{
              width: "100%",
              paddingLeft: "2.5rem",
              fontSize: "0.88rem",
            }}
          />
        </div>

        {/* View Mode & Reset Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--bg-panel-elevated)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--border-radius-sm)",
              padding: "2px",
            }}
          >
            <button
              onClick={() => onViewModeChange("grid")}
              style={{
                padding: "0.4rem 0.6rem",
                background: viewMode === "grid" ? "var(--accent-cyan-dim)" : "transparent",
                color: viewMode === "grid" ? "var(--accent-cyan)" : "var(--text-muted)",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}
            >
              <LayoutGrid size={14} /> GRID
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              style={{
                padding: "0.4rem 0.6rem",
                background: viewMode === "table" ? "var(--accent-cyan-dim)" : "transparent",
                color: viewMode === "table" ? "var(--accent-cyan)" : "var(--text-muted)",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}
            >
              <List size={14} /> TABLE
            </button>
          </div>

          <button
            onClick={onReset}
            className="btn-console btn-console-secondary btn-console-sm"
            title="Reset all filters"
          >
            <RotateCcw size={14} /> RESET
          </button>
        </div>
      </div>

      {/* Bottom Row: Dropdown Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
        {/* License Type Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Filter size={14} color="var(--text-muted)" />
          <select
            value={licenseType !== "all" ? licenseType : category}
            onChange={(e) => {
              if (onLicenseTypeChange) onLicenseTypeChange(e.target.value);
              onCategoryChange(e.target.value);
            }}
            className="console-select"
            style={{ fontSize: "0.82rem" }}
          >
            <option value="all">All License Types</option>
            <option value="State License">State License (156)</option>
            <option value="Central License">Central License (43)</option>
          </select>
        </div>

        {/* Recall Status Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <select
            value={recallStatus}
            onChange={(e) => onRecallStatusChange && onRecallStatusChange(e.target.value)}
            className="console-select"
            style={{ fontSize: "0.82rem" }}
          >
            <option value="all">All Recall Statuses</option>
            <option value="Initiated">Initiated (125)</option>
            <option value="In progress">In Progress (55)</option>
            <option value="Completed">Completed (19)</option>
          </select>
        </div>

        {/* Nature of Recall Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <select
            value={natureOfRecall}
            onChange={(e) => onNatureOfRecallChange && onNatureOfRecallChange(e.target.value)}
            className="console-select"
            style={{ fontSize: "0.82rem" }}
          >
            <option value="all">All Initiating Entities</option>
            <option value="Initiated by Authority">Initiated by Authority (142)</option>
            <option value="Initiated by FBO">Initiated by FBO (57)</option>
          </select>
        </div>

        {/* Date From / To */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Calendar size={14} color="var(--text-muted)" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="console-input"
            style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem" }}
            title="Start date from"
          />
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="console-input"
            style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem" }}
            title="Start date to"
          />
        </div>

        {/* Sort Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "auto" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
            SORT:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="console-select"
            style={{ fontSize: "0.82rem" }}
          >
            <option value="recall_start_date">Recall Start Date</option>
            <option value="fbo_name">FBO Name</option>
            <option value="product_name">Product Name</option>
            <option value="recall_id">Recall ID</option>
          </select>

          <button
            onClick={onSortOrderToggle}
            className="btn-console btn-console-secondary btn-console-sm"
            style={{ padding: "0.4rem 0.6rem" }}
            title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          >
            <ArrowUpDown size={14} /> {sortOrder.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};
