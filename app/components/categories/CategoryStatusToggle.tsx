interface CategoryStatusToggleProps {
  checked: boolean;
  onToggle: () => void;
}

export default function CategoryStatusToggle({
  checked,
  onToggle,
}: CategoryStatusToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-[#1E3862]" : "bg-[#D1D5DB]"
      }`}
    >
      <span
      className={`absolute top-[3px] left-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${
        checked ? "translate-x-[20px]" : "translate-x-0"
      }`}
    />
    </button>
  );
}
