const darkClasses =
  "w-[15px] h-[15px] m-0 appearance-none border-[1.5px] border-[#575656] rounded-none bg-white cursor-pointer checked:bg-[#575656] focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]";

interface CheckboxProps extends Omit<React.ComponentProps<"input">, "type"> {
  variant?: "dark" | "purple";
  label?: string;
}

export function Checkbox({ variant = "dark", label, className = "", ...props }: CheckboxProps) {
  if (variant === "dark") {
    return <input type="checkbox" className={[darkClasses, className].filter(Boolean).join(" ")} {...props} />;
  }

  const Wrapper = label ? "label" : "span";

  return (
    <Wrapper className={`group inline-flex items-center gap-2.5 cursor-pointer ${className}`}>
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          className="peer absolute inset-0 z-10 h-6 w-6 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...props}
        />
        <span className="pointer-events-none flex h-6 w-6 items-center justify-center rounded-[2px] border border-line bg-white transition-colors group-hover:border-brand-600 group-has-[:checked]:border-brand-600 peer-disabled:opacity-40">
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-brand-600 opacity-0 transition-opacity group-has-[:checked]:opacity-100"
          >
            <path
              d="M8 12L11 15L16 9"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      {label && (
        <span className="text-base leading-[1.2] text-line transition-colors group-hover:text-ink group-has-[:checked]:text-ink">
          {label}
        </span>
      )}
    </Wrapper>
  );
}
