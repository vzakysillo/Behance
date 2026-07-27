import { Link } from "react-router-dom";
import type { ReactNode } from "react";

const variantClasses: Record<string, string> = {
  primary:
    "h-[45px] bg-[#b3b3b3] text-black text-base font-medium font-['Inter',system-ui,sans-serif] leading-[1.2] cursor-pointer border-0 rounded-none hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] disabled:opacity-60 disabled:cursor-not-allowed",
  "primary-dark":
    "h-[45px] bg-[#525252] text-white text-base font-medium font-['Inter',system-ui,sans-serif] leading-[1.2] cursor-pointer border-0 rounded-none hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] disabled:opacity-60 disabled:cursor-not-allowed",
  purple:
    "h-[45px] bg-[#6146ea] text-white text-base font-medium font-['Inter',system-ui,sans-serif] leading-[1.2] cursor-pointer border-0 rounded-[30px] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] disabled:opacity-60 disabled:cursor-not-allowed",
  outline:
    "h-[45px] bg-transparent text-black text-base font-medium font-['Inter',system-ui,sans-serif] leading-[1.2] cursor-pointer border border-[#575656] rounded-none hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] disabled:opacity-60 disabled:cursor-not-allowed",
  "outline-purple":
    "h-[45px] bg-transparent text-[#6146ea] text-base font-medium font-['Inter',system-ui,sans-serif] leading-[1.2] cursor-pointer border border-[#6146ea] rounded-[30px] hover:bg-[#6146ea]/5 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] disabled:opacity-60 disabled:cursor-not-allowed",
  danger:
    "h-8 bg-red-100 text-red-700 text-xs font-normal inline-flex items-center justify-center gap-2 cursor-pointer border-0 rounded-none hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-60 disabled:cursor-not-allowed",
  "danger-text":
    "h-auto bg-transparent text-red-700 text-xs font-normal inline-flex items-center justify-center gap-2 cursor-pointer border-0 rounded-none hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-60 disabled:cursor-not-allowed",
  chip:
    "h-7 px-3 bg-[#e8e5e5] text-black text-xs font-normal inline-flex items-center justify-center gap-2 cursor-pointer border-0 rounded-none hover:bg-[#d8d5d5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-60 disabled:cursor-not-allowed",
  sidebar:
    "w-full h-10 flex items-center justify-center bg-stone-300 text-black text-sm font-normal cursor-pointer border-0 rounded-none hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] disabled:opacity-60 disabled:cursor-not-allowed",
  "sidebar-light":
    "w-full h-10 flex items-center justify-center bg-gray-200 text-black text-sm font-normal cursor-pointer border-0 rounded-none hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] disabled:opacity-60 disabled:cursor-not-allowed",
};

const sizeClasses: Record<string, string> = {
  sm: "h-7 text-xs px-3",
  md: "h-10 text-sm px-6",
  lg: "h-[45px] text-base px-[15px]",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "primary",
  size,
  fullWidth,
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = variantClasses[variant] || variantClasses.primary;
  const sz = size ? sizeClasses[size] : "";
  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={[base, sz, width, className].filter(Boolean).join(" ")}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

interface LinkButtonProps {
  to: string;
  variant?: "primary" | "outline" | "primary-dark" | "text";
  size?: keyof typeof sizeClasses;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

const linkVariantClasses: Record<string, string> = {
  primary:
    "min-h-[45px] inline-flex items-center justify-center px-6 py-[10px] box-border text-black text-base font-medium leading-[1.2] no-underline bg-[#b3b3b3] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]",
  outline:
    "min-h-[45px] inline-flex items-center justify-center px-6 py-[10px] box-border text-[#575656] text-base font-medium leading-[1.2] no-underline border border-[#575656] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]",
  "primary-dark":
    "min-h-[45px] inline-flex items-center justify-center px-6 py-[10px] box-border text-white text-base font-medium leading-[1.2] no-underline bg-[#525252] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]",
  text: "inline text-inherit font-medium no-underline focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]",
};

export function LinkButton({
  to,
  variant = "primary",
  size,
  fullWidth,
  className = "",
  children,
}: LinkButtonProps) {
  const base = linkVariantClasses[variant] || linkVariantClasses.primary;
  const sz = size ? sizeClasses[size] : "";
  const width = fullWidth ? "w-full" : "";

  return (
    <Link
      to={to}
      className={[base, sz, width, className].filter(Boolean).join(" ")}
    >
      {children}
    </Link>
  );
}
