import { ArrowRight, Lightbulb, Target, Clock, TrendingUp } from "lucide-react";
import { subjectService } from "@/services/subjectService";

const subjectConcepts: Record<string, string[]> = {
  "1": ["Arrays and Linked Lists", "Stacks and Queues", "Trees and Graphs", "Sorting and Searching", "Hashing and Dictionaries"],
  "2": ["Relational Model & Algebra", "SQL Queries & Joins", "Normalization (1NF-BCNF)", "Transaction Management", "Indexing & Hashing"],
  "3": ["SDLC Models (Agile, Waterfall)", "Requirement Analysis & Specs", "UML Modeling", "Software Design Patterns", "Testing & QA Methodologies"],
  "4": ["SDLC Models (Agile, Waterfall)", "Requirement Analysis & Specs", "UML Modeling", "Software Design Patterns", "Testing & QA Methodologies"],
  "5": ["OSI & TCP/IP Layer Stack", "Socket Programming", "IP Addressing & Subnetting", "Routing Algorithms", "Application Protocols (HTTP/DNS)"],
  "6": ["Search Algorithms (DFS, A*)", "Knowledge Representation", "Machine Learning Basics", "Neural Networks & Deep Learning", "Natural Language Processing"],
  "7": ["Linear Algebra & Matrices", "Probability Distributions", "Differential Equations", "Numerical Methods", "Fourier Analysis"],
  "8": ["Linear Algebra & Matrices", "Probability Distributions", "Differential Equations", "Numerical Methods", "Fourier Analysis"],
  "dslab": ["Data Structure Implementations", "Pointer Manipulation in C", "Memory Allocation", "Debugging & Profiling", "Time Complexity Analysis"],
  "mentoring": ["Career Guidance & Resume", "Soft Skills & Communication", "Ethics & Professional Values", "Stress Management", "Industry Expectations"],
};

const subjectOutcomes: Record<string, string[]> = {
  "1": ["Understand linear data structures", "Implement hierarchical structures", "Apply sorting/searching algorithms", "Analyze time/space complexity", "Solve real-world problems"],
  "2": ["Design relational databases", "Write complex SQL queries", "Normalize database schemas", "Manage transactions & concurrency", "Implement database indexing"],
  "3": ["Apply software engineering principles", "Draft software requirements specs", "Design object-oriented systems", "Coordinate team projects", "Perform system testing"],
  "4": ["Apply software engineering principles", "Draft software requirements specs", "Design object-oriented systems", "Coordinate team projects", "Perform system testing"],
  "5": ["Understand network protocols", "Analyze packet exchanges", "Configure IP subnets", "Build basic socket apps", "Explain routing mechanisms"],
  "6": ["Formulate AI search problems", "Represent logical knowledge", "Train basic ML models", "Build neural network layers", "Understand NLP tokenization"],
  "7": ["Solve systems of linear equations", "Calculate random variable metrics", "Model systems with differential eq.", "Implement approximation algorithms", "Apply Fourier transforms"],
  "8": ["Solve systems of linear equations", "Calculate random variable metrics", "Model systems with differential eq.", "Implement approximation algorithms", "Apply Fourier transforms"],
  "dslab": ["Code clean C/C++ structures", "Use debuggers (e.g. GDB)", "Track memory leaks", "Optimize algorithmic runtime", "Document programming experiments"],
  "mentoring": ["Identify career goals", "Improve presentation skills", "Understand workplace ethics", "Develop coping mechanisms", "Prepare for interviews"],
};

export async function AIInsights({ subjectId }: { subjectId?: string }) {
  const resolvedId = subjectId || "1";
  const subject = await subjectService.getSubjectById(resolvedId);

  if (!subject) return null;

  const concepts = subjectConcepts[subject.id] || [
    "Introduction to Topic",
    "Fundamental Theories",
    "Practical Case Studies",
    "Advanced Implementations",
    "Future Trends & Research"
  ];

  const outcomes = subjectOutcomes[subject.id] || [
    "Explain core principles",
    "Apply theories in practice",
    "Formulate solutions",
    "Evaluate trade-offs",
    "Design advanced frameworks"
  ];

  // Generate deterministic progress and activities based on subjectId/name
  const charSum = subject.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const syllabusCoverage = 50 + (charSum % 40); // 50% to 90%
  const conceptUnderstanding = 55 + (charSum % 35); // 55% to 90%
  const practiceProblems = 45 + (charSum % 45); // 45% to 90%
  const overallProgress = Math.round((syllabusCoverage + conceptUnderstanding + practiceProblems) / 3);

  const activities = [
    { title: `Lecture on ${concepts[2]}`, time: "2 hours ago" },
    { title: `Presentation: ${concepts[1]}`, time: "1 day ago" },
    { title: `Notes: ${concepts[3]}`, time: "2 days ago" },
    { title: `Lecture on ${concepts[0]}`, time: "3 days ago" },
    { title: `Quiz: ${concepts[1]} Review`, time: "4 days ago" },
  ];

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
            {concepts.map((concept, idx) => (
              <li key={idx}>{concept}</li>
            ))}
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
            {outcomes.map((outcome, idx) => (
              <li key={idx}>{outcome}</li>
            ))}
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
            {activities.map((activity, idx) => (
              <li key={idx} className="flex justify-between items-center gap-2">
                <span className="text-[#5A67D8] flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A67D8] flex-shrink-0"></span>
                  <span className="truncate">{activity.title}</span>
                </span>
                <span className="text-slate-400 text-[11px] whitespace-nowrap">{activity.time}</span>
              </li>
            ))}
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
                <span className="text-xs font-bold text-slate-900">{syllabusCoverage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#5A67D8] rounded-full" style={{ width: `${syllabusCoverage}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Concept Understanding</span>
                <span className="text-xs font-bold text-slate-900">{conceptUnderstanding}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#5A67D8] rounded-full" style={{ width: `${conceptUnderstanding}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Practice Problems</span>
                <span className="text-xs font-bold text-slate-900">{practiceProblems}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#5A67D8] rounded-full" style={{ width: `${practiceProblems}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Overall Progress</span>
                <span className="text-xs font-bold text-slate-900">{overallProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#5A67D8] rounded-full" style={{ width: `${overallProgress}%` }}></div>
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
