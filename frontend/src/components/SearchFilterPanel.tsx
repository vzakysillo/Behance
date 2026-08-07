import { useState } from "react";
import type { ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, POPULAR_CATEGORIES } from "../utils/categories";
import { TOOLS } from "../utils/tools";

const POPULAR_CATEGORIES_SET = new Set<string>(POPULAR_CATEGORIES);
const POPULAR_TOOLS = ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Adobe After Effects", "Adobe Lightroom"];
const POPULAR_TOOLS_SET = new Set<string>(POPULAR_TOOLS);

const SORT_OPTIONS = ["Oldest First", "Newest First"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

interface SearchFilterPanelProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedTools: string[];
  onToolChange: (tools: string[]) => void;
  onClose: () => void;
  onReset: () => void;
  className?: string;
}

const SECTION_SHADOW = { boxShadow: "0px 4px 10.1px 0 rgba(0,0,0,0.07)" } as const;

function CategoriesIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" preserveAspectRatio="none">
      <path
        d="M11.2357 2.37392C10.8682 2.52616 10.5387 2.85565 9.87978 3.51457C9.221 4.17335 8.89138 4.50298 8.73915 4.87047C8.53617 5.36053 8.53617 5.91121 8.73915 6.40126C8.8914 6.76881 9.22087 7.09828 9.87981 7.75722C10.5384 8.41578 10.8683 8.74568 11.2357 8.89788C11.7258 9.10086 12.2764 9.10086 12.7665 8.89787C13.134 8.74563 13.4635 8.41616 14.1225 7.75722C14.7814 7.09828 15.1099 6.76881 15.2621 6.40126C15.4651 5.91121 15.4651 5.36053 15.2621 4.87047C15.1099 4.50293 14.7814 4.17351 14.1225 3.51457C13.4635 2.85564 13.134 2.52616 12.7665 2.37392C12.2764 2.17093 11.7258 2.17093 11.2357 2.37392Z"
        stroke="#1B1B1B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.87148 8.73769C4.50393 8.88993 4.17446 9.21941 3.51552 9.87834C2.85677 10.5371 2.52712 10.8668 2.3749 11.2342C2.17191 11.7243 2.17191 12.275 2.3749 12.765C2.52714 13.1326 2.85662 13.4621 3.51555 14.121C4.17411 14.7796 4.50401 15.1094 4.87145 15.2616C5.3615 15.4646 5.91218 15.4646 6.40224 15.2616C6.76978 15.1094 7.09925 14.7799 7.75819 14.121C8.41714 13.4621 8.74564 13.1326 8.89788 12.765C9.10086 12.275 9.10086 11.7243 8.89788 11.2342C8.74564 10.8667 8.41714 10.5373 7.75819 9.87834C7.09925 9.2194 6.76978 8.88993 6.40224 8.73769C5.91218 8.5347 5.36153 8.5347 4.87148 8.73769Z"
        stroke="#1B1B1B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.244 9.87834C15.5853 10.5371 15.2556 10.8667 15.1034 11.2342C14.9004 11.7243 14.9004 12.275 15.1034 12.765C15.2557 13.1326 15.5851 13.462 16.2441 14.121C16.9026 14.7795 17.2325 15.1094 17.6 15.2616C18.09 15.4646 18.6407 15.4646 19.1308 15.2616C19.4983 15.1094 19.8278 14.7799 20.4867 14.121C21.1456 13.4621 21.4742 13.1326 21.6264 12.765C21.8294 12.275 21.8294 11.7243 21.6264 11.2342C21.4742 10.8667 21.1456 10.5373 20.4867 9.87834C19.8278 9.21941 19.4983 8.88993 19.1308 8.73769C18.6407 8.5347 18.09 8.5347 17.6 8.73769C17.2325 8.88993 16.903 9.21941 16.244 9.87834Z"
        stroke="#1B1B1B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2357 15.1019C10.8682 15.2542 10.5387 15.5837 9.87978 16.2426C9.22102 16.9014 8.89137 17.231 8.73915 17.5985C8.53617 18.0886 8.53617 18.6392 8.73915 19.1293C8.8914 19.4968 9.22087 19.8263 9.87981 20.4852C10.5384 21.1438 10.8683 21.4737 11.2357 21.6259C11.7258 21.8289 12.2764 21.8289 12.7665 21.6259C13.134 21.4737 13.4635 21.1442 14.1225 20.4852C14.7814 19.8263 15.1099 19.4968 15.2621 19.1293C15.4651 18.6392 15.4651 18.0886 15.2621 17.5985C15.1099 17.231 14.7814 16.9015 14.1225 16.2426C13.4635 15.5837 13.134 15.2542 12.7665 15.1019C12.2764 14.899 11.7258 14.899 11.2357 15.1019Z"
        stroke="#1B1B1B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" preserveAspectRatio="none">
      <path
        d="M4 8H20M4 8V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2842 19.7822 18.9079C20 18.4805 20 17.9215 20 16.8036V8M4 8V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H8M20 8V7.19691C20 6.07899 20 5.5192 19.7822 5.0918C19.5905 4.71547 19.2837 4.40973 18.9074 4.21799C18.4796 4 17.9203 4 16.8002 4H16M16 2V4M16 4H8M8 2V4"
        stroke="#1B1B1B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" preserveAspectRatio="none">
      <path
        d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001"
        stroke="#1B1B1B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-grow-0 flex-shrink-0 w-6 h-6 relative transition-transform ${open ? "rotate-180" : ""}`}
      preserveAspectRatio="none"
    >
      <path
        d="M16 10L12 14L8 10"
        stroke="#1B1B1B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx={7} cy={7} r={6.5} stroke="#949494" strokeWidth={selected ? 0 : 1} fill={selected ? "#6146ea" : "none"} />
    </svg>
  );
}

function Checkbox({ selected }: { selected: boolean }) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" className="shrink-0">
      <rect
        x={0.5}
        y={0.5}
        width={13}
        height={13}
        rx={4}
        fill={selected ? "#6146ea" : "white"}
        stroke={selected ? "#6146ea" : "#949494"}
      />
      {selected && (
        <path d="M4 7L6 9L10 5" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function SectionHeader({ icon, label, open, onClick }: { icon: ReactNode; label: string; open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex justify-between items-center w-full h-10 relative p-2.5 cursor-pointer border-none bg-transparent"
    >
      <div className="flex-grow-0 flex-shrink-0 w-[285px] h-6">
        <span className="absolute left-2.5 top-2">{icon}</span>
        <span className="w-[251px] absolute left-11 top-[11px] text-sm text-left text-[#1b1b1b]">{label}</span>
      </div>
      <ChevronIcon open={open} />
    </button>
  );
}

function SectionCard({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      className={open
        ? "w-[340px] rounded-[15px] bg-white overflow-hidden"
        : "w-[340px] h-10 rounded-[20px] bg-white overflow-hidden"}
      style={open ? undefined : SECTION_SHADOW}
    >
      {children}
    </div>
  );
}

function Row({ label, selected, onClick, mode = "radio" }: { label: string; selected: boolean; onClick: () => void; mode?: "check" | "radio" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 py-[2.5px] w-full text-left cursor-pointer border-none bg-transparent"
    >
      {mode === "check" ? <Checkbox selected={selected} /> : <Radio selected={selected} />}
      <span className="text-sm leading-[18px] text-[#1b1b1b]">{label}</span>
    </button>
  );
}

export default function SearchFilterPanel({
  selectedCategories,
  onCategoryChange,
  sortBy,
  onSortChange,
  selectedTools,
  onToolChange,
  onClose,
  onReset,
  className = "",
}: SearchFilterPanelProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

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

  const toggleCategory = (cat: string) => {
    if (cat === "All") {
      onCategoryChange([]);
    } else {
      onCategoryChange(
        selectedCategories.includes(cat)
          ? selectedCategories.filter((c) => c !== cat)
          : [...selectedCategories, cat]
      );
    }
  };

  const toggleTool = (tool: string) => {
    onToolChange(
      selectedTools.includes(tool)
        ? selectedTools.filter((t) => t !== tool)
        : [...selectedTools, tool]
    );
  };

  return (
    <div className={`w-[380px] bg-white overflow-y-auto font-sans ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-[29px] pt-[23px] pb-5">
        <div className="flex items-center gap-1.5">
          <p className="text-base font-medium text-black m-0">Search filter</p>
          <SlidersHorizontal size={24} strokeWidth={2} className="text-[#1B1B1B]" />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search filter"
          className="cursor-pointer border-none bg-transparent p-0.5"
        >
          <X size={14} strokeWidth={2} className="text-[#1B1B1B]" />
        </button>
      </div>

      {/* Sections */}
      <div className="flex flex-col items-center w-[340px] mx-auto gap-[15px]">
        <SectionCard open={categoriesOpen}>
          <SectionHeader
            icon={<CategoriesIcon />}
            label="Categories"
            open={categoriesOpen}
            onClick={() => setCategoriesOpen((o) => !o)}
          />
          {categoriesOpen && (
            <div className="flex flex-col px-2.5 pb-2.5">
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search for categories"
                className="w-full h-10 mt-[5px] px-[15px] rounded-[22.5px] border border-[#949494] text-sm text-[#1b1b1b] outline-none placeholder:text-[#949494] bg-white"
              />
              <div className="flex flex-col mt-5">
                {filteredCategories.includes("All") && (
                  <Row
                    mode="check"
                    label="All"
                    selected={selectedCategories.length === 0}
                    onClick={() => toggleCategory("All")}
                  />
                )}
                {!categorySearch && (
                  <p className="ml-6 mt-[5px] text-xs leading-[14px] text-[#949494]">popular</p>
                )}
                {popularFiltered.filter((c) => c !== "All").map((cat) => (
                  <Row
                    key={cat}
                    mode="check"
                    label={cat}
                    selected={selectedCategories.includes(cat)}
                    onClick={() => toggleCategory(cat)}
                  />
                ))}
                {otherFiltered.map((cat) => (
                  <Row
                    key={cat}
                    mode="check"
                    label={cat}
                    selected={selectedCategories.includes(cat)}
                    onClick={() => toggleCategory(cat)}
                  />
                ))}
                {!categorySearch && (
                  <button
                    type="button"
                    onClick={() => setShowAllCategories((v) => !v)}
                    className="ml-[22px] mt-1 text-xs text-[#6146ea] text-left cursor-pointer border-none bg-transparent hover:underline"
                  >
                    {showAllCategories ? "Show less" : "view all categories"}
                  </button>
                )}
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard open={dateOpen}>
          <SectionHeader
            icon={<CalendarIcon />}
            label="Date"
            open={dateOpen}
            onClick={() => setDateOpen((o) => !o)}
          />
          {dateOpen && (
            <div className="flex flex-col px-2.5 pb-2.5">
              <div className="flex flex-col mt-[10px]">
                {SORT_OPTIONS.map((opt) => (
                  <Row
                    key={opt}
                    label={opt}
                    selected={sortBy === opt}
                    onClick={() => onSortChange(opt)}
                  />
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard open={toolsOpen}>
          <SectionHeader
            icon={<ToolsIcon />}
            label="Tools"
            open={toolsOpen}
            onClick={() => setToolsOpen((o) => !o)}
          />
          {toolsOpen && (
            <div className="flex flex-col px-2.5 pb-2.5">
              <input
                type="text"
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                placeholder="Search for tools"
                className="w-full h-10 mt-[5px] px-[15px] rounded-[22.5px] border border-[#949494] text-sm text-[#1b1b1b] outline-none placeholder:text-[#949494] bg-white"
              />
              <div className="flex flex-col mt-[5px]">
                {!toolSearch && (
                  <p className="ml-6 mt-[5px] text-xs leading-[14px] text-[#949494]">popular</p>
                )}
                {popularToolsFiltered.map((tool) => (
                  <Row
                    key={tool}
                    mode="check"
                    label={tool}
                    selected={selectedTools.includes(tool)}
                    onClick={() => toggleTool(tool)}
                  />
                ))}
                {otherToolsFiltered.map((tool) => (
                  <Row
                    key={tool}
                    mode="check"
                    label={tool}
                    selected={selectedTools.includes(tool)}
                    onClick={() => toggleTool(tool)}
                  />
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-2.5 pt-[15px] pb-5">
        <button
          type="button"
          onClick={onClose}
          className="w-[340px] h-[45px] flex items-center justify-center rounded-[30px] bg-brand-600 text-white text-base font-medium cursor-pointer border-none hover:bg-brand-700 transition-colors"
        >
          Show results
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-[340px] h-[45px] flex items-center justify-center rounded-[30px] border border-brand-600 text-brand-600 text-base font-medium cursor-pointer bg-transparent hover:bg-brand-100 transition-colors"
        >
          Reset all
        </button>
      </div>
    </div>
  );
}
