interface CategoryManagementHeaderProps {
  onAddNew: () => void;
}

export default function CategoryManagementHeader({ onAddNew }: CategoryManagementHeaderProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[18px] font-semibold text-black">Category Management</h1>
        <p className="mt-1 text-[12px] font-medium text-[#6B6F72]">
          Manage navigation categories, groups, and product-level categories in a structured 3-level hierarchy.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 rounded-lg bg-[#1E3862] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#16305a]"
        >
          <span className="text-[12px]">+</span>
          Add New
        </button>
      </div>
    </div>
  );
}
