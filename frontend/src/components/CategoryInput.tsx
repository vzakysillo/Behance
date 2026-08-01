import { Tag } from "./ui";

interface CategoryInputProps {
  selected: string[];
  onRemove: (category: string) => void;
  onOpen: () => void;
  placeholder?: string;
}

export default function CategoryInput({ selected, onRemove, onOpen, placeholder }: CategoryInputProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="flex w-full flex-wrap items-center gap-1.5 cursor-pointer outline-none"
    >
      {selected.map((cat) => (
        <Tag
          key={cat}
          label={cat}
          dismissible
          onDismiss={() => onRemove(cat)}
        />
      ))}
      {selected.length === 0 && (
        <span className="text-sm font-medium leading-[1.2] text-line">{placeholder}</span>
      )}
    </div>
  );
}
