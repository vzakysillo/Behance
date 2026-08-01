import { X } from "lucide-react";

interface TagProps {
  label: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Tag({ label, dismissible, onDismiss }: TagProps) {
  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-full bg-brand-100 text-brand-600 ${
        dismissible ? "pl-3 pr-1.5" : "px-3"
      }`}
    >
      <span className="text-sm font-medium leading-[1.2]">{label}</span>
      {dismissible && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          className="text-brand-600 transition-colors hover:text-brand-700"
          aria-label={`Remove ${label}`}
        >
          <X size={13} strokeWidth={2} />
        </button>
      )}
    </span>
  );
}
