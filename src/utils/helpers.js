export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

import { FINAL_STATUSES } from "./constants";
import { format, formatDistanceToNow } from "date-fns";

export function daysSince(dateString, endDateString = null) {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const end = endDateString ? new Date(endDateString) : new Date();
  const diffTime = end.getTime() - date.getTime();
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
}

export function calculateActiveDays(job) {
  if (!job || !job.history || job.history.length === 0) {
    const isFinalState = FINAL_STATUSES.includes(job.status);
    return daysSince(
      job.dateApplied || job.dateAdded,
      isFinalState ? job.statusChangedAt : null,
    );
  }

  let totalMs = 0;
  job.history.forEach((h) => {
    if (!FINAL_STATUSES.includes(h.status)) {
      const start = new Date(h.enteredAt).getTime();
      const end = h.leftAt ? new Date(h.leftAt).getTime() : Date.now();
      totalMs += end - start;
    }
  });

  return Math.max(0, Math.floor(totalMs / (1000 * 60 * 60 * 24)));
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(dateString) {
  if (!dateString) return "—";
  try {
    return format(new Date(dateString), "dd MMM");
  } catch (e) {
    return dateString;
  }
}

export function getMonthYear(dateString) {
  if (!dateString) return "No Date";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function daysLabel(count) {
  if (count === 0) return "Today";
  if (count === 1) return "1 day";
  return `${count} days`;
}

export function formatRelativeTime(dateString) {
  if (!dateString) return "—";
  try {
    const distanceText = formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
    });
    // This outputs e.g. "3 days ago", "about 1 month ago"
    return `Applied ${distanceText}`;
  } catch (e) {
    return dateString;
  }
}

export function formatSalary(salary) {
  if (!salary) return "";
  const s = String(salary).trim().toUpperCase();

  // Extract currency symbol/code (Rp, $, USD, etc.)
  const symbolMatch = s.match(/^(RP|\$|USD)/i);
  const symbol = symbolMatch ? symbolMatch[0] : "";

  // Extract numeric part (handling ranges, we take the max)
  const tokens = s.match(/[\d,.]+\s*(?:K|M|B|T|JT)?/gi) || [];
  const nums = tokens
    .map((token) => {
      const t = token.toUpperCase().trim();
      const numPart = parseFloat(t.replace(/[^0-9.]/g, ""));
      if (isNaN(numPart)) return NaN;
      if (t.includes("JT")) return numPart * 1e6;
      if (t.endsWith("T")) return numPart * 1e12;
      if (t.endsWith("B")) return numPart * 1e9;
      if (t.endsWith("M")) return numPart * 1e6;
      if (t.endsWith("K")) return numPart * 1e3;
      return numPart;
    })
    .filter((n) => !isNaN(n) && n > 0);

  if (nums.length === 0) return salary; // Fallback to original

  const n = Math.max(...nums);
  let formatted = "";

  const isIdr = symbol === "RP" || (!symbol && n > 10000); // Heuristic if no symbol

  if (isIdr) {
    if (n >= 1e9) formatted = `${(n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1)}M`;
    else if (n >= 1e6)
      formatted = `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)}Jt`;
    else if (n >= 1e3) formatted = `${(n / 1e3).toFixed(0)}K`;
    else formatted = String(n);
  } else {
    if (n >= 1e9) formatted = `${(n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1)}B`;
    else if (n >= 1e6)
      formatted = `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)}M`;
    else if (n >= 1e3)
      formatted = `${(n / 1e3).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
    else formatted = String(n);
  }

  // Handle display prefix/suffix
  if (symbol === "$") return `$${formatted}`;
  if (symbol === "RP") return `Rp ${formatted}`;
  if (symbol) return `${symbol} ${formatted}`;
  return formatted;
}
