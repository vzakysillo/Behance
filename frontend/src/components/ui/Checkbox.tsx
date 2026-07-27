interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: "dark" | "purple";
}

const variantClasses: Record<string, string> = {
  dark: "w-[15px] h-[15px] m-0 appearance-none border-[1.5px] border-[#575656] rounded-none bg-white cursor-pointer checked:bg-[#575656] focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]",
  purple: "h-4 w-4 accent-[#6146ea]",
};

export function Checkbox({ variant = "dark", className = "", ...props }: CheckboxProps) {
  const base = variantClasses[variant] || variantClasses.dark;
  return (
    <input
      type="checkbox"
      className={[base, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
