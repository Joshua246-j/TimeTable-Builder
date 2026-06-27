const editorTheme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'mb-2 leading-relaxed text-slate-700',
  quote: 'border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4 bg-slate-50 p-2 rounded-r',
  heading: {
    h1: 'text-3xl font-bold text-slate-900 mb-4 mt-6',
    h2: 'text-2xl font-bold text-slate-800 mb-3 mt-5',
    h3: 'text-xl font-bold text-slate-800 mb-3 mt-4',
    h4: 'text-lg font-bold text-slate-800 mb-2 mt-4',
    h5: 'text-base font-bold text-slate-800 mb-2 mt-4',
    h6: 'text-sm font-bold text-slate-800 mb-2 mt-4',
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal pl-6 mb-4 text-slate-700 space-y-1 marker:text-slate-500',
    ul: 'list-disc pl-6 mb-4 text-slate-700 space-y-1 marker:text-slate-500',
    listitem: 'pl-1',
    listitemChecked: 'line-through text-slate-400',
    listitemUnchecked: '',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    overflowed: 'overflow-hidden text-ellipsis',
    strikethrough: 'line-through',
    underline: 'underline',
    underlineStrikethrough: 'underline line-through',
  },
};

export default editorTheme;
