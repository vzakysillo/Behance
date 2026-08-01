import type { ReactNode } from "react";

interface CategoryHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CategoryHeader({ children, className = "" }: CategoryHeaderProps) {
  return (
    <div
      className={`flex items-center h-[45px] w-full px-5 rounded-tl-[15px] rounded-tr-[15px] bg-brand-100 ${className}`}
    >
      <p className="text-base font-semibold leading-[1.2] text-brand-600">{children}</p>
    </div>
  );
}
