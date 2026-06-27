import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from 'lexical';
import {
  $setBlocksType,
} from '@lexical/selection';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
} from '@lexical/rich-text';
import { Undo2, Redo2, ChevronDown, Type, Heading1, Heading2, Quote, List, ListOrdered } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatBlock = (blockType: string) => {
    if (blockType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      return;
    }
    if (blockType === 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      return;
    }

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (blockType === 'paragraph') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (blockType === 'h1') {
          $setBlocksType(selection, () => $createHeadingNode('h1'));
        } else if (blockType === 'h2') {
          $setBlocksType(selection, () => $createHeadingNode('h2'));
        } else if (blockType === 'quote') {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });
  };

  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 w-full">
      <div className="flex items-center gap-1.5 text-slate-600">
        
        {/* Block Format Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:bg-slate-50 px-2 py-1.5 rounded transition-colors text-slate-700 outline-none">
            Format
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-white z-[60] shadow-lg border border-slate-100">
            <DropdownMenuItem onClick={() => formatBlock('paragraph')} className="cursor-pointer hover:bg-slate-50 py-2">
              <Type className="w-4 h-4 mr-2 text-slate-400" /> Normal text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatBlock('h1')} className="cursor-pointer hover:bg-slate-50 py-2">
              <Heading1 className="w-4 h-4 mr-2 text-slate-400" /> Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatBlock('h2')} className="cursor-pointer hover:bg-slate-50 py-2">
              <Heading2 className="w-4 h-4 mr-2 text-slate-400" /> Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatBlock('bullet')} className="cursor-pointer hover:bg-slate-50 py-2">
              <List className="w-4 h-4 mr-2 text-slate-400" /> Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatBlock('number')} className="cursor-pointer hover:bg-slate-50 py-2">
              <ListOrdered className="w-4 h-4 mr-2 text-slate-400" /> Numbered List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatBlock('quote')} className="cursor-pointer hover:bg-slate-50 py-2">
              <Quote className="w-4 h-4 mr-2 text-slate-400" /> Quote
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
        
        {/* Text Format Buttons */}
        <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 font-bold px-2">B</button>
        <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 italic font-serif px-2">I</button>
        <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 underline px-2">U</button>
        <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-700 line-through px-2">S</button>
      </div>
      
      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <button onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
          <Undo2 className="w-4 h-4" />
        </button>
        <button onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
          <Redo2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
