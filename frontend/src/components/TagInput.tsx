import { useMemo, useRef, useState } from "react";
import { Tag } from "./ui";

interface TagInputProps {
  selected: string[];
  onSelect: (items: string[]) => void;
  options: readonly string[];
  placeholder?: string;
  maxItems?: number;
}

export default function TagInput({ selected, onSelect, options, placeholder, maxItems }: TagInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options.filter(
      (opt) => opt.toLowerCase().includes(q) && !selected.includes(opt)
    );
  }, [query, options, selected]);

  const visibleOptions = filtered.slice(0, 8);
  const atLimit = maxItems !== undefined && selected.length >= maxItems;

  const select = (item: string) => {
    if (atLimit) return;
    onSelect([...selected, item]);
    setQuery("");
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const remove = (item: string) => {
    onSelect(selected.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key !== "Escape") {
      if (query && (e.key === "ArrowDown" || e.key === "Enter")) {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % visibleOptions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + visibleOptions.length) % visibleOptions.length);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < visibleOptions.length) {
          select(visibleOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const showDropdown = isOpen && query.trim() && visibleOptions.length > 0;

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap items-center gap-1.5">
        {selected.map((item) => (
          <Tag
            key={item}
            label={item}
            dismissible
            onDismiss={() => remove(item)}
          />
        ))}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? placeholder : ""}
          disabled={atLimit}
          className="h-7 flex-1 min-w-[120px] bg-transparent text-sm text-black outline-none placeholder:text-[#676767] disabled:cursor-not-allowed disabled:opacity-40"
        />
      </div>

      {showDropdown && (
        <ul className="absolute z-50 mt-1 max-h-[240px] w-full overflow-y-auto border border-[#c6c2c2] bg-white shadow-sm">
          {visibleOptions.map((opt, i) => (
            <li key={opt}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(opt);
                }}
                onMouseEnter={() => setHighlightedIndex(i)}
                className={`flex w-full items-center px-4 py-2 text-left text-sm ${
                  i === highlightedIndex ? "bg-[#e8e5e5]" : "hover:bg-neutral-50"
                }`}
              >
                {highlightMatch(opt, query)}
              </button>
            </li>
          ))}
          {filtered.length > 8 && (
            <li className="px-4 py-1.5 text-xs text-neutral-500">
              +{filtered.length - 8} more results
            </li>
          )}
        </ul>
      )}

      {isOpen && query.trim() && visibleOptions.length === 0 && (
        <div className="absolute z-50 mt-1 w-full border border-[#c6c2c2] bg-white px-4 py-3 text-sm text-neutral-500 shadow-sm">
          No results found
        </div>
      )}
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}
