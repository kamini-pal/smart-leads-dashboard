import { useEffect } from 'react';
import useModalLock from '@/hooks/useModalLock';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import type { Lead, LeadFormData } from '@/types';

/**
 * Zod schema for lead form — validates name, email, status, source.
 */
const leadFormSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  status: z.enum(['new', 'contacted', 'qualified', 'lost'], {
    error: 'Please select a status',
  }),
  source: z.enum(['website', 'instagram', 'referral'], {
    error: 'Please select a source',
  }),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  lead?: Lead | null;  // If provided, we're editing
  isSubmitting: boolean;
}

/**
 * LeadFormModal — used for BOTH creating and editing leads.
 *
 * HOW IT KNOWS create vs edit:
 * - If `lead` prop is provided → edit mode (pre-fills the form)
 * - If `lead` is null/undefined → create mode (empty form)
 */
const LeadFormModal = ({ isOpen, onClose, onSubmit, lead, isSubmitting }: LeadFormModalProps) => {
  const isEditMode = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'new',
      source: 'website',
    },
  });

  // When modal opens or lead changes, reset form with correct values
  useEffect(() => {
    if (isOpen) {
      if (lead) {
        reset({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
      } else {
        reset({ name: '', email: '', status: 'new', source: 'website' });
      }
    }
  }, [isOpen, lead, reset]);

  useModalLock(isOpen, onClose, !isSubmitting);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: LeadFormValues) => {
    await onSubmit(data as LeadFormData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-form-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 id="lead-form-title" className="text-lg font-bold text-slate-900">
            {isEditMode ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="lead-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="lead-name"
              type="text"
              placeholder="Enter lead name"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 ${
                errors.name
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-primary-400 focus:ring-primary-100'
              }`}
              {...register('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="lead-email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="lead-email"
              type="email"
              placeholder="Enter email address"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 ${
                errors.email
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-primary-400 focus:ring-primary-100'
              }`}
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="lead-status" className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="lead-status"
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all duration-200 focus:ring-2 ${
                errors.status
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-primary-400 focus:ring-primary-100'
              }`}
              {...register('status')}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
            {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
          </div>

          {/* Source */}
          <div>
            <label htmlFor="lead-source" className="mb-1.5 block text-sm font-medium text-slate-700">
              Source
            </label>
            <select
              id="lead-source"
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all duration-200 focus:ring-2 ${
                errors.source
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-primary-400 focus:ring-primary-100'
              }`}
              {...register('source')}
            >
              <option value="website">Website</option>
              <option value="instagram">Instagram</option>
              <option value="referral">Referral</option>
            </select>
            {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-300 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Lead' : 'Create Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
