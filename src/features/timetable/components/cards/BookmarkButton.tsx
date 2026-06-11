import { memo } from "react";
import { Bookmark } from "lucide-react";

export default memo(function BookmarkButton() {
  return (
    <button className="text-[#CBD5E1] hover:text-blue-500 transition-colors shrink-0 ml-2">
      <Bookmark className="w-3.5 h-3.5" />
    </button>
  );
});
