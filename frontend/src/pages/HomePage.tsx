import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFeedProjects } from "../api/project.api";
import { useAuth } from "../hooks/useAuth";
import { routes } from "../routes";
import { SlidersHorizontal } from "lucide-react";
import SearchFilterPanel, { type SortOption } from "../components/SearchFilterPanel";
import { Spinner, ErrorMessage, FilterPill, Search } from "../components/ui";
import { ProfileProjectCard } from "../components/layout/ProfileProjectCard";

type Category = "All" | "Logo design" | "Branding" | "Illustration" | "Social media design" | "UI/UX";

const categories: Category[] = ["All", "Logo design", "Branding", "Illustration", "Social media design", "UI/UX"];

export default function HomePage() {
  const { token } = useAuth();
  const { data: projects, isLoading, isError, error } = useQuery({
    queryKey: ["projects", "feed"],
    queryFn: getFeedProjects,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("Oldest First");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const filteredProjects = (projects ?? [])
    .filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        project.categories?.some((c) =>
          selectedCategories.some((sc) => c.toLowerCase().includes(sc.toLowerCase()))
        );
      const matchesTool =
        selectedTools.length === 0 ||
        project.toolsUsed?.some((t) =>
          selectedTools.some((st) => t.toLowerCase() === st.toLowerCase())
        );
      return matchesSearch && matchesCategory && matchesTool;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? 0).getTime();
      return sortBy === "Newest First" ? dateB - dateA : dateA - dateB;
    });

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategories((prev) =>
      cat === "All" ? [] : prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  if (isLoading) return <Spinner className="ml-[200px]" />;
  if (isError) return <ErrorMessage message={error.message} className="ml-[200px]" />;

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-0 flex-1">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-[50px] pt-[50px] gap-5
                      max-[1024px]:flex-col max-[1024px]:items-stretch
                      max-[768px]:px-5">
        {/* Search */}
        <div className="flex items-center gap-[10px] flex-1 max-[1024px]:max-w-full">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter((v) => !v)}
              className="h-[45px] px-[15px] py-[10px] border-none rounded-full text-base font-medium text-brand-600 bg-brand-100 cursor-pointer transition-colors hover:bg-[#d6c8fb] shrink-0 flex items-center gap-2"
            >
              Search filter
              <SlidersHorizontal size={18} />
            </button>
            {showFilter && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)} />
                <div className="absolute left-0 top-full mt-2 z-50 border border-[#d9d9d9] shadow-lg">
                  <SearchFilterPanel
                    selectedCategories={selectedCategories}
                    onCategoryChange={setSelectedCategories}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    selectedTools={selectedTools}
                    onToolChange={setSelectedTools}
                    onClose={() => setShowFilter(false)}
                    onReset={() => {
                      setSelectedCategories([]);
                      setSortBy("Oldest First");
                      setSelectedTools([]);
                      setSearchQuery("");
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search"
            className="flex-1"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-[15px] max-[1024px]:flex-col">
        {token && (
          <span
            className="px-[10px] h-[45px] flex items-center justify-center text-base font-medium no-underline rounded-full bg-brand-600 text-white min-w-[285px] cursor-pointer transition-colors hover:bg-brand-700
                       max-[1024px]:w-full max-[768px]:w-full"
          >
            Start free trial
          </span>
        )}
          <Link
            to={routes.profile.projectUpload()}
            className="px-[10px] h-[45px] flex items-center justify-center text-base font-medium no-underline rounded-full bg-brand-100 text-brand-600 min-w-[284px] transition-colors hover:bg-[#d6c8fb]
                       max-[1024px]:w-full max-[768px]:w-full"
          >
            Share work
          </Link>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-[15px] px-[50px] py-5 flex-wrap max-[768px]:px-5 max-[768px]:gap-[10px]">
        {categories.map((category) => (
          <FilterPill
            key={category}
            selected={
              category === "All" ? selectedCategories.length === 0 : selectedCategories.includes(category)
            }
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </FilterPill>
        ))}
      </div>

      {/* Section header */}
      <div className="px-[50px] mb-5 max-[768px]:px-5">
        <h2 className="text-base font-sans font-normal text-black m-0">Recommended for you</h2>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-4 gap-[30px] px-[50px] pb-[50px]
                      max-[1400px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1 max-[768px]:px-5 max-[768px]:pb-5">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full flex justify-center items-center min-h-[400px] text-lg font-sans text-[#666]">
            No projects found
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProfileProjectCard
              key={project._id}
              project={project}
              linkTo={routes.projectDetail(project._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
