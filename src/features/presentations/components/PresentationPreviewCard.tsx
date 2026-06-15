import { ChevronLeft, ChevronRight, Maximize, Edit3, Grid, Minus, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PresentationPreviewCard() {
  return (
    <Card className="mb-6 shadow-sm border-slate-200 flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex flex-col">
            <h3 className="font-semibold text-slate-800 text-base">Presentation Preview</h3>
            <p className="text-[13px] text-slate-500 mt-0.5">AVL Trees & Balancing Operations</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-none border-slate-200 text-slate-500 hover:bg-slate-50">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none border-l-0 border-slate-200 text-slate-500 hover:bg-slate-50">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline" className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50">
              Slide 1 of 10
              <span className="ml-2 text-slate-400 text-[10px]">▼</span>
            </Button>
            
            <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 text-slate-500 hover:bg-slate-50">
              <Maximize className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 min-h-[450px] bg-[#F8FAFC]">
          
          {/* Thumbnails Sidebar */}
          <div className="w-[120px] shrink-0 border-r border-slate-100 p-4 flex flex-col gap-3 overflow-y-auto bg-white">
            
            {/* Active Thumbnail */}
            <div className="relative group cursor-pointer">
              <div className="absolute top-1.5 left-1.5 bg-slate-800/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">1</div>
              <div className="aspect-[16/9] rounded-md bg-[#1E293B] border-2 border-[#5A67D8] overflow-hidden shadow-sm flex flex-col p-2">
                 <div className="w-1/2 h-1 bg-[#334155] rounded-full mb-2"></div>
                 <div className="w-3/4 h-1 bg-[#334155] rounded-full mb-1"></div>
                 <div className="w-2/3 h-1 bg-[#334155] rounded-full mb-1"></div>
              </div>
            </div>

            {/* Inactive Thumbnail 2 */}
            <div className="relative group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
              <div className="absolute top-1.5 left-1.5 bg-slate-800/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">2</div>
              <div className="aspect-[16/9] rounded-md bg-[#94A3B8] border border-slate-200 overflow-hidden flex flex-col p-2">
                 <div className="w-1/2 h-1 bg-[#CBD5E1] rounded-full mb-2"></div>
                 <div className="w-full h-1 bg-[#CBD5E1] rounded-full mb-1"></div>
                 <div className="w-full h-1 bg-[#CBD5E1] rounded-full mb-1"></div>
              </div>
            </div>

            {/* Inactive Thumbnail 3 */}
            <div className="relative group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
              <div className="absolute top-1.5 left-1.5 bg-slate-800/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">3</div>
              <div className="aspect-[16/9] rounded-md bg-[#94A3B8] border border-slate-200 overflow-hidden flex flex-col p-2">
                 <div className="w-1/2 h-1 bg-[#CBD5E1] rounded-full mb-2"></div>
                 <div className="w-2/3 h-1 bg-[#CBD5E1] rounded-full mb-1"></div>
                 <div className="w-3/4 h-1 bg-[#CBD5E1] rounded-full mb-1"></div>
              </div>
            </div>

            {/* Inactive Thumbnail 4 */}
            <div className="relative group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
              <div className="absolute top-1.5 left-1.5 bg-slate-800/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">4</div>
              <div className="aspect-[16/9] rounded-md bg-[#94A3B8] border border-slate-200 overflow-hidden flex flex-col p-2">
                 <div className="w-1/2 h-1 bg-[#CBD5E1] rounded-full mb-2"></div>
                 <div className="w-5/6 h-1 bg-[#CBD5E1] rounded-full mb-1"></div>
              </div>
            </div>

          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-6 flex items-center justify-center">
            
            {/* The Slide */}
            <div className="w-full max-w-[700px] aspect-[16/9] bg-white rounded-lg shadow-sm border border-slate-200 p-10 flex relative overflow-hidden">
              
              {/* Left Content */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-[#EEF2FF] border border-[#5A67D8] text-[#5A67D8] text-[10px] font-bold px-1.5 py-0.5 rounded">IIS</div>
                  <span className="text-xs font-semibold text-slate-500">SS Tech</span>
                </div>
                
                <h1 className="text-[32px] leading-[1.1] font-bold text-slate-800 mb-6 tracking-tight">
                  AVL Trees &<br />Balancing Operations
                </h1>
                
                <div className="flex flex-col gap-1 mt-4">
                  <span className="text-[13px] font-bold text-[#5A67D8]">Data Structures</span>
                  <span className="text-[13px] font-medium text-slate-800">Prof. Anil Kumar</span>
                  <span className="text-[11px] text-slate-400 font-medium">CSE V A</span>
                </div>
              </div>

              {/* Right Visualization (Mocked Tree) */}
              <div className="flex-1 flex items-center justify-center relative">
                
                {/* 30 */}
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-[#5A67D8] bg-white flex items-center justify-center text-[#5A67D8] font-bold text-sm z-10 shadow-sm">30</div>
                
                {/* Lines from 30 */}
                <svg className="absolute top-[20%] left-0 w-full h-[80%] z-0" style={{ pointerEvents: 'none' }}>
                   <line x1="50%" y1="20" x2="30%" y2="80" stroke="#CBD5E1" strokeWidth="2" />
                   <line x1="50%" y1="20" x2="70%" y2="80" stroke="#CBD5E1" strokeWidth="2" />
                   
                   <line x1="30%" y1="80" x2="15%" y2="140" stroke="#CBD5E1" strokeWidth="2" />
                   <line x1="30%" y1="80" x2="45%" y2="140" stroke="#CBD5E1" strokeWidth="2" />
                   
                   <line x1="70%" y1="80" x2="55%" y2="140" stroke="#CBD5E1" strokeWidth="2" />
                   <line x1="70%" y1="80" x2="85%" y2="140" stroke="#CBD5E1" strokeWidth="2" />
                </svg>

                {/* 20 and 40 */}
                <div className="absolute top-[45%] left-[30%] -translate-x-1/2 w-10 h-10 rounded-full border-2 border-[#A5B4FC] bg-white flex items-center justify-center text-[#5A67D8] font-bold text-sm z-10">20</div>
                <div className="absolute top-[45%] left-[70%] -translate-x-1/2 w-10 h-10 rounded-full border-2 border-[#A5B4FC] bg-white flex items-center justify-center text-[#5A67D8] font-bold text-sm z-10">40</div>

                {/* Leaf nodes */}
                <div className="absolute top-[70%] left-[15%] -translate-x-1/2 w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 font-medium text-xs z-10">10</div>
                <div className="absolute top-[70%] left-[45%] -translate-x-1/2 w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 font-medium text-xs z-10">25</div>
                <div className="absolute top-[70%] left-[55%] -translate-x-1/2 w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 font-medium text-xs z-10">35</div>
                <div className="absolute top-[70%] left-[85%] -translate-x-1/2 w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 font-medium text-xs z-10">50</div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 bg-slate-50 shadow-none">
              <Edit3 className="w-3.5 h-3.5 mr-1.5" />
              Notes View
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-medium text-slate-500 hover:text-slate-700">
              <Grid className="w-3.5 h-3.5 mr-1.5" />
              Grid View
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700 min-w-[36px] text-center">100%</span>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
