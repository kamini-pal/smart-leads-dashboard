import { AlertTriangle, Loader2, X } from 'lucide-react';
import useModalLock from '@/hooks/useModalLock';
import type { Lead } from '@/types';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  lead: Lead | null;
  isDeleting: boolean;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, lead, isDeleting }: ConfirmDeleteModalProps) => {
  useModalLock(isOpen, onClose, !isDeleting);

  if (!isOpen || !lead) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-lead-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isDeleting && onClose()}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 id="delete-lead-title" className="mt-4 text-lg font-bold text-slate-900">Delete Lead</h3>
          <p className="mt-2 text-sm text-slate-500">
            Are you sure you want to delete <span className="font-medium text-slate-700">{lead.name}</span>?
            This action cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all duration-300 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
