import { Activity, CheckCircle2, MessageCircle, Sparkles, XCircle } from 'lucide-react';
import type { LeadStatusCounts } from '@/types';

interface ActivityOverviewProps {
  byStatus: LeadStatusCounts;
  total: number;
}

const activityItems = [
  {
    key: 'new' as const,
    label: 'New leads awaiting contact',
    icon: Sparkles,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    key: 'contacted' as const,
    label: 'Leads in follow-up',
    icon: MessageCircle,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    key: 'qualified' as const,
    label: 'Qualified opportunities',
    icon: CheckCircle2,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    key: 'lost' as const,
    label: 'Closed / lost leads',
    icon: XCircle,
    color: 'text-red-600 bg-red-50',
  },
];

/**
 * ActivityOverview — lightweight pipeline activity summary.
 */
const ActivityOverview = ({ byStatus, total }: ActivityOverviewProps) => {
  const activePipeline = byStatus.new + byStatus.contacted + byStatus.qualified;
  const conversionRate = total > 0 ? Math.round((byStatus.qualified / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-md">
      <div className="mb-5 flex items-center gap-2">
        <div className="rounded-lg bg-primary-50 p-2">
          <Activity className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Pipeline Activity</h2>
          <p className="text-sm text-slate-500">Quick snapshot of your sales funnel</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Active pipeline</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{activePipeline}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Qualified rate</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{conversionRate}%</p>
        </div>
      </div>

      <ul className="space-y-3">
        {activityItems.map(({ key, label, icon: Icon, color }) => (
          <li
            key={key}
            className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 transition-all duration-300 hover:border-slate-200 hover:bg-slate-50/50"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm text-slate-600">{label}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">{byStatus[key]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityOverview;
