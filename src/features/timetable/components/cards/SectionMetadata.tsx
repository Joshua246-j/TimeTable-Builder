import { memo } from "react";
import { Users } from "lucide-react";

interface SectionMetadataProps {
  sectionName?: string;
}

export default memo(function SectionMetadata({ sectionName }: SectionMetadataProps) {
  return (
    <div className="flex items-center gap-1.5 text-[#64748B] min-w-0">
      <Users className="w-3.5 h-3.5 shrink-0" />
      <span className="text-[11px] font-medium truncate">
        {sectionName || "Section CSE V A"}
      </span>
    </div>
  );
});
