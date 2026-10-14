import { ImageOff } from 'lucide-react';
import { EcgStrip } from './EcgStrip';
import { Schematic } from './Schematic';
import { Card } from '../ui/Card';
import type { Figure } from '../../data/figures';
import { cn } from '../../lib/utils';

/**
 * Renders a figure from the atlas: a built-in SVG schematic or a supplied
 * licensed image. Captions are explicit that schematics are illustrative.
 */
export function FigureCard({ figure, className }: { figure: Figure; className?: string }) {
  return (
    <Card className={cn('overflow-hidden border-2 border-slate-100 rounded-2xl bg-white', className)}>
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
        <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800">{figure.title}</h5>
        {figure.illustrative && (
          <span className="text-[8px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 shrink-0">
            Illustrative
          </span>
        )}
      </div>
      <div className="p-3">
        {figure.kind === 'ecg' && figure.ecgPattern ? (
          <EcgStrip pattern={figure.ecgPattern} />
        ) : figure.kind === 'schematic' && figure.schematicId ? (
          <Schematic id={figure.schematicId} />
        ) : figure.imagePath ? (
          <img src={figure.imagePath} alt={figure.title} className="w-full rounded-xl" loading="lazy" />
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-slate-300 gap-2">
            <ImageOff className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-wider">Asset pending</span>
          </div>
        )}
      </div>
      <div className="px-4 pb-4 space-y-1">
        <p className="text-[11px] font-black text-medical-accent uppercase tracking-wider">{figure.finding}</p>
        <p className="prose-clinical text-[13px]">{figure.description}</p>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 pt-1">{figure.source}</p>
      </div>
    </Card>
  );
}
