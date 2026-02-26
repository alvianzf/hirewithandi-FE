export const COLUMNS = [
  { id: "wishlist", label: "Wishlist", color: "#8b5cf6" },
  { id: "applied", label: "Applied", color: "#3b82f6" },
  { id: "hr_interview", label: "HR Interview", color: "#06b6d4" },
  { id: "technical_interview", label: "Technical Interview", color: "#f59e0b" },
  {
    id: "additional_interview",
    label: "Additional Interview",
    color: "#ec4899",
  },
  { id: "offered", label: "Offered", color: "#10b981" },
  { id: "rejected", label: "Rejected", color: "#ef4444" },
];

export const COLUMN_MAP = Object.fromEntries(COLUMNS.map((c) => [c.id, c]));

export const STORAGE_KEY = "hirewithandi_data";

export const INITIAL_STATE = {
  jobs: {},
  columnOrder: COLUMNS.map((c) => c.id),
  columns: Object.fromEntries(COLUMNS.map((c) => [c.id, []])),
};
