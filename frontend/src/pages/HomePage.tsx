import { useState } from "react";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getFeedProjects } from "../api/project.api";
import { useAuth } from "../hooks/useAuth";
import { Spinner, ErrorMessage } from "../components/ui";
import { routes } from "../routes";
import { Heart, MessageSquare, Search } from "lucide-react";

type Category = "All" | "Logo design" | "Branding" | "Illustration" | "Social media design" | "UI/UX";

const categories: Category[] = ["All", "Logo design", "Branding", "Illustration", "Social media design", "UI/UX"];

export default function HomePage() {
  const { token } = useAuth();
  const { data: projects, loading, error } = useAsync(getFeedProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const filteredProjects = (projects ?? []).filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || project.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Spinner className="ml-[200px]" />;
  if (error) return <ErrorMessage message={error} className="ml-[200px]" />;

  return (
    <div className="min-h-screen bg-white p-0 flex-1">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-[50px] pt-[50px] gap-5
                      max-[1024px]:flex-col max-[1024px]:items-stretch
                      max-[768px]:px-5">
        {/* Search */}
        <div className="flex-1 max-w-[873px] max-[1024px]:max-w-full">
          <div className="flex items-center gap-[10px] px-5 py-[10px] bg-[#c6c2c2] rounded h-[45px]">
            <div className="flex items-center justify-center w-6 h-6 shrink-0">
              <Search size={24} className="text-black" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none bg-transparent text-base font-['Inter',sans-serif] font-normal text-black outline-none placeholder:text-black"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[15px] max-[1024px]:flex-col">
        {token && (
          <Link
            to={routes.welcome()}
            className="px-[10px] h-[45px] flex items-center justify-center text-base font-['Inter',sans-serif] font-normal no-underline rounded bg-[#e8e7e7] text-black min-w-[285px] transition-colors hover:bg-[#d8d7d7]
                       max-[1024px]:w-full max-[768px]:w-full"
          >
            Start free trial
          </Link>
        )}
          <Link
            to={routes.profile.projectNew()}
            className="px-[10px] h-[45px] flex items-center justify-center text-base font-['Inter',sans-serif] font-normal no-underline rounded bg-[#e8e7e7] text-black min-w-[284px] transition-colors hover:bg-[#d8d7d7]
                       max-[1024px]:w-full max-[768px]:w-full"
          >
            Share work
          </Link>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-[15px] px-[50px] py-5 flex-wrap max-[768px]:px-5 max-[768px]:gap-[10px]">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={[
              "h-[45px] px-[15px] py-[10px] border-none rounded text-base font-['Inter',sans-serif] font-normal text-black cursor-pointer transition-colors whitespace-nowrap",
              "max-[768px]:text-sm max-[768px]:px-3 max-[768px]:py-2",
              selectedCategory === category ? "bg-[#c3c3c3]" : "bg-[#e8e7e7] hover:bg-[#d8d7d7]",
            ].join(" ")}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Section header */}
      <div className="px-[50px] mb-5 max-[768px]:px-5">
        <h2 className="text-base font-['Inter',sans-serif] font-normal text-black m-0">Recommended for you</h2>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-4 gap-[30px] px-[50px] pb-[50px]
                      max-[1400px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1 max-[768px]:px-5 max-[768px]:pb-5">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full flex justify-center items-center min-h-[400px] text-lg font-['Inter',sans-serif] text-[#666]">
            No projects found
          </div>
        ) : (
          filteredProjects.map((project) => (
            <Link
              key={project._id}
              to={routes.projectDetail(project._id)}
              className="no-underline text-inherit block group"
            >
              {/* Image */}
              <div className="relative w-full h-[380px] bg-[#a39f9f] rounded overflow-hidden">
                {project.cover ? (
                  <img src={project.cover} alt={project.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#a39f9f]" />
                )}
                {/* Hover overlay (decorative "..." menu only) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-5 right-5">
                    <span className="text-white text-[32px] font-semibold font-['Inter',sans-serif] cursor-pointer select-none">...</span>
                  </div>
                </div>
              </div>

              {/* Info — always visible, dark text on white background (fixes prior white-on-white bug) */}
              <div className="pt-[15px]">
                <div className="flex items-center gap-[10px] mb-2">
                  <div className="w-[46px] h-[46px] rounded-full bg-[#e2e2e2] shrink-0 overflow-hidden">
                    {project.author?.avatar && (
                      <img src={project.author.avatar} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <span className="text-base font-['Inter',sans-serif] font-medium text-gray-800">
                    {[project.author?.firstName, project.author?.lastName].filter(Boolean).join(" ") || project.author?.userName || "User"}
                  </span>
                </div>
                <h3 className="text-xl font-['Inter',sans-serif] font-semibold text-gray-900 m-0 mb-2">{project.name}</h3>
                <p className="text-base font-['Inter',sans-serif] font-normal text-gray-600 m-0 mb-[15px] leading-[1.4] line-clamp-2">
                  {project.description || "No description available"}
                </p>
                <div className="flex gap-[30px]">
                  <div className="flex items-center gap-2">
                    <Heart size={18} className="text-gray-700" />
                    <span className="text-base font-['Inter',sans-serif] font-medium text-gray-700">{project.likesCount ?? 0}</span>
                  </div>
                  {!project.disableComments && (
                    <div className="flex items-center gap-2">
                      <MessageSquare size={18} className="text-gray-700" />
                      <span className="text-base font-['Inter',sans-serif] font-medium text-gray-700">{project.commentsCount ?? 0}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
