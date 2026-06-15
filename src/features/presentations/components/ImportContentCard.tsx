import { Upload, FileType2, FileText, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ImportContentCard() {
  return (
    <Card className="mb-6 shadow-sm border-slate-200">
      <CardContent className="p-6">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-4 h-4 text-[#5A67D8]" />
          <h3 className="font-semibold text-slate-800 text-sm">Import Content</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Import your existing presentations or documents to use as source material.
        </p>

        {/* Import Area Container */}
        <div className="border border-dashed border-[#A5B4FC] bg-[#EEF2FF]/30 rounded-xl p-4 flex flex-col gap-4">
          
          {/* Two options */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Import Presentations */}
            <div className="bg-white rounded-lg border border-slate-100 p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-8 h-8 bg-[#EEF2FF] text-[#5A67D8] rounded flex items-center justify-center mb-3">
                <FileType2 className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 mb-2">Import Presentations</span>
              <p className="text-[9px] text-slate-400 mb-3">Upload PowerPoint files</p>
              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-medium border-[#A5B4FC] text-[#5A67D8] hover:bg-[#EEF2FF] transition-colors mb-2">
                <Upload className="w-3 h-3 mr-1.5" />
                Upload .pptx | .ppt
              </Button>
              <span className="text-[8px] text-slate-400">Supported: .pptx, .ppt (Max 50MB)</span>
            </div>

            {/* Import Documents */}
            <div className="bg-white rounded-lg border border-slate-100 p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-8 h-8 bg-[#FEF2F2] text-[#DC2626] rounded flex items-center justify-center mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 mb-2">Import Documents</span>
              <p className="text-[9px] text-slate-400 mb-3">Upload PDF or Word documents</p>
              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-medium border-[#A5B4FC] text-[#5A67D8] hover:bg-[#EEF2FF] transition-colors mb-2">
                <Upload className="w-3 h-3 mr-1.5" />
                Upload .pdf | .docx
              </Button>
              <span className="text-[8px] text-slate-400">Supported: .pdf, .docx (Max 50MB)</span>
            </div>
            
          </div>

          {/* Dropzone */}
          <div className="border border-dashed border-[#A5B4FC] rounded-lg py-3 flex items-center justify-center bg-white/50 cursor-pointer hover:bg-[#EEF2FF]/50 transition-colors">
            <span className="text-[10px] font-medium text-slate-400">
              Drag & drop files here or <span className="text-[#5A67D8] font-bold">click to browse</span>
            </span>
          </div>

          {/* Generate Button */}
          <Button className="w-full bg-[#5A67D8] hover:bg-[#4C51BF] text-white font-medium h-10 shadow-sm transition-colors text-xs">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Generate Presentation
          </Button>

        </div>

      </CardContent>
    </Card>
  );
}
