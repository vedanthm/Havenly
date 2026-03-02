"use client";

interface RatingDotsProps {
  value: number;
  onChange: (value: number) => void;
}

export default function RatingDots({ value, onChange }: RatingDotsProps) {
  return (
    <div className="flex gap-1.5 justify-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? 0 : n)}
          className={`w-7 h-7 rounded-full text-xs font-semibold font-sans flex items-center justify-center cursor-pointer transition-all border ${
            value === n
              ? "bg-accent text-white border-accent shadow-sm"
              : "bg-transparent text-accent border-border hover:border-accent-light"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
