import { Grid, List, ExternalLink, Edit2, Play, Download, Copy, Trash2 } from 'lucide-react';

import { PresentationLibraryCard, PresentationData } from './PresentationLibraryCard';

const MOCK_PRESENTATIONS: PresentationData[] = [
  {
    id: '1',
    title: 'AVL Trees Introduction',
    created: 'Oct 24, 2025',
    slides: 18,
    lastModified: 'Oct 24, 2025',
    sourceLecture: 'AVL Trees & Balancing',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    icon: 'file'
  },
  {
    id: '2',
    title: 'Data Structures Revision',
    created: 'Oct 22, 2025',
    slides: 15,
    lastModified: 'Oct 23, 2025',
    sourceLecture: 'Data Structures Overview',
    color: '#5A67D8',
    bgColor: '#EEF2FF',
    icon: 'flask'
  },
  {
    id: '3',
    title: 'Binary Search Trees',
    created: 'Oct 20, 2025',
    slides: 12,
    lastModified: 'Oct 21, 2025',
    sourceLecture: 'BST Operations',
    color: '#10B981',
    bgColor: '#ECFDF5',
    icon: 'book'
  },
  {
    id: '4',
    title: 'Graph Algorithms',
    created: 'Oct 18, 2025',
    slides: 24,
    lastModified: 'Oct 21, 2025',
    sourceLecture: 'Graph Traversals',
    color: '#5A67D8',
    bgColor: '#EEF2FF',
    icon: 'layers'
  }
];

export function PresentationLibrary() {
  return (
    <div className="mb-6 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className="font-semibold text-slate-800 text-lg">Presentation Library</h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage and reuse your previously generated presentations.</p>
        </div>
        
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-1 shadow-sm">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF2FF] text-[#5A67D8] rounded text-xs font-semibold">
            <Grid className="w-3.5 h-3.5" />
            Grid View
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-slate-700 rounded text-xs font-semibold transition-colors">
            <List className="w-3.5 h-3.5" />
            List View
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {MOCK_PRESENTATIONS.map(pres => (
          <PresentationLibraryCard key={pres.id} data={pres} />
        ))}
      </div>

      {/* Bottom Action Bar (Legend) */}
      <div className="flex items-center justify-center gap-8 py-4 border-t border-slate-200">
        <div className="flex items-center gap-2 cursor-pointer group">
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">Open</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer group">
          <Edit2 className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">Continue Editing</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer group">
          <Play className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">Present</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer group">
          <Download className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">Download</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer group">
          <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">Duplicate</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer group">
          <Trash2 className="w-4 h-4 text-[#DC2626] group-hover:text-[#B91C1C] transition-colors" />
          <span className="text-xs font-semibold text-[#DC2626] group-hover:text-[#B91C1C] transition-colors">Delete</span>
        </div>
      </div>

    </div>
  );
}
