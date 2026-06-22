import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoCard } from '@/components/shared';

export function GeneratedOverviewCard() {
  return (
    <InfoCard
      title="Generated overview"
      subtitle="AI-generated overview based on your lecture points."
      icon={<Sparkles className="w-5 h-5" />}
      headerAction={
        <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors h-8">
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          Regenerate
        </Button>
      }
    >
      <div className="text-sm text-slate-600 leading-relaxed">
        <p>
          The lecture introduced AVL Trees and balancing operations. Students learned how AVL Trees maintain balance using rotations and how the balance factor determines the structure of the tree. The lecture also covered left and right rotations with examples, time complexity of operations, and real-world applications of AVL Trees in systems requiring fast search, insertion, and deletion.
        </p>
      </div>
    </InfoCard>
  );
}
