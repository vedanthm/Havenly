"use client";

interface ChipSelectProps {
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multi?: boolean;
}

export default function ChipSelect({ options, value, onChange, multi = false }: ChipSelectProps) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const toggle = (option: string) => {
    if (multi) {
      const newValue = selected.includes(option)
        ? selected.filter((v) => v !== option)
        : [...selected, option];
      onChange(newValue);
    } else {
      onChange(selected.includes(option) ? "" : option);
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const isActive = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`chip-select px-5 py-2.5 rounded-full text-sm font-medium font-sans cursor-pointer border transition-all ${
              isActive
                ? "bg-accent text-white border-accent shadow-sm"
                : "bg-white text-text-secondary border-border hover:border-accent-light hover:text-accent"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
