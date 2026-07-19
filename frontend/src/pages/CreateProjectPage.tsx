import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { createProject } from "../api/project.api";
import { uploadImage } from "../api/upload.api";
import ProjectForm from "../components/ProjectForm";
import { useProjectCreation } from "../context/ProjectCreationContext";
import { routes } from "../routes";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { files, clearFiles } = useProjectCreation();

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      clearFiles();
      navigate(routes.profile.projectPublished(project._id));
    },
  });

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-black">
      <div className="px-[50px] pt-10 flex items-center">
        <Link
          to={routes.profile.projectAssets()}
          className="inline-flex items-center gap-2 text-sm font-normal text-black no-underline hover:text-zinc-500"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          Back
        </Link>
      </div>

      <ProjectForm
        submitLabel="Publish"
        onSubmit={async (data) => {
          const uploadedFiles = await Promise.all(
            files.map((f) => uploadImage(f))
          );
          const cover = uploadedFiles[0] || data.cover;
          const assets = uploadedFiles.slice(1);
          const project = await createMutation.mutateAsync({ ...data, cover, assets });
          console.log(project);
        }}
      />
    </div>
  );
}
