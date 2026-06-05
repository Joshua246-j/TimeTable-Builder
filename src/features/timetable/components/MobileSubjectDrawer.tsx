"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SubjectAllocationPanel from "./SubjectAllocationPanel";

interface MobileSubjectDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileSubjectDrawer({
  open,
  onOpenChange,
}: MobileSubjectDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-[24px] p-0 border-t border-slate-200"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Subject Allocation</SheetTitle>
        </SheetHeader>
        
        {/* We reuse SubjectAllocationPanel but override its sticky/border styles via an inner wrapper or just let it fill the sheet */}
        <div className="h-full w-full overflow-hidden [&>aside]:h-full [&>aside]:border-0 [&>aside]:rounded-none [&>aside]:static [&>aside]:w-full">
          <SubjectAllocationPanel />
        </div>
      </SheetContent>
    </Sheet>
  );
}
