import type { LucideIcon } from "lucide-react";

interface StatProps {
  icon: LucideIcon;
  value: number;
  className?: string;
}

export function Stat({ icon: Icon, value, className = "" }: StatProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon size={18} className="text-gray-700" />
      <span className="text-base font-sans font-medium text-gray-700">{value}</span>
    </div>
  );
}
