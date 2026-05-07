import { CategoryNode } from "./types";

interface CategoryNameCellProps {
  row: CategoryNode;
  hasChildren: boolean;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

export default function CategoryNameCell({
  row,
  hasChildren,
  isExpanded,
  onToggle,
}: CategoryNameCellProps) {
  const accentColor =
    row.accent === "amber"
      ? "#F59E0B"
      : row.accent === "green"
        ? "#24A148"
        : "#1192E8";

  const contentShift =
    row.level === 0 ? "ml-0" : row.level === 1 ? "ml-6" : "ml-12";

  return (
    <div className="relative flex h-12 items-center">
      {row.level === 1 && (
        <>
          <span className="absolute left-3 top-0 h-full w-px bg-[#E5E7EB]" />
          <span className="absolute left-3 top-1/2 h-px w-4 bg-[#E5E7EB]" />
        </>
      )}
      {row.level === 2 && (
        <>
          <span className="absolute left-3 top-0 h-full w-px bg-[#E5E7EB]" />
          <span className="absolute left-9 top-0 h-full w-px bg-[#E5E7EB]" />
          <span className="absolute left-9 top-1/2 h-px w-4 bg-[#E5E7EB]" />
        </>
      )}

      <div className={`flex items-center gap-2 ${contentShift}`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggle(row.id);
          }}
          className={`flex h-4 w-4 items-center justify-center text-[#6B6F72] ${
            hasChildren ? "cursor-pointer" : "cursor-default"
          }`}
          aria-label={hasChildren ? `Toggle ${row.name}` : undefined}
        >
          {hasChildren ? (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
            >
              <path
                d="M3 2L7 5L3 8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </button>

        <span className="flex h-3.5 w-3.5 items-center justify-center">
          {row.level === 2 ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1.5" y="1.5" width="3.5" height="3.5" rx="0.6" stroke="#4F6B9A" strokeWidth="1" />
              <rect x="7" y="1.5" width="3.5" height="3.5" rx="0.6" stroke="#4F6B9A" strokeWidth="1" />
              <rect x="1.5" y="7" width="3.5" height="3.5" rx="0.6" stroke="#4F6B9A" strokeWidth="1" />
              <rect x="7" y="7" width="3.5" height="3.5" rx="0.6" stroke="#4F6B9A" strokeWidth="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1.5 3.2C1.5 2.75817 1.85817 2.4 2.3 2.4H4.1L4.9 3.4H9.7C10.1418 3.4 10.5 3.75817 10.5 4.2V8.9C10.5 9.34183 10.1418 9.7 9.7 9.7H2.3C1.85817 9.7 1.5 9.34183 1.5 8.9V3.2Z"
                stroke={accentColor}
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>

        <span className="text-[14px] font-medium leading-[22px] text-[#21272A]">
          {row.name}
        </span>
      </div>
    </div>
  );
}
