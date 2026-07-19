import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, Paperclip } from "lucide-react";
import { useProjectCreation } from "../context/ProjectCreationContext";
import { routes } from "../routes";

export default function ProjectAssetsPage() {
  const navigate = useNavigate();
  const { files, addFile, removeFile } = useProjectCreation();
  const inputRef = useRef<HTMLInputElement>(null);
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
    <div className="h-full overflow-hidden bg-[#f8f8f8] font-['Inter',sans-serif] flex flex-col">
      <header className="flex items-center justify-between px-[37px] pt-[43px] shrink-0">
        <button
          onClick={() => navigate(routes.profile.projectNew())}
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

      <div className="flex-1 flex min-h-0 px-[49px] pt-[40px] pb-0 gap-[38px]">
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <div className="flex-1 min-h-0 bg-[#a39f9f] flex items-center justify-center relative">
            {files.length > 0 ? (
              <div className="w-full h-full overflow-auto p-4">
                <div className="grid grid-cols-2 gap-3">
                  {files.map((file, i) => (
                    <AssetPreview key={i} file={file} onRemove={() => removeFile(i)} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-3xl text-[#575656]">media</p>
            )}
          </div>

          <div className="border-t border-[#5b5b5b] my-0" />

          <div className="flex justify-center py-4">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex justify-center items-center w-[220px] h-14 bg-white border border-[#5b5b5b] text-base font-medium text-black hover:bg-gray-50 transition-colors"
            >
              + Add media
            </button>
          </div>
        </div>

        <div className="w-[334px] shrink-0 bg-[#d9d9d9] flex flex-col pt-[45px] px-[29px]">
          <h2 className="text-2xl font-medium text-black mb-4">
            Attach Assets
          </h2>
          <p className="text-sm text-[#747474] mb-6 leading-5">
            Add files like fonts, illustrations, photos, zips, or templates.
          </p>
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-3 w-fit px-[15px] py-2.5 bg-white hover:bg-gray-50 transition-colors"
          >
            <Paperclip size={18} className="text-[#4C4C4C]" strokeWidth={2} />
            <span className="text-base font-medium text-black">Attach Assets</span>
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        multiple
        onChange={(e) => {
          const fileList = e.target.files;
          if (fileList) {
            for (let i = 0; i < fileList.length; i++) {
              handleFile(fileList[i]);
            }
          }
          e.target.value = "";
        }}
      />

      {error && (
        <p className="text-center text-red-600 text-sm shrink-0">{error}</p>
      )}

      <div className="flex justify-end px-[37px] pb-[43px] pt-4 shrink-0">
        <button
          onClick={() => navigate(routes.profile.projectDetails())}
          disabled={files.length === 0}
          className="flex items-center justify-center gap-[5px] h-[45px] px-7 rounded-[30px] bg-[#6146ea] text-base font-medium text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ChevronRight size={24} strokeWidth={2} className="text-white" />
        </button>
      </div>
    </div>
  );
}

function AssetPreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [preview] = useState(() => URL.createObjectURL(file));

  return (
    <div className="relative aspect-video bg-white border border-[#e0e0e0]">
      <img src={preview} alt={file.name} className="w-full h-full object-cover" />
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70"
      >
        <X size={14} />
      </button>
    </div>
  );
}
