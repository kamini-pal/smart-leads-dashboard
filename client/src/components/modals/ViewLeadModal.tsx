import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import useModalLock from '@/hooks/useModalLock';
import type { Lead } from '@/types';
import { statusStyles, sourceStyles, statusLabels, sourceLabels, formatDate } from '@/utils/helpers';

interface ViewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const DetailRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
    <dt className="w-32 shrink-0 text-sm font-medium text-slate-500">{label}</dt>
    <dd className="min-w-0 flex-1 text-sm text-slate-900">{children}</dd>
  </div>
);

const emptyValue = <span className="text-slate-400">Not provided</span>;

/**
 * ViewLeadModal — read-only lead details (uses data already loaded in the list).
 */
const ViewLeadModal = ({ isOpen, onClose, lead }: ViewLeadModalProps) => {
  useModalLock(isOpen, onClose);

  if (!isOpen || !lead) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-lead-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="view-lead-title" className="text-lg font-bold text-slate-900">
            Lead Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className="space-y-4">
          <DetailRow label="Name">{lead.name}</DetailRow>
          <DetailRow label="Email">{lead.email}</DetailRow>
          <DetailRow label="Phone">{emptyValue}</DetailRow>
          <DetailRow label="Company">{emptyValue}</DetailRow>
          <DetailRow label="Status">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[lead.status]}`}
            >
              {statusLabels[lead.status]}
            </span>
          </DetailRow>
          <DetailRow label="Source">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${sourceStyles[lead.source]}`}
            >
              {sourceLabels[lead.source]}
            </span>
          </DetailRow>
          <DetailRow label="Created">{formatDate(lead.createdAt)}</DetailRow>
          <DetailRow label="Last updated">{formatDate(lead.updatedAt)}</DetailRow>
          <DetailRow label="Notes">{emptyValue}</DetailRow>
          {lead.createdBy && (
            <DetailRow label="Created by">
              <span>
                {lead.createdBy.name}
                <span className="text-slate-500"> ({lead.createdBy.email})</span>
              </span>
            </DetailRow>
          )}
        </dl>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLeadModal;
