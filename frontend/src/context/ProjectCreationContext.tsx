import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface ProjectCreationContextType {
  files: File[];
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
}

const ProjectCreationContext = createContext<ProjectCreationContextType | null>(null);

export function ProjectCreationProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<File[]>([]);

  const addFile = useCallback((file: File) => {
    setFiles((prev) => [...prev, file]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return (
    <ProjectCreationContext.Provider value={{ files, addFile, removeFile, clearFiles }}>
      {children}
    </ProjectCreationContext.Provider>
  );
}

export function useProjectCreation() {
  const ctx = useContext(ProjectCreationContext);
  if (!ctx) throw new Error("useProjectCreation must be used within ProjectCreationProvider");
  return ctx;
}
