import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { Lead } from '@/types';
import { statusStyles, sourceStyles, statusLabels, sourceLabels, formatDate } from '@/utils/helpers';

interface LeadTableProps {
  leads: Lead[];
  isAdmin: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

/**
 * LeadTable — desktop table view for leads.
 * Hidden on mobile, replaced by LeadCard.
 */
const LeadTable = ({ leads, isAdmin, onView, onEdit, onDelete }: LeadTableProps) => (
  <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card md:block">
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-100 bg-slate-50/50">
          <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
          <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
          <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
          <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Source</th>
          <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Created</th>
          <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {leads.map((lead) => (
          <tr key={lead._id} className="transition-colors duration-150 hover:bg-slate-50/50">
            <td className="px-6 py-4">
              <p className="text-sm font-medium text-slate-900">{lead.name}</p>
            </td>
            <td className="px-6 py-4">
              <p className="text-sm text-slate-600">{lead.email}</p>
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[lead.status]}`}>
                {statusLabels[lead.status]}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${sourceStyles[lead.source]}`}>
                {sourceLabels[lead.source]}
              </span>
            </td>
            <td className="px-6 py-4">
              <p className="text-sm text-slate-500">{formatDate(lead.createdAt)}</p>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => onView(lead)}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  title="View lead"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(lead)}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                  title="Edit lead"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(lead)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete lead"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LeadTable;
