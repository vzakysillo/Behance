import { useRef } from "react";
import type { ReactNode } from "react";

interface HiddenFileUploadProps {
  accept?: string;
  multiple?: boolean;
  onChange: (files: FileList) => void;
  children: ReactNode;
}

export function HiddenFileUpload({
  accept,
  multiple,
  onChange,
  children,
}: HiddenFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        className="contents [&]:cursor-pointer"
      >
        {children}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) onChange(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}
