import type { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  variant?: "default" | "uppercase" | "subtitle";
  className?: string;
}

export function SectionTitle({ children, variant = "default", className = "" }: SectionTitleProps) {
  const variantClasses: Record<string, string> = {
    default: "text-base text-black font-normal",
    uppercase: "text-sm font-semibold uppercase leading-5 text-black",
    subtitle: "text-sm font-medium leading-5 text-black",
  };

  return (
    <p className={`${variantClasses[variant]} ${className}`}>
      {children}
    </p>
  );
}
