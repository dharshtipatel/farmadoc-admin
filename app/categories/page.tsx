"use client";

import { useMemo, useState } from "react";
import DataTable, { Column } from "../components/DataTable";
import AddCategoryDrawer from "../components/categories/AddCategoryDrawer";
import CategoryActionModal from "../components/categories/CategoryActionModal";
import CategoryManagementHeader from "../components/categories/CategoryManagementHeader";
import CategoryNameCell from "../components/categories/CategoryNameCell";
import CategoryProductsDrawer from "../components/categories/CategoryProductsDrawer";
import CategoryRowActions from "../components/categories/CategoryRowActions";
import CategoryStatusToggle from "../components/categories/CategoryStatusToggle";
import { CATEGORY_NODES } from "../components/categories/categoryData";
import { CategoryAccent, CategoryNode, NewCategoryInput } from "../components/categories/types";

export default function CategoryManagementPage() {
  const [rows, setRows] = useState<CategoryNode[]>(CATEGORY_NODES);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"activate" | "inactivate" | "remove" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryNode | null>(null);
  const [viewingCategory, setViewingCategory] = useState<CategoryNode | null>(null);

  const childrenByParent = useMemo(() => {
    const map = new Map<string | null, CategoryNode[]>();
    rows.forEach((row) => {
      const siblings = map.get(row.parentId) ?? [];
      siblings.push(row);
      map.set(row.parentId, siblings);
    });
    return map;
  }, [rows]);

  const visibleRows = useMemo(() => {
    const ordered: CategoryNode[] = [];

    const appendChildren = (parentId: string | null) => {
      const children = childrenByParent.get(parentId) ?? [];
      children.forEach((child) => {
        ordered.push(child);
        if (expandedIds.has(child.id)) {
          appendChildren(child.id);
        }
      });
    };

    appendChildren(null);
    return ordered;
  }, [childrenByParent, expandedIds]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openCategoryModal = (
    action: "activate" | "inactivate" | "remove",
    category: CategoryNode
  ) => {
    setSelectedCategory(category);
    setModalAction(action);
  };

  const handleConfirmAction = () => {
    if (!selectedCategory || !modalAction) {
      return;
    }

    if (modalAction === "remove") {
      const idsToRemove = new Set<string>([selectedCategory.id]);
      let changed = true;

      while (changed) {
        changed = false;
        rows.forEach((row) => {
          if (row.parentId && idsToRemove.has(row.parentId) && !idsToRemove.has(row.id)) {
            idsToRemove.add(row.id);
            changed = true;
          }
        });
      }

      setRows((prev) => prev.filter((row) => !idsToRemove.has(row.id)));
      setExpandedIds((prev) => {
        const next = new Set(prev);
        idsToRemove.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      const nextStatus = modalAction === "activate" ? "Active" : "Inactive";
      setRows((prev) =>
        prev.map((row) =>
          row.id === selectedCategory.id ? { ...row, status: nextStatus } : row
        )
      );
    }

    setModalAction(null);
    setSelectedCategory(null);
  };

  const handleAddCategory = ({
    id,
    name,
    type,
    parentNavigationId,
    parentCategoryId,
  }: NewCategoryInput) => {
    if (!name) return;

    const accentByLevel: Record<0 | 1 | 2, CategoryAccent> = {
      0: "amber",
      1: "green",
      2: "blue",
    };

    const nextLevel: 0 | 1 | 2 =
      type === "navigation" ? 0 : type === "group" ? 1 : 2;
    const parentId =
      type === "navigation" ? null : type === "group" ? parentNavigationId : parentCategoryId;

    if ((type === "group" && !parentNavigationId) || (type === "category" && (!parentNavigationId || !parentCategoryId))) {
      return;
    }

    const existingCategory = id ? rows.find((row) => row.id === id) : null;

    const nextRow: CategoryNode = {
      id: id ?? `category-${Date.now()}`,
      name,
      status: existingCategory?.status ?? "Active",
      products: existingCategory?.products ?? 0,
      updatedOn: new Date().toISOString().slice(0, 10),
      level: nextLevel,
      parentId,
      accent: accentByLevel[nextLevel],
    };

    setRows((prev) =>
      id
        ? prev.map((row) => (row.id === id ? nextRow : row))
        : [...prev, nextRow]
    );
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (parentNavigationId) next.add(parentNavigationId);
      if (parentCategoryId) next.add(parentCategoryId);
      if (id) next.add(id);
      return next;
    });
    setEditingCategory(null);
    setDrawerOpen(false);
  };

  const columns: Column<CategoryNode>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Categories",
        sortable: false,
        width: "62%",
        render: (_, row) => (
          <CategoryNameCell
            row={row}
            hasChildren={(childrenByParent.get(row.id)?.length ?? 0) > 0}
            isExpanded={expandedIds.has(row.id)}
            onToggle={toggleExpanded}
          />
        ),
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        width: "12%",
        render: (_, row) => (
          <div className="flex items-center justify-center">
            <CategoryStatusToggle
              checked={row.status === "Active"}
              onToggle={() =>
                openCategoryModal(
                  row.status === "Active" ? "inactivate" : "activate",
                  row
                )
              }
            />
          </div>
        ),
      },
      {
        key: "products",
        label: "Products",
        sortable: true,
        width: "12%",
        render: (value) => <span className="text-[13px] text-[#21272A]">{value}</span>,
      },
      {
        key: "updatedOn",
        label: "Updated On",
        sortable: true,
        width: "14%",
        render: (value) => <span className="text-[13px] text-[#21272A]">{value}</span>,
      },
    ],
    [childrenByParent, expandedIds]
  );

  return (
    <div className="w-full font-inter">
      <CategoryManagementHeader
        onAddNew={() => {
          setEditingCategory(null);
          setDrawerOpen(true);
        }}
      />

      <DataTable<CategoryNode>
        columns={columns}
        data={visibleRows}
        rowKey={(row) => row.id}
        searchFields={["name", "updatedOn"]}
        searchPlaceholder="Search categories..."
        hideSearch={true}
        hidePagination={true}
        showCheckboxes={false}
        headerBackground="#F7F9FC"
        renderRowActions={(row) => (
          <CategoryRowActions
            rowId={row.id}
            onViewProducts={() => setViewingCategory(row)}
            onEdit={() => {
              setEditingCategory(row);
              setDrawerOpen(true);
            }}
            onRemove={() => openCategoryModal("remove", row)}
          />
        )}
        customFilter={(row, query) =>
          row.name.toLowerCase().includes(query) || row.updatedOn.toLowerCase().includes(query)
        }
      />

      {drawerOpen && (
        <AddCategoryDrawer
          key={editingCategory?.id ?? "new-category"}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleAddCategory}
          categories={rows}
          editCategory={editingCategory}
        />
      )}

      {viewingCategory && (
        <CategoryProductsDrawer
          open={viewingCategory !== null}
          category={viewingCategory}
          categories={rows}
          onClose={() => setViewingCategory(null)}
        />
      )}

      <CategoryActionModal
        open={modalAction !== null}
        actionType={modalAction}
        category={selectedCategory}
        onClose={() => {
          setModalAction(null);
          setSelectedCategory(null);
        }}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
