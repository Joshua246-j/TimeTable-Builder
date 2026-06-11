import { memo } from "react";

interface FacultyChipProps {
  facultyName: string;
}

export default memo(function FacultyChip({ facultyName }: FacultyChipProps) {
  return (
    <div className="flex items-center rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] px-[8px] h-[30px] min-w-0 flex-1 max-w-full">
      <span className="truncate text-[12px] font-[600] text-[#334155] w-full">
        {facultyName}
      </span>
    </div>
  );
});
