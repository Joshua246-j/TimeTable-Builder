import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import editorTheme from './theme';
import { editorNodes } from './nodes';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import { WordCountPlugin } from './plugins/WordCountPlugin';

interface LectureEditorProps {
  onWordCount: (count: number) => void;
}

export function LectureEditor({ onWordCount }: LectureEditorProps) {
  const initialConfig = {
    namespace: 'LectureEditor',
    theme: editorTheme,
    nodes: editorNodes,
    onError(error: Error) {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <ToolbarPlugin />

        {/* Editor Content Area */}
        <div className="flex-1 relative pb-6">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none text-[15px] min-h-[200px] cursor-text" />
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
          <WordCountPlugin onWordCount={onWordCount} />
        </div>
      </div>
    </LexicalComposer>
  );
}
