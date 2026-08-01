import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Paperclip } from "lucide-react";
import { useProjectCreation } from "../context/ProjectCreationContext";
import { routes } from "../routes";
import { ProjectCreationHeader } from "../components/layout/ProjectCreationHeader";
import { ProjectCreationFooter } from "../components/layout/ProjectCreationFooter";
import { HiddenFileUpload, Button } from "../components/ui";

export default function ProjectAssetsPage() {
  const navigate = useNavigate();
  const { files, addFile, removeFile } = useProjectCreation();
  const [error, setError] = useState("");

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      setError("");
      addFile(file);
    },
    [addFile]
  );

  return (
    <div className="h-full overflow-y-auto bg-[#f8f8f8] font-sans flex flex-col">
      <ProjectCreationHeader backTo={routes.profile.projectUpload()} />

      <div className="flex-1 flex px-[49px] pt-[40px] pb-0 gap-[38px]">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative">
            {files.length > 0 ? (
              <div className="flex flex-col gap-3">
                {files.map((file, i) => (
                  <AssetPreview key={i} file={file} onRemove={() => removeFile(i)} />
                ))}
              </div>
            ) : (
              <div className="flex-1 min-h-0 bg-[#a39f9f] flex items-center justify-center relative">
                <p className="text-3xl text-[#575656]">media</p>
              </div>
            )}
          </div>

          <div className="border-t border-[#5b5b5b] my-0" />

          <div className="flex justify-center py-4">
            <HiddenFileUpload
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(fileList) => {
                for (let i = 0; i < fileList.length; i++) {
                  handleFile(fileList[i]);
                }
              }}
            >
              <Button variant="secondary" className="w-[220px]">
                + Add media
              </Button>
            </HiddenFileUpload>
          </div>
        </div>

        <div className="w-[334px] shrink-0 bg-white flex flex-col pt-[45px] px-[29px]">
          <h2 className="text-2xl font-medium text-black mb-4">
            Attach Assets
          </h2>
          <p className="text-sm text-[#747474] mb-6 leading-5">
            Add files like fonts, illustrations, photos, zips, or templates.
          </p>
          <HiddenFileUpload
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(fileList) => {
              for (let i = 0; i < fileList.length; i++) {
                handleFile(fileList[i]);
              }
            }}
          >
            <Button
              variant="secondary"
              className="inline-flex items-center justify-center gap-2"
              icon={<Paperclip size={18} strokeWidth={2} />}
            >
              Attach Assets
            </Button>
          </HiddenFileUpload>
        </div>
      </div>

      {error && (
        <p className="text-center text-red-600 text-sm shrink-0">{error}</p>
      )}

      <ProjectCreationFooter
        disabled={files.length === 0}
        onClick={() => navigate(routes.profile.projectCreate())}
      />
    </div>
  );
}

function AssetPreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [preview] = useState(() => URL.createObjectURL(file));

  return (
    <div className="relative aspect-video bg-white border border-[#e0e0e0]">
      <img
        src={preview}
        alt={file.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70"
      >
        <X size={14} />
      </button>
    </div>
  );
}
