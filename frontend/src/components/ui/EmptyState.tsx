interface EmptyStateProps {
  message: string;
  variant?: "centered" | "inline";
  className?: string;
}

export function EmptyState({ message, variant = "inline", className = "" }: EmptyStateProps) {
  if (variant === "centered") {
    return (
      <div
        className={`flex items-center justify-center h-64 text-stone-400 text-base ${className}`}
      >
        {message}
      </div>
    );
  }

  return (
    <p className={`text-xs text-neutral-500 ${className}`}>
      {message}
    </p>
  );
}
