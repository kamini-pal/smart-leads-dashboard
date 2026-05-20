import type { LeadSourceCounts } from '@/types';
import { sourceLabels } from '@/utils/helpers';

interface LeadsBySourceProps {
  bySource: LeadSourceCounts;
  total: number;
}

const sourceConfig: {
  key: keyof LeadSourceCounts;
  bar: string;
  dot: string;
}[] = [
  { key: 'website', bar: 'bg-violet-500', dot: 'bg-violet-500' },
  { key: 'instagram', bar: 'bg-pink-500', dot: 'bg-pink-500' },
  { key: 'referral', bar: 'bg-teal-500', dot: 'bg-teal-500' },
];

/**
 * LeadsBySource — simple bar summary by lead source.
 */
const LeadsBySource = ({ bySource, total }: LeadsBySourceProps) => (
  <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-md">
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-slate-900">Leads by Source</h2>
      <p className="mt-0.5 text-sm text-slate-500">Where your leads are coming from</p>
    </div>

    <div className="space-y-4">
      {sourceConfig.map(({ key, bar, dot }) => {
        const count = bySource[key];
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <div key={key}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                {sourceLabels[key]}
              </span>
              <span className="text-slate-500">
                {count} <span className="text-slate-400">({percent}%)</span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${bar}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default LeadsBySource;
