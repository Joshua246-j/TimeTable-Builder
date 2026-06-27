import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot } from 'lexical';

interface WordCountPluginProps {
  onWordCount: (count: number) => void;
}

export function WordCountPlugin({ onWordCount }: WordCountPluginProps) {
  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const text = $getRoot().getTextContent();
          const words = text.split(/\s+/).filter(Boolean).length;
          onWordCount(words);
        });
      }}
    />
  );
}
