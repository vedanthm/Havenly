"use client";

interface SectionCardProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

export default function SectionCard({ number, title, children }: SectionCardProps) {
  return (
    <section className="mb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border">
          <span className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold font-sans shrink-0">
            {number}
          </span>
          <h2 className="m-0 text-2xl sm:text-3xl font-light tracking-[0.15em] uppercase text-text-primary font-serif">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
