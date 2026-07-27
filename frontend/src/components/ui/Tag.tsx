import { X } from "lucide-react";

interface TagProps {
  label: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Tag({ label, dismissible, onDismiss }: TagProps) {
  return (
    <span className={`inline-flex h-7 items-center gap-1.5 bg-[#e8e5e5] text-xs ${dismissible ? "pl-3 pr-1.5" : "px-3"}`}>
      {label}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-neutral-500 hover:text-black"
          aria-label={`Remove ${label}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
