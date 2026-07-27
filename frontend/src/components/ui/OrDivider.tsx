interface OrDividerProps {
  variant?: "lined" | "plain";
  className?: string;
}

export function OrDivider({ variant = "lined", className = "" }: OrDividerProps) {
  if (variant === "plain") {
    return (
      <p className={`text-sm font-normal leading-[1.2] whitespace-nowrap text-[#575656] ${className}`}>
        or continue with
      </p>
    );
  }

  return (
    <div
      className={`grid grid-cols-[1fr_auto_1fr] items-center gap-[7px] text-[#525252] ${className}`}
      aria-hidden="true"
    >
      <span className="h-px bg-[#525252]" />
      <p className="px-[2px] text-sm font-normal leading-[1.2] whitespace-nowrap">
        or continue with
      </p>
      <span className="h-px bg-[#525252]" />
    </div>
  );
}
