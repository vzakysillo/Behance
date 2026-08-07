import type { ReactNode } from "react";

interface FilterPillProps {
  selected?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export function FilterPill({ selected, onClick, children, className = "" }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-[45px] px-[15px] py-[10px] rounded-full text-base font-medium leading-[1.2] cursor-pointer transition-colors whitespace-nowrap",
        "max-[768px]:text-sm max-[768px]:px-3 max-[768px]:py-2",
        selected
          ? "bg-brand-600 text-white hover:bg-brand-700"
          : "bg-brand-100 text-brand-600 hover:bg-[#d6c8fb]",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
}

export function ToggleButton({ selected, className = "", children, ...props }: ToggleButtonProps) {
  return (
    <button
      type="button"
      className={[
        "flex justify-center items-center w-auto h-16 gap-2.5 px-[30px] py-5 rounded-[30px] text-xl font-medium leading-[1.2] cursor-pointer whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]",
        selected ? "bg-brand-600 text-white" : "bg-white text-ink hover:bg-brand-100",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
