import type { ReactNode } from "react";
import { RedesignFooter } from "@/components/redesign/RedesignFooter";
import { RedesignHeader } from "@/components/redesign/RedesignHeader";
import { RedesignStickyBar } from "@/components/redesign/RedesignStickyBar";

type RedesignShellProps = {
  page: string;
  children: ReactNode;
};

export function RedesignShell({ page, children }: RedesignShellProps) {
  return (
    <div className="min-h-screen bg-[#fafaf7] pb-24 text-[#1c1c1c]">
      <RedesignHeader page={page} />
      {children}
      <RedesignFooter />
      <RedesignStickyBar page={page} />
    </div>
  );
}
