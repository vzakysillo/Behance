import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { CATEGORIES, POPULAR_CATEGORIES, MAX_CATEGORIES, getCategoriesByLetter } from "../utils/categories";

const LETTERS_ORDER = ["#", "A", "B", "C", "D", "E", "F", "G", "I", "J", "L", "M", "P", "R", "S", "T", "U", "V", "W"];

interface CategoryPickerProps {
  selected: string[];
  onSelect: (categories: string[]) => void;
  onClose: () => void;
}

export default function CategoryPicker({ selected, onSelect, onClose }: CategoryPickerProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(selected);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return CATEGORIES;
    const q = search.toLowerCase();
    return CATEGORIES.filter((c) => c.toLowerCase().includes(q));
  }, [search]);

  const grouped = useMemo(() => getCategoriesByLetter(filtered), [filtered]);

  const showPopular = !search.trim();

  const toggle = (cat: string) => {
    setLocalSelected((prev) => {
      if (prev.includes(cat)) return prev.filter((c) => c !== cat);
      if (prev.length >= MAX_CATEGORIES) return prev;
      return [...prev, cat];
    });
  };

  const handleDone = () => {
    onSelect(localSelected);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative flex h-[90vh] w-[859px] flex-col overflow-hidden rounded-[20px] bg-white font-['Inter',sans-serif]">
        <button
          type="button"
          onClick={handleCancel}
          className="absolute right-[30px] top-[30px] z-10 text-[#6146ea] hover:opacity-70"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="shrink-0 border border-[#c6c2c2] px-[50px] pt-[53px] pb-5">
          <p className="mb-4 text-2xl font-semibold text-black">
            Category
            <span className="ml-2 text-base font-normal">(required, limit of {MAX_CATEGORIES})</span>
          </p>
          <div className="flex h-11 items-center gap-2.5 border border-[#c6c2c2] bg-[#c6c2c2] px-5">
            <Search size={24} className="shrink-0 text-black" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-full flex-1 bg-transparent text-base text-black outline-none placeholder:text-black"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto border-x border-b border-[#c6c2c2] px-[50px] py-5">
          {showPopular && (
            <div className="mb-2">
              <div className="flex h-[45px] items-center bg-[#c6c2c2] px-5">
                <p className="text-base font-medium text-black">Most popular</p>
              </div>
              <div className="py-3 pl-[51px]">
                {POPULAR_CATEGORIES.map((cat) => {
                  const checked = localSelected.includes(cat);
                  const disabled = !checked && localSelected.length >= MAX_CATEGORIES;
                  return (
                    <label
                      key={cat}
                      className={`flex cursor-pointer items-center gap-3 py-1.5 text-base text-black ${disabled ? "opacity-40" : "hover:bg-neutral-50"}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggle(cat)}
                        className="h-4 w-4 accent-[#6146ea]"
                      />
                      {cat}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {LETTERS_ORDER.map((letter) => {
            const cats = grouped.get(letter);
            if (!cats || cats.length === 0) return null;
            return (
              <div key={letter} className="mb-2">
                <div className="flex h-[45px] items-center bg-[#c6c2c2] px-5">
                  <p className="text-base font-medium text-black">{letter}</p>
                </div>
                <div className="py-3 pl-[51px]">
                  {cats.map((cat) => {
                    const checked = localSelected.includes(cat);
                    const disabled = !checked && localSelected.length >= MAX_CATEGORIES;
                    return (
                      <label
                        key={cat}
                        className={`flex cursor-pointer items-center gap-3 py-1.5 text-base text-black ${disabled ? "opacity-40" : "hover:bg-neutral-50"}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => toggle(cat)}
                          className="h-4 w-4 accent-[#6146ea]"
                        />
                        {cat}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-neutral-500">No categories match your search.</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-4 border-t border-[#c6c2c2] px-[50px] py-4">
          <button
            type="button"
            onClick={handleCancel}
            className="h-10 w-[110px] rounded-[30px] border border-[#6146ea] text-base font-medium text-[#6146ea] hover:bg-[#6146ea]/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDone}
            className="h-10 w-[110px] rounded-[30px] bg-[#6146ea] text-base font-medium text-white hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
