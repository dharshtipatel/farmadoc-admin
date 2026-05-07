export type CategoryStatus = "Active" | "Inactive";

export type CategoryAccent = "amber" | "green" | "blue";

export type CategoryNode = {
  id: string;
  name: string;
  status: CategoryStatus;
  products: number;
  updatedOn: string;
  level: 0 | 1 | 2;
  parentId: string | null;
  accent?: CategoryAccent;
};

export type CategoryFormType = "navigation" | "group" | "category";

export type NewCategoryInput = {
  id?: string;
  name: string;
  type: CategoryFormType;
  parentNavigationId: string;
  parentCategoryId: string;
};
