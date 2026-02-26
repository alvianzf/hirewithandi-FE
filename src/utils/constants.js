export const COLUMNS = [
  { id: "wishlist", label: "Wishlist", color: "#FFD700" },
  { id: "applied", label: "Applied", color: "#3b82f6" },
  { id: "hr_interview", label: "HR Interview", color: "#06b6d4" },
  { id: "technical_interview", label: "Technical Interview", color: "#f59e0b" },
  {
    id: "additional_interview",
    label: "Additional Interview",
    color: "#ec4899",
  },
  { id: "offered", label: "Offered", color: "#4ADE80" },
  { id: "rejected_company", label: "Rejected by Company", color: "#EF4444" },
  {
    id: "rejected_applicant",
    label: "Rejected by Applicant",
    color: "#B91C1C",
  },
];

export const COLUMN_MAP = Object.fromEntries(COLUMNS.map((c) => [c.id, c]));

export const WORK_TYPES = [
  { id: "remote", label: "Remote", icon: "🌍" },
  { id: "onsite", label: "On-site", icon: "🏢" },
  { id: "hybrid", label: "Hybrid", icon: "🔄" },
];

export const STORAGE_KEY = "HiredWithAndi_data";

export const INITIAL_STATE = {
  jobs: {},
  columnOrder: COLUMNS.map((c) => c.id),
  columns: Object.fromEntries(COLUMNS.map((c) => [c.id, []])),
};
