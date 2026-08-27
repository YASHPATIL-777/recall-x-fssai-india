/**
 * RECALL//X — FSSAI India Presentation-Layer Helpers
 * Formats Indian food recall properties, statuses, license types,
 * dates, and graceful handling of NULL values as "NOT PROVIDED".
 */

export function formatNullField(val?: string | number | null, fallback = "NOT PROVIDED"): string {
  if (val === undefined || val === null) return fallback;
  const str = String(val).trim();
  if (!str || str.toLowerCase() === "null" || str.toLowerCase() === "nan" || str.toLowerCase() === "none") {
    return fallback;
  }
  return str;
}

export function formatDateString(dateStr?: string | null): string {
  if (!dateStr) return "NOT PROVIDED";
  const str = String(dateStr).trim();
  if (str.length >= 10 && str[4] === "-" && str[7] === "-") {
    const [year, month, day] = str.slice(0, 10).split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mIdx = parseInt(month, 10) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      return `${day} ${monthNames[mIdx]} ${year}`;
    }
  }
  return str;
}

export function getStatusStyle(status?: string | null): { className: string; label: string } {
  if (!status) return { className: "status-pill", label: "UNKNOWN" };
  const lower = status.trim().toLowerCase();
  if (lower.includes("initiated")) {
    return { className: "status-pill status-pill-amber", label: "INITIATED" };
  }
  if (lower.includes("in progress")) {
    return { className: "status-pill status-pill-cyan", label: "IN PROGRESS" };
  }
  if (lower.includes("completed")) {
    return { className: "status-pill status-pill-green", label: "COMPLETED" };
  }
  return { className: "status-pill", label: status.toUpperCase() };
}

export function getLicenseStyle(licenseType?: string | null): { className: string; label: string } {
  if (!licenseType) return { className: "status-pill", label: "UNSPECIFIED LICENSE" };
  const lower = licenseType.trim().toLowerCase();
  if (lower.includes("central")) {
    return { className: "status-pill status-pill-cyan", label: "CENTRAL LICENSE" };
  }
  if (lower.includes("state")) {
    return { className: "status-pill status-pill-purple", label: "STATE LICENSE" };
  }
  return { className: "status-pill", label: licenseType.toUpperCase() };
}

export function getNatureStyle(nature?: string | null): { className: string; label: string } {
  if (!nature) return { className: "status-pill", label: "UNSPECIFIED INITIATOR" };
  const lower = nature.trim().toLowerCase();
  if (lower.includes("authority")) {
    return { className: "status-pill status-pill-danger", label: "INITIATED BY AUTHORITY" };
  }
  if (lower.includes("fbo")) {
    return { className: "status-pill status-pill-cyan", label: "INITIATED BY FBO" };
  }
  return { className: "status-pill", label: nature.toUpperCase() };
}

// Backward compatibility helpers
export function formatCategoryName(category?: string | null): string {
  return formatNullField(category, "UNSPECIFIED");
}

export function formatRiskLabel(risk?: string | null): string {
  return formatNullField(risk, "UNSPECIFIED RISK");
}

export function formatRecallReason(reason?: string | null): string {
  return formatNullField(reason, "No reason specified");
}
