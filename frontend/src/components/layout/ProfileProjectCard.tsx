import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
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
      className="w-96 h-96 bg-zinc-300 relative block overflow-hidden no-underline group"
    >
      {project.cover ? (
        <img
          src={project.cover}
          alt={project.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-stone-300" />
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-xl font-normal text-white">{project.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <Heart size={20} className="text-white" />
          <span className="text-base font-normal text-white">
            {project.likesCount ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}
