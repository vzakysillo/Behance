import type { ReactNode } from "react";

interface AuthPageLayoutProps {
  visualPanel: ReactNode;
  formPanel: ReactNode;
}

export function AuthPageLayout({ visualPanel, formPanel }: AuthPageLayoutProps) {
  return (
    <main className="min-h-svh w-[min(100vw,1920px)] mx-auto grid grid-cols-[minmax(420px,49.74%)_minmax(460px,1fr)] overflow-hidden bg-white text-[#525252] font-['Inter',system-ui,sans-serif] text-left
                     max-[1024px]:grid-cols-1 max-[1024px]:overflow-visible">
      {visualPanel}
      {formPanel}
    </main>
  );
}
