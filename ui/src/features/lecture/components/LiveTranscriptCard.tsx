import { Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function LiveTranscriptCard() {
  return (
    <Card className="mb-6 shadow-sm border-slate-200 flex flex-col h-[500px]">
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-semibold text-slate-800">Live transcript</CardTitle>
          <Badge variant="outline" className="text-[10px] bg-[#EEF2FF] text-[#5A67D8] border-[#E0E7FF] font-bold px-1.5 py-0">
            LIVE
          </Badge>
        </div>
        
        <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
          <Globe className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
          English (US)
          <span className="ml-1 text-slate-400 text-[10px]">▼</span>
        </Button>
      </CardHeader>
      
      <CardContent className="px-2 py-2 flex-1 overflow-auto">
        
        <div className="flex flex-col gap-1">
          {/* Entry 1 */}
          <div className="flex items-start gap-3 p-3 hover:bg-[#F8FAFC] rounded-lg transition-colors">
            <span className="text-xs font-semibold text-[#5A67D8] shrink-0 mt-0.5 w-14">09:10 AM</span>
            <Badge variant="outline" className="text-[10px] text-[#5A67D8] border-[#E0E7FF] bg-[#EEF2FF] shrink-0 font-medium px-1.5 py-0 h-5 mt-0.5">
              Faculty:
            </Badge>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Today we will discuss AVL Trees and their basic operations.
            </p>
          </div>

          {/* Entry 2 */}
          <div className="flex items-start gap-3 p-3 hover:bg-[#F8FAFC] rounded-lg transition-colors">
            <span className="text-xs font-semibold text-[#5A67D8] shrink-0 mt-0.5 w-14">09:15 AM</span>
            <Badge variant="outline" className="text-[10px] text-[#5A67D8] border-[#E0E7FF] bg-[#EEF2FF] shrink-0 font-medium px-1.5 py-0 h-5 mt-0.5">
              Faculty:
            </Badge>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              The balance factor determines whether a rotation is required.
            </p>
          </div>

          {/* Entry 3 */}
          <div className="flex items-start gap-3 p-3 hover:bg-[#F8FAFC] rounded-lg transition-colors">
            <span className="text-xs font-semibold text-[#5A67D8] shrink-0 mt-0.5 w-14">09:20 AM</span>
            <Badge variant="outline" className="text-[10px] text-[#5A67D8] border-[#E0E7FF] bg-[#EEF2FF] shrink-0 font-medium px-1.5 py-0 h-5 mt-0.5">
              Faculty:
            </Badge>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Left rotation is performed when the left subtree becomes heavier.
            </p>
          </div>

          {/* Entry 4 */}
          <div className="flex items-start gap-3 p-3 hover:bg-[#F8FAFC] rounded-lg transition-colors">
            <span className="text-xs font-semibold text-[#5A67D8] shrink-0 mt-0.5 w-14">09:25 AM</span>
            <Badge variant="outline" className="text-[10px] text-[#5A67D8] border-[#E0E7FF] bg-[#EEF2FF] shrink-0 font-medium px-1.5 py-0 h-5 mt-0.5">
              Faculty:
            </Badge>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Right rotation is performed when the right subtree becomes heavier.
            </p>
          </div>
          
        </div>

      </CardContent>
    </Card>
  );
}
