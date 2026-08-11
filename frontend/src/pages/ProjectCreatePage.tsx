import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../api/project.api";
import { uploadImage } from "../api/upload.api";
import ProjectForm from "../components/ProjectForm";
import { useProjectCreation } from "../context/ProjectCreationContext";
import { routes } from "../routes";
import { BackLarge, Button } from "../components/ui";

export default function ProjectCreatePage() {
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
    <div className="h-svh overflow-hidden bg-[#f8f8f8] font-sans text-black">
      <div className="px-[50px] pt-10 flex items-center justify-between">
        <BackLarge to={routes.profile.projectAssets()} />
        <Button
          variant="secondary"
          type="button"
          onClick={() => navigate(routes.profile.root())}
          className="px-7"
        >
          Save as draft
        </Button>
      </div>

      <ProjectForm
        submitLabel="Publish"
        onSubmit={async (data, coverFile) => {
          let coverUrl = data.cover;
          if (coverFile) {
            coverUrl = await uploadImage(coverFile);
          }

          const uploadedAssets = await Promise.all(
            files.map((f) => uploadImage(f))
          );

          if (!coverUrl && uploadedAssets.length > 0) {
            coverUrl = uploadedAssets.shift()!;
          }

          const assets = uploadedAssets.filter((asset) => asset !== coverUrl);

          const project = await createMutation.mutateAsync({ ...data, cover: coverUrl, assets });
          console.log(project);
        }}
      />
    </div>
  );
}
