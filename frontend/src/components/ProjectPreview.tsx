import { Link } from "react-router-dom";
import { routes } from "../routes";
import type { IProject } from "../types";
import { getProjectImage } from "./AuthorPanel";

export default function ProjectPreview({ project }: { project: IProject }) {
  return (
    <Link to={routes.projectDetail(project._id)} className="group block text-black no-underline">
      <div className="h-96 bg-[#a7a7a7]">
        {getProjectImage(project) && (
          <img src={getProjectImage(project)} alt={project.name} className="h-full w-full object-cover" />
        )}
      </div>
      <h3 className="mt-3 text-base font-medium group-hover:underline">{project.name}</h3>
    </Link>
  );
}
