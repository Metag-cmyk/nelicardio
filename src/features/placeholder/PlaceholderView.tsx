import { Construction, Compass } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/layout/PageHeader';
import { getNavItem } from '../../config/nav';
import type { RouteName } from '../../router/router';

const PHASE: Partial<Record<RouteName, string>> = {
  guidelines: 'Phase 1',
  coverage: 'Phase 2',
  study: 'Phase 5',
};

/** Placeholder for navigation destinations that are on the roadmap but not built. */
export function PlannedView({ name }: { name: RouteName }) {
  const item = getNavItem(name);

  return (
    <div className="space-y-6 md:space-y-12 pb-20">
      <PageHeader title={item?.label ?? 'Coming soon'} subtitle={item?.description ?? ''} badge="Planned" />
      <Card className="p-10 md:p-16 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Construction className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 mb-2">
          {item?.label ?? 'This section'} is on the roadmap
        </h3>
        <p className="prose-clinical mx-auto">
          Ships in {PHASE[name] ?? 'a later phase'} of the study-aid roadmap. See <span className="font-mono">SPEC.md</span> for the plan.
        </p>
      </Card>
    </div>
  );
}

export function NotFoundView({ path }: { path?: string }) {
  return (
    <div className="space-y-6 md:space-y-12 pb-20">
      <PageHeader title="Not found" subtitle="Unknown route" badge="404" />
      <Card className="p-10 md:p-16 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Compass className="w-8 h-8 text-slate-300" />
        </div>
        <p className="prose-clinical mx-auto">
          No view matches <span className="font-mono">{path ?? 'this path'}</span>. Use the navigation to continue.
        </p>
      </Card>
    </div>
  );
}
