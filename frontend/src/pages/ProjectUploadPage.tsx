import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "lucide-react";
import { useProjectCreation } from "../context/ProjectCreationContext";
import { routes } from "../routes";
import { ProjectCreationHeader } from "../components/layout/ProjectCreationHeader";
import { ProjectCreationFooter } from "../components/layout/ProjectCreationFooter";
import { HiddenFileUpload } from "../components/ui";

export default function ProjectUploadPage() {
  const navigate = useNavigate();
  const { addFile } = useProjectCreation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setError("");
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const f = e.dataTransfer.files[0];
      handleFile(f);
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleContinue = () => {
    if (!file) {
      setError("Please upload an asset to continue.");
      return;
    }
    addFile(file);
    navigate(routes.profile.projectAssets());
  };

  return (
    <div className="h-full overflow-hidden bg-[#f8f8f8] font-sans flex flex-col">
      <ProjectCreationHeader backTo={routes.profile.root()} />

      <div className="flex-1 flex flex-col items-center justify-center px-[342px] min-h-0">
        <h1 className="text-[50px] font-bold text-center text-[#1b1b1b] mb-8 shrink-0">
          Show off your latest creation
        </h1>

        <HiddenFileUpload
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(files) => handleFile(files[0])}
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`w-full max-w-[1168px] flex-1 min-h-0 border-2 border-dashed flex flex-col items-center justify-center gap-10 cursor-pointer transition-colors ${
              isDragOver
                ? "border-[#6146ea] bg-[#6146ea]/5"
                : "border-[#8b8b8b] hover:border-[#6146ea]"
            }`}
          >
            {preview ? (
              <img
                src={preview}
                alt="Asset preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <Image
                  size={140}
                  strokeWidth={1}
                  className="text-[#b0aec5] shrink-0"
                />
                <div className="text-center shrink-0">
                  <p className="text-2xl font-medium text-[#575656]">
                    Drag and drop your media, or&nbsp;
                    <span className="text-[#6146ea] underline">Browse</span>
                  </p>
                  <p className="text-2xl font-light text-[#575656] mt-2.5">
                    Minimum 1600px width recommended. Max 10MB each(20MB for videos)
                  </p>
                </div>
              </>
            )}
          </div>
        </HiddenFileUpload>
      </div>

      {error && (
        <p className="text-center text-red-600 text-sm shrink-0">{error}</p>
      )}

      <ProjectCreationFooter
        disabled={!file}
        onClick={handleContinue}
      />
    </div>
  );
}
