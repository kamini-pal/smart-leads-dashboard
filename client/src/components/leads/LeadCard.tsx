import { Pencil, Trash2, Mail, Calendar } from 'lucide-react';
import type { Lead } from '@/types';
import { statusStyles, sourceStyles, statusLabels, sourceLabels, formatDate } from '@/utils/helpers';

interface LeadCardProps {
  lead: Lead;
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

/**
 * LeadCard — mobile card view for a single lead.
 * Shown on small screens, hidden on md+ where LeadTable takes over.
 */
const LeadCard = ({ lead, isAdmin, onEdit, onDelete }: LeadCardProps) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-300 hover:shadow-card-hover md:hidden">
    {/* Header — Name + Badges */}
    <div className="flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-900">{lead.name}</h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
      </div>
      <div className="ml-3 flex items-center gap-1">
        <button
          onClick={() => onEdit(lead)}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
        >
          <Pencil className="h-4 w-4" />
        </button>
        {isAdmin && (
          <button
            onClick={() => onDelete(lead)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>

    {/* Footer — Status, Source, Date */}
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[lead.status]}`}>
        {statusLabels[lead.status]}
      </span>
      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${sourceStyles[lead.source]}`}>
        {sourceLabels[lead.source]}
      </span>
      <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(lead.createdAt)}
      </span>
    </div>
  </div>
);

export default LeadCard;
