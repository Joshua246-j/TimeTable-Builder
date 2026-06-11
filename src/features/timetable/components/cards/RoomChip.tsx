import { memo } from "react";

interface RoomChipProps {
  roomName: string;
}

export default memo(function RoomChip({ roomName }: RoomChipProps) {
  return (
    <div className="flex items-center shrink-0 rounded-[6px] border border-[#BFDBFE] bg-[#DBEAFE] px-[8px] h-[30px]">
      <span className="text-[12px] font-[700] text-[#2563EB] whitespace-nowrap">
        {roomName}
      </span>
    </div>
  );
});
