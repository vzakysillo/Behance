import { Link } from "react-router-dom";
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
      className="w-full h-[307px] bg-white rounded-[15px] border border-stone-200 overflow-hidden block no-underline group"
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
    </Link>
  );
}
