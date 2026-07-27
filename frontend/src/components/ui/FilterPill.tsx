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
        "h-[45px] px-[15px] py-[10px] border-none rounded text-base font-['Inter',sans-serif] font-normal text-black cursor-pointer transition-colors whitespace-nowrap",
        "max-[768px]:text-sm max-[768px]:px-3 max-[768px]:py-2",
        selected ? "bg-[#c3c3c3]" : "bg-[#e8e7e7] hover:bg-[#d8d7d7]",
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
        "min-h-[59px] px-5 py-[18px] border rounded-none text-white text-base font-semibold leading-[1.2] cursor-pointer hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]",
        "max-[640px]:min-h-[48px] max-[640px]:px-4 max-[640px]:py-[14px] max-[640px]:text-sm",
        selected ? "bg-[#575656] border-[#575656]" : "bg-[#bdbdbd] border-transparent",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
