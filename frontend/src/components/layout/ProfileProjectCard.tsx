import { Link } from "react-router-dom";
import { Heart, MessageSquare } from "lucide-react";
import type { IProject } from "../../types";

interface ProfileProjectCardProps {
  project: IProject;
  linkTo: string;
}

export function ProfileProjectCard({
  project,
  linkTo,
}: ProfileProjectCardProps) {
  return (
    <Link
      to={linkTo}
      className="relative w-full h-[307px] bg-white rounded-[15px] border border-stone-200 overflow-hidden block no-underline group"
    >
      {project.cover ? (
        <img
          src={project.cover}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="w-full h-full bg-stone-300" />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40 flex flex-col justify-end">
        <div className="flex items-center justify-between gap-3 px-[18px] py-[16px] opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <p className="text-base font-medium text-white leading-6 truncate">
            {project.name}
          </p>
          <div className="flex items-center gap-[14px] shrink-0">
            <span className="flex items-center gap-1.5 text-sm text-white">
              <Heart size={18} className="text-white" />
              {project.likesCount ?? 0}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white">
              <MessageSquare size={18} className="text-white" />
              {project.commentsCount ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
