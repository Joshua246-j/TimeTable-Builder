'use client';

import { FileText, Sparkles, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { LectureEditor } from './editor/LectureEditor';

export function LectureEditorCard() {
  const [wordCount, setWordCount] = useState(0);

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

        {/* Editor Area */}
        <div className="flex-1 relative">
          <LectureEditor onWordCount={setWordCount} />
          
          {/* Word Count display is floated at the bottom right of the editor */}
          <div className="absolute bottom-6 right-0 text-[11px] font-medium text-slate-400">
            {wordCount} words
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
