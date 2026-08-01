import { useState } from "react";
import { LayoutGrid, Calendar, Wrench, ChevronDown } from "lucide-react";
import { CATEGORIES, POPULAR_CATEGORIES } from "../utils/categories";
import { TOOLS } from "../utils/tools";
import { SearchInput } from "./ui";

const POPULAR_CATEGORIES_SET = new Set<string>(POPULAR_CATEGORIES);
const POPULAR_TOOLS = ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Adobe After Effects", "Adobe Lightroom"];
const POPULAR_TOOLS_SET = new Set<string>(POPULAR_TOOLS);

export const SORT_OPTIONS = ["Oldest First", "Newest First"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

interface SearchFilterPanelProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedTool: string;
  onToolChange: (tool: string) => void;
  className?: string;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <ChevronDown
      size={14}
      strokeWidth={2}
      className={`text-black shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}
    />
  );
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx={7} cy={7} r={6.378} stroke="#5B5B5B" strokeWidth={selected ? 0 : 1} fill={selected ? "#5B5B5B" : "none"} />
    </svg>
  );
}

function ItemRow({ label, selected, onClick, subtitle }: { label: string; selected: boolean; onClick: () => void; subtitle?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 py-[5px] px-5 w-full text-left hover:bg-neutral-50 cursor-pointer border-none bg-transparent"
    >
      <Radio selected={selected} />
      <div className="flex flex-col">
        <span className="text-sm text-black leading-tight">{label}</span>
        {subtitle && <span className="text-xs text-[#aeaeae] leading-tight">{subtitle}</span>}
      </div>
    </button>
  );
}

export default function SearchFilterPanel({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  selectedTool,
  onToolChange,
  className = "",
}: SearchFilterPanelProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [sortOpen, setSortOpen] = useState(false);

  const [toolSearch, setToolSearch] = useState("");

  const allCategories: string[] = [...CATEGORIES];
  const filteredCategories: string[] = categorySearch
    ? allCategories.filter((c) => c.toLowerCase().includes(categorySearch.toLowerCase()))
    : showAllCategories
      ? allCategories
      : ["All", ...POPULAR_CATEGORIES];

  const popularFiltered = filteredCategories.filter((c) => c === "All" || POPULAR_CATEGORIES_SET.has(c));
  const otherFiltered = filteredCategories.filter((c) => c !== "All" && !POPULAR_CATEGORIES_SET.has(c));

  const filteredTools = toolSearch
    ? TOOLS.filter((t) => t.toLowerCase().includes(toolSearch.toLowerCase()))
    : [...TOOLS];
  const popularToolsFiltered = filteredTools.filter((t) => POPULAR_TOOLS_SET.has(t));
  const otherToolsFiltered = filteredTools.filter((t) => !POPULAR_TOOLS_SET.has(t));

  return (
    <div className={`w-[380px] bg-white overflow-y-auto font-sans ${className}`}>
      <p className="px-[29px] pt-[22px] pb-2 text-base text-black font-normal">Search filter</p>

      {/* ── Categories ── */}
      <button
        type="button"
        onClick={() => setCategoriesOpen((o) => !o)}
        className="flex justify-between items-center w-full px-5 py-2.5 cursor-pointer border-none bg-transparent"
      >
        <div className="flex items-center gap-2">
          <LayoutGrid size={18} className="text-[#5B5B5B] shrink-0" />
          <span className="text-sm text-black">Categories</span>
        </div>
        <ChevronIcon open={categoriesOpen} />
      </button>

      {categoriesOpen && (
        <>
          <SearchInput value={categorySearch} onChange={setCategorySearch} placeholder="Search for categories" />

          <div className="flex flex-col">
            <ItemRow label="All" selected={selectedCategory === "All"} onClick={() => onCategoryChange("All")} subtitle="popular" />
            {otherFiltered.map((cat) => (
              <ItemRow
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onClick={() => onCategoryChange(cat)}
              />
            ))}
            {popularFiltered.filter((c) => c !== "All").map((cat) => (
              <ItemRow
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onClick={() => onCategoryChange(cat)}
              />
            ))}
          </div>

          {!categorySearch && (
            <button
              type="button"
              onClick={() => setShowAllCategories((v) => !v)}
              className="px-[55px] py-2 text-sm text-black cursor-pointer border-none bg-transparent hover:underline text-left"
            >
              {showAllCategories ? "Show less" : "view all categories"}
            </button>
          )}
        </>
      )}

      <div className="h-px bg-[#B3B3B3] mx-5 my-1" />

      {/* ── Date ── */}
      <button
        type="button"
        onClick={() => setDateOpen((o) => !o)}
        className="flex justify-between items-center w-full px-5 py-2.5 cursor-pointer border-none bg-transparent"
      >
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-[#5B5B5B] shrink-0" />
          <span className="text-sm text-black">Date</span>
        </div>
        <ChevronIcon open={dateOpen} />
      </button>

      {dateOpen && (
        <div className="px-5 pb-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              className="flex justify-between items-center w-full h-9 px-2.5 border border-[#d9d9d9] bg-white cursor-pointer text-sm text-black"
            >
              {sortBy}
              <ChevronDown size={14} className={`text-black transition-transform ${sortOpen ? "" : "-rotate-90"}`} />
            </button>
            {sortOpen && (
              <div className="absolute top-full left-0 right-0 border border-[#d9d9d9] border-t-0 bg-white z-10">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { onSortChange(opt); setSortOpen(false); }}
                    className={`w-full h-9 px-2.5 text-left text-sm cursor-pointer border-none bg-transparent hover:bg-neutral-50 ${opt === sortBy ? "font-medium" : "text-black"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="h-px bg-[#B3B3B3] mx-5 my-1" />

      {/* ── Tools ── */}
      <button
        type="button"
        onClick={() => setToolsOpen((o) => !o)}
        className="flex justify-between items-center w-full px-5 py-2.5 cursor-pointer border-none bg-transparent"
      >
        <div className="flex items-center gap-2">
          <Wrench size={18} className="text-[#5B5B5B] shrink-0" />
          <span className="text-sm text-black">Tools</span>
        </div>
        <ChevronIcon open={toolsOpen} />
      </button>

      {toolsOpen && (
        <>
          <SearchInput value={toolSearch} onChange={setToolSearch} placeholder="Search for tools" />

          <div className="flex flex-col">
            {popularToolsFiltered.map((tool) => (
              <ItemRow
                key={tool}
                label={tool}
                selected={selectedTool === tool}
                onClick={() => onToolChange(selectedTool === tool ? "" : tool)}
                subtitle={tool === "Adobe Photoshop" || tool === "Adobe Illustrator" ? "popular" : undefined}
              />
            ))}
            {otherToolsFiltered.map((tool) => (
              <ItemRow
                key={tool}
                label={tool}
                selected={selectedTool === tool}
                onClick={() => onToolChange(selectedTool === tool ? "" : tool)}
              />
            ))}
          </div>
        </>
      )}

      <div className="h-px bg-[#B3B3B3] mx-5 my-1" />
    </div>
  );
}
