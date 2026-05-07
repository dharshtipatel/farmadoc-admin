"use client";

interface SelectCategoriesDropdownProps {
  open: boolean;
  categories: string[];
  selected: string[];
  onToggle: (category: string) => void;
  showCheckbox?: boolean;
}

export default function SelectCategoriesDropdown({
  open, categories, selected, onToggle, showCheckbox = true,
}: SelectCategoriesDropdownProps) {
  if (!open) return null;

  return (
    <div className="absolute left-0 right-0 top-10 z-10 bg-white border border-[#D6DADD] rounded-xl shadow-lg py-2 max-h-[180px] overflow-y-auto">
      {categories.map((c) => (
        <label
          key={c}
          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          {showCheckbox && (
            <input
              type="checkbox"
              checked={selected.includes(c)}
              onChange={() => onToggle(c)}
              className="w-[14px] h-[14px] accent-[#1E3862] cursor-pointer flex-shrink-0"
            />
          )}
          <span
            className={`text-[12px] line-clamp-1 ${
              !showCheckbox && selected.includes(c)
                ? "text-[#1E3862] font-medium"
                : "text-[#21272A]"
            }`}
            onClick={() => onToggle(c)}
          >
            {c}
          </span>
        </label>
      ))}
    </div>
  );
}