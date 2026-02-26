export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

import { FINAL_STATUSES } from "./constants";

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
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
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
