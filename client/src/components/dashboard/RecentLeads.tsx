import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import type { Lead } from '@/types';
import { statusStyles, statusLabels, formatDate } from '@/utils/helpers';

interface RecentLeadsProps {
  leads: Lead[];
}

/**
 * RecentLeads — compact list of the latest leads.
 */
const RecentLeads = ({ leads }: RecentLeadsProps) => (
  <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-md">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
        <p className="mt-0.5 text-sm text-slate-500">Latest additions to your pipeline</p>
      </div>
      <Link
        to="/dashboard/leads"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
      >
        View all
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>

    {leads.length === 0 ? (
      <div className="flex flex-col items-center py-8 text-center">
        <Users className="h-10 w-10 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-600">No leads yet</p>
        <p className="mt-1 text-xs text-slate-500">Create your first lead to see it here.</p>
      </div>
    ) : (
      <ul className="divide-y divide-slate-100">
        {leads.map((lead) => (
          <li
            key={lead._id}
            className="flex items-center justify-between gap-4 py-3.5 transition-colors duration-200 first:pt-0 last:pb-0 hover:bg-slate-50/50"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{lead.name}</p>
              <p className="truncate text-xs text-slate-500">{lead.email}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[lead.status]}`}
              >
                {statusLabels[lead.status]}
              </span>
              <span className="text-xs text-slate-400">{formatDate(lead.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RecentLeads;
