import { FileText, ChevronDown, Undo2, Redo2, Sparkles, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function LectureEditorCard() {
  return (
    <Card className="mb-6 shadow-sm border-slate-200">
      <CardContent className="p-6 flex flex-col h-full min-h-[500px]">
        
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="bg-[#EEF2FF] p-2.5 rounded-lg border border-[#E0E7FF]">
            <FileText className="w-5 h-5 text-[#5A67D8]" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-slate-800 text-lg">Lecture points</h3>
            <p className="text-sm text-slate-500 mt-0.5">Add important concepts, explanations, and teaching points for this lecture.</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-1.5 text-slate-600">
            <button className="flex items-center gap-1 text-sm font-medium hover:bg-slate-50 px-2 py-1.5 rounded transition-colors text-slate-700">
              Paragraph
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            
            <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
            
            <button className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 font-bold px-2">B</button>
            <button className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 italic font-serif px-2">I</button>
            <button className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 underline px-2">U</button>
            <button className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 line-through px-2">S</button>
            
            <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
              <Undo2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 outline-none text-slate-600 text-[15px] leading-relaxed relative pb-6 cursor-text">
          <div className="space-y-4">
            <ul className="list-none space-y-2.5 ml-1">
              <li>Introduction to AVL Trees</li>
              <li>Balance Factor</li>
              <li>Left Rotation</li>
              <li>Right Rotation</li>
              <li>Time Complexity</li>
              <li>Applications</li>
            </ul>
            
            <p>
              AVL Trees are self-balancing binary search trees where the height difference between left and right subtrees of any node is at most one. Rotations are performed to maintain this balance and ensure efficient operations.
            </p>
          </div>
          
          <div className="absolute bottom-0 right-0 text-[11px] font-medium text-slate-400">
            123 words
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-3">
            <Button className="bg-[#5A67D8] hover:bg-[#4C51BF] text-white font-medium h-10 px-4 shadow-sm transition-colors">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Overview
            </Button>
            <Button className="bg-[#5A67D8] hover:bg-[#4C51BF] text-white font-medium h-10 px-4 shadow-sm transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              Convert To Notes
            </Button>
          </div>
          <Button variant="outline" className="border-slate-200 text-slate-700 font-medium h-10 px-4 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
