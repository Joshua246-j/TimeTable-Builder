import { ArrowRight, Lightbulb, Target, Clock, TrendingUp } from "lucide-react";

export function AIInsights() {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4">AI Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Key Concepts Covered */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5A67D8]/10 text-[#5A67D8]">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Key Concepts Covered</h4>
          </div>
          
          <ul className="flex flex-col gap-4 flex-grow mb-6 text-[13px] text-slate-500 font-medium">
            <li>Arrays and Linked Lists</li>
            <li>Stacks and Queues</li>
            <li>Trees and Graphs</li>
            <li>Sorting and Searching</li>
            <li>Hashing and Dictionaries</li>
          </ul>
          
          <button className="text-[13px] font-bold text-[#5A67D8] flex items-center gap-1 hover:gap-2 transition-all mt-auto w-fit">
            View All Concepts
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Learning Outcomes */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5A67D8]/10 text-[#5A67D8]">
              <Target className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Learning Outcomes</h4>
          </div>
          
          <ul className="flex flex-col gap-4 flex-grow mb-6 text-[13px] text-slate-500 font-medium">
            <li>Understand linear data structures</li>
            <li>Implement hierarchical structures</li>
            <li>Apply sorting and searching algorithms</li>
            <li>Analyze time and space complexity</li>
            <li>Solve real-world problems</li>
          </ul>
          
          <button className="text-[13px] font-bold text-[#5A67D8] flex items-center gap-1 hover:gap-2 transition-all mt-auto w-fit">
            View Learning Outcomes
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Recent Academic Activity */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5A67D8]/10 text-[#5A67D8]">
              <Clock className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Recent Academic Activity</h4>
          </div>
          
          <ul className="flex flex-col gap-4 flex-grow mb-6 text-[13px] font-medium">
            <li className="flex justify-between items-center gap-2">
              <span className="text-[#5A67D8] flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A67D8] flex-shrink-0"></span>
                <span className="truncate">Lecture on Graph Traversal</span>
              </span>
              <span className="text-slate-400 text-[11px] whitespace-nowrap">2 hours ago</span>
            </li>
            <li className="flex justify-between items-center gap-2">
              <span className="text-[#5A67D8] flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A67D8] flex-shrink-0"></span>
                <span className="truncate">Presentation: Binary Trees</span>
              </span>
              <span className="text-slate-400 text-[11px] whitespace-nowrap">1 day ago</span>
            </li>
            <li className="flex justify-between items-center gap-2">
              <span className="text-[#5A67D8] flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A67D8] flex-shrink-0"></span>
                <span className="truncate">Notes: Hash Tables</span>
              </span>
              <span className="text-slate-400 text-[11px] whitespace-nowrap">2 days ago</span>
            </li>
            <li className="flex justify-between items-center gap-2">
              <span className="text-[#5A67D8] flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A67D8] flex-shrink-0"></span>
                <span className="truncate">Lecture on Sorting Algorithms</span>
              </span>
              <span className="text-slate-400 text-[11px] whitespace-nowrap">3 days ago</span>
            </li>
            <li className="flex justify-between items-center gap-2">
              <span className="text-[#5A67D8] flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A67D8] flex-shrink-0"></span>
                <span className="truncate">Presentation: Dynamic Programming</span>
              </span>
              <span className="text-slate-400 text-[11px] whitespace-nowrap">4 days ago</span>
            </li>
          </ul>
          
          <button className="text-[13px] font-bold text-[#5A67D8] flex items-center gap-1 hover:gap-2 transition-all mt-auto w-fit">
            View All Activity
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Progress Indicators</h4>
          </div>
          
          <div className="flex flex-col gap-5 flex-grow mb-6">
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Syllabus Coverage</span>
                <span className="text-xs font-bold text-slate-900">72%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#5A67D8] rounded-full" style={{ width: "72%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Concept Understanding</span>
                <span className="text-xs font-bold text-slate-900">68%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#5A67D8] rounded-full" style={{ width: "68%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Practice Problems</span>
                <span className="text-xs font-bold text-slate-900">75%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#5A67D8] rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Overall Progress</span>
                <span className="text-xs font-bold text-slate-900">70%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#5A67D8] rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>

          </div>
          
          <button className="text-[13px] font-bold text-[#5A67D8] flex items-center gap-1 hover:gap-2 transition-all mt-auto w-fit">
            View Detailed Progress
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
