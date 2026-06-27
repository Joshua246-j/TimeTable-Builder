import type { Klass, LexicalNode } from 'lexical';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';

export const editorNodes: Array<Klass<LexicalNode>> = [
  ListNode,
  ListItemNode,
  HeadingNode,
  QuoteNode,
];
