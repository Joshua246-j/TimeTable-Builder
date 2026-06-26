'use client';

import { FileText, ChevronDown, Undo2, Redo2, Sparkles, Download, List, ListOrdered } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, $getRoot } from 'lexical';
import { ListNode, ListItemNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { useState } from 'react';

const editorConfig = {
  namespace: 'LectureEditor',
  nodes: [ListNode, ListItemNode],
  onError(error: Error) {
    console.error(error);
  },
  theme: {
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
    },
    list: {
      ul: 'list-disc pl-5 my-2',
      ol: 'list-decimal pl-5 my-2',
      listitem: 'mb-1',
    },
  },
};

function EditorToolbar({ onWordCount }: { onWordCount: (count: number) => void }) {
  const [editor] = useLexicalComposerContext();
  const [blockName, setBlockName] = useState('Paragraph');

  const formatList = (type: 'ul' | 'ol') => {
    if (type === 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      setBlockName('Bullet List');
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      setBlockName('Numbered List');
    }
  };

  return (
    <>
      <OnChangePlugin onChange={(editorState) => {
        editorState.read(() => {
          const text = $getRoot().getTextContent();
          const words = text.split(/\s+/).filter(Boolean).length;
          onWordCount(words);
        });
      }} />
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-1.5 text-slate-600">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium hover:bg-slate-50 px-2 py-1.5 rounded transition-colors text-slate-700">
                {blockName}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[160px]">
              <DropdownMenuItem onClick={() => setBlockName('Paragraph')}>
                Paragraph
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => formatList('ul')}>
                <List className="w-4 h-4 mr-2 text-slate-500" />
                Bullet List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => formatList('ol')}>
                <ListOrdered className="w-4 h-4 mr-2 text-slate-500" />
                Numbered List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
          
          <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 font-bold px-2">B</button>
          <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 italic font-serif px-2">I</button>
          <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 underline px-2">U</button>
          <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 line-through px-2">S</button>
          
          <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

export function LectureEditorCard() {
  const [wordCount, setWordCount] = useState(0);
  return (
    <LexicalComposer initialConfig={editorConfig}>
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
          <EditorToolbar onWordCount={setWordCount} />

          {/* Editor Content Area */}
          <div className="flex-1 relative pb-6">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="outline-none text-slate-600 text-[15px] leading-relaxed min-h-[200px] cursor-text" />
              }
              placeholder={
                <div className="absolute top-0 left-0 text-slate-400 text-[15px] pointer-events-none">
                  Start typing your lecture points...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ListPlugin />
            <div className="absolute bottom-0 right-0 text-[11px] font-medium text-slate-400">
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
    </LexicalComposer>
  );
}
