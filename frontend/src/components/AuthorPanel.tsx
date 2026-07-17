import { Link } from "react-router-dom";
import { Eye, UserPlus } from "lucide-react";
import { routes } from "../routes";
import type { IProject, IUser } from "../types";

export const getProjectImage = (project: IProject) => project.cover || project.assets?.[0] || "";

export default function AuthorPanel({
  author,
  authorName,
  authorSpecialization,
  projects,
}: {
  author?: IUser;
  authorName: string;
  authorSpecialization: string;
  projects: IProject[];
}) {
  return (
    <div>
      <div className="mb-7 flex items-center gap-5">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full bg-[#d9d9d9]">
          {author?.avatar && <img src={author.avatar} alt={authorName} className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-normal leading-9">{authorName}</h2>
          <p className="truncate text-xl font-normal text-zinc-600">{authorSpecialization}</p>
        </div>
      </div>

      <div className="mb-24 space-y-3">
        <Link
          to={author ? routes.publicProfile(author._id) : routes.profile.root()}
          className="flex h-11 w-full items-center justify-center gap-3 bg-white px-4 text-base text-black no-underline hover:bg-neutral-50"
        >
          <Eye size={18} />
          View profile
        </Link>
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-3 border border-neutral-600 px-4 text-base text-neutral-600 hover:bg-neutral-100"
        >
          <UserPlus size={18} />
          Follow
        </button>
      </div>

      <h3 className="mb-6 text-2xl font-semibold uppercase leading-9">Other projects</h3>
      <div className="space-y-5">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link
              key={project._id}
              to={routes.projectDetail(project._id)}
              className="grid h-28 grid-cols-[160px_minmax(0,1fr)] bg-[#d9d9d9] text-black no-underline hover:bg-[#d0d0d0]"
            >
              <div className="bg-[#a7a7a7]">
                {getProjectImage(project) && (
                  <img src={getProjectImage(project)} alt={project.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 px-4 py-3">
                <h4 className="truncate text-base font-medium leading-6">{project.name}</h4>
                <p className="mt-1 line-clamp-3 text-sm font-normal leading-4">
                  {project.description || "Project description will appear here once it is added."}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-neutral-500">No other projects yet.</p>
        )}
      </div>
    </div>
  );
}
