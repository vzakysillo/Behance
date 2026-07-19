import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";
import { useProjectCreation } from "../context/ProjectCreationContext";
import { routes } from "../routes";

export default function UploadAssetPage() {
  const navigate = useNavigate();
  const { addFile } = useProjectCreation();
  const inputRef = useRef<HTMLInputElement>(null);
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
    <div className="h-full overflow-hidden bg-[#f8f8f8] font-['Inter',sans-serif] flex flex-col">
      <header className="flex items-center justify-between px-[37px] pt-[43px] shrink-0">
        <button
          onClick={() => navigate(routes.profile.root())}
          className="inline-flex items-center gap-3.5 text-base font-medium text-[#6146ea] hover:opacity-80"
        >
          <ChevronLeft size={16} strokeWidth={2} className="text-[#6146ea]" />
          Back
        </button>

        <button
          onClick={() => navigate(routes.profile.root())}
          className="flex items-center justify-center h-[45px] px-7 text-base font-medium text-[#6146ea] rounded-[30px] border border-[#6146ea] hover:bg-[#6146ea]/5"
        >
          Save as draft
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-[342px] min-h-0">
        <h1 className="text-[50px] font-bold text-center text-[#1b1b1b] mb-8 shrink-0">
          Show off your latest creation
        </h1>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
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

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {error && (
        <p className="text-center text-red-600 text-sm shrink-0">{error}</p>
      )}

      <div className="flex justify-end px-[37px] pb-[43px] pt-4 shrink-0">
        <button
          onClick={handleContinue}
          disabled={!file}
          className="flex items-center justify-center gap-[5px] h-[45px] px-7 rounded-[30px] bg-[#6146ea] text-base font-medium text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ChevronRight size={24} strokeWidth={2} className="text-white" />
        </button>
      </div>
    </div>
  );
}
