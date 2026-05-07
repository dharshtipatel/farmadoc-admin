import { CategoryNode } from "./types";

export const CATEGORY_NODES: CategoryNode[] = [
  { id: "nav", name: "Navigation", status: "Active", products: 1200, updatedOn: "2026-04-30", level: 0, parentId: null, accent: "blue" },
  { id: "self-medication", name: "Self-Medication", status: "Inactive", products: 400, updatedOn: "2026-05-31", level: 1, parentId: "nav", accent: "amber" },
  { id: "homeopathy", name: "Homeopathy", status: "Active", products: 20, updatedOn: "2026-06-30", level: 1, parentId: "nav", accent: "green" },
  { id: "stomach", name: "Stomach & Intestine", status: "Active", products: 80, updatedOn: "2026-07-31", level: 1, parentId: "nav", accent: "green" },
  { id: "lactic-ferments", name: "Lactic Ferments", status: "Active", products: 10, updatedOn: "2026-04-30", level: 2, parentId: "stomach", accent: "blue" },
  { id: "swelling", name: "Swelling", status: "Active", products: 10, updatedOn: "2026-05-31", level: 2, parentId: "stomach", accent: "blue" },
  { id: "regularity", name: "Regularity & Purification", status: "Active", products: 10, updatedOn: "2026-06-30", level: 2, parentId: "stomach", accent: "blue" },
  { id: "haemorrhoids", name: "Haemorrhoids", status: "Active", products: 10, updatedOn: "2026-07-31", level: 2, parentId: "stomach", accent: "blue" },
  { id: "laxatives", name: "Laxatives", status: "Active", products: 10, updatedOn: "2026-04-30", level: 2, parentId: "stomach", accent: "blue" },
  { id: "diarrhea", name: "Diarrhea", status: "Active", products: 10, updatedOn: "2026-05-31", level: 2, parentId: "stomach", accent: "blue" },
  { id: "stomach-problem", name: "Stomach Problem", status: "Active", products: 10, updatedOn: "2026-06-30", level: 2, parentId: "stomach", accent: "blue" },
  { id: "reflux", name: "Reflux", status: "Active", products: 10, updatedOn: "2026-07-31", level: 2, parentId: "stomach", accent: "blue" },
  { id: "eye-care", name: "Eye & Care", status: "Active", products: 30, updatedOn: "2026-04-30", level: 1, parentId: "nav", accent: "green" },
  { id: "seasonal", name: "Seasonal Remedies", status: "Active", products: 30, updatedOn: "2026-05-31", level: 1, parentId: "nav", accent: "green" },
  { id: "pancreas", name: "Pancreas & Spleen", status: "Active", products: 70, updatedOn: "2026-06-30", level: 1, parentId: "nav", accent: "green" },
  { id: "anti-pain", name: "Anti-Pain", status: "Active", products: 70, updatedOn: "2026-07-31", level: 1, parentId: "nav", accent: "green" },
  { id: "supplements", name: "Supplements", status: "Active", products: 400, updatedOn: "2026-06-30", level: 0, parentId: null, accent: "amber" },
  { id: "personal-care", name: "Personal Care", status: "Active", products: 400, updatedOn: "2026-07-31", level: 0, parentId: null, accent: "amber" },
];
