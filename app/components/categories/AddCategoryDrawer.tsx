"use client";

import { useEffect, useMemo, useState } from "react";
import CategorySelect from "./CategorySelect";
import { CategoryNode, NewCategoryInput, CategoryFormType } from "./types";

interface AddCategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: NewCategoryInput) => void;
  categories: CategoryNode[];
  editCategory?: CategoryNode | null;
}

const TYPE_OPTIONS: Array<{ label: string; value: CategoryFormType }> = [
  { label: "Navigation", value: "navigation" },
  { label: "Group", value: "group" },
  { label: "Category", value: "category" },
];

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function AddCategoryDrawer({
  open,
  onClose,
  onSave,
  categories,
  editCategory = null,
}: AddCategoryDrawerProps) {
  const parentCategory = editCategory?.level === 2
    ? categories.find((item) => item.id === editCategory.parentId)
    : null;

  const [name, setName] = useState(editCategory?.name ?? "");
  const [type, setType] = useState<CategoryFormType | "">(
    editCategory
      ? editCategory.level === 0
        ? "navigation"
        : editCategory.level === 1
          ? "group"
          : "category"
      : ""
  );
  const [parentNavigationId, setParentNavigationId] = useState(
    editCategory
      ? editCategory.level === 1
        ? editCategory.parentId ?? ""
        : editCategory.level === 2
          ? parentCategory?.parentId ?? ""
          : ""
      : ""
  );
  const [parentCategoryId, setParentCategoryId] = useState(
    editCategory?.level === 2 ? editCategory.parentId ?? "" : ""
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navigationOptions = useMemo(
    () =>
      categories
        .filter((item) => item.level === 0)
        .map((item) => ({ label: item.name, value: item.id })),
    [categories]
  );

  const groupOptions = useMemo(
    () =>
      categories
        .filter((item) => item.level === 1)
        .map((item) => ({ label: item.name, value: item.id })),
    [categories]
  );

  const selectedGroup = useMemo(
    () => categories.find((item) => item.id === parentCategoryId && item.level === 1) ?? null,
    [categories, parentCategoryId]
  );

  const selectedNavigationLabel = useMemo(() => {
    if (!parentNavigationId) {
      return "";
    }

    return navigationOptions.find((option) => option.value === parentNavigationId)?.label ?? "";
  }, [navigationOptions, parentNavigationId]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (!name.trim() || !type) {
      return;
    }

    if (type === "group" && !parentNavigationId) {
      return;
    }

    if (type === "category" && (!parentNavigationId || !parentCategoryId)) {
      return;
    }

    onSave({
      id: editCategory?.id,
      name: name.trim(),
      type: type as CategoryFormType,
      parentNavigationId,
      parentCategoryId,
    });
    handleClose();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/85 backdrop-blur-[2px]"
          onClick={handleClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[880px] flex-col border-l border-[#E8EAED] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-[#E8EAED] px-5 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#21272A]">
              {editCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <p className="mt-0.5 text-[11px] text-[#6B6F72]">
              {editCategory
                ? "Update category details in your structured hierarchy."
                : "Create a new category in your structured hierarchy."}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-5">
            <div>
              <h3 className="text-[14px] font-semibold text-[#21272A]">Basic Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-[#21272A]">
                  Category Name <span className="text-[#DA1E28]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  className="px-3 py-2 text-[13px] border border-[#D6DADD] rounded-lg outline-none focus:border-[#1192E8] text-[#21272A] placeholder-[#A8AAAC] bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-[#21272A]">
                  Type <span className="text-[#DA1E28]">*</span>
                </label>
                <CategorySelect
                  value={type}
                  options={TYPE_OPTIONS}
                  placeholder="Select Type"
                  onChange={(nextValue) => {
                    const nextType = nextValue as CategoryFormType;
                    setType(nextType);
                    setParentNavigationId("");
                    setParentCategoryId("");
                  }}
                />
              </div>
            </div>

            {type === "group" && (
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#21272A]">
                    Parent Navigation <span className="text-[#DA1E28]">*</span>
                  </label>
                  <CategorySelect
                    value={parentNavigationId}
                    options={navigationOptions}
                    placeholder="Select Navigation"
                    onChange={(nextValue) => {
                      setParentNavigationId(nextValue);
                      setParentCategoryId("");
                    }}
                  />
                </div>
              </div>
            )}

            {type === "category" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#21272A]">
                    Select Group <span className="text-[#DA1E28]">*</span>
                  </label>
                  <CategorySelect
                    value={parentCategoryId}
                    options={groupOptions}
                    placeholder="Select Group"
                    onChange={(nextValue) => {
                      const nextGroup = categories.find(
                        (item) => item.id === nextValue && item.level === 1
                      );

                      setParentCategoryId(nextValue);
                      setParentNavigationId(nextGroup?.parentId ?? "");
                    }}
                  />
                </div>

                {selectedGroup && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-medium text-[#21272A]">
                      Navigation <span className="text-[#DA1E28]">*</span>
                    </label>
                    <div className="flex min-h-[40px] items-center rounded-md border border-[#D6DADD] bg-[#F8FAFC] px-3 py-2 text-[13px] text-[#21272A]">
                      {selectedNavigationLabel}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#E8EAED] bg-white px-5 py-4">
          <button
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-[12px] font-medium text-[#6B6F72] transition-colors hover:bg-gray-50 hover:text-[#21272A]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-[#1E3862] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#16305a]"
          >
            {editCategory ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </div>
    </>
  );
}
