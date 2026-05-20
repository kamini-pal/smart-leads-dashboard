import type { LeadStatus, LeadSource } from '@/types';

/** Color maps for status and source badges */
export const statusStyles: Record<LeadStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  qualified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  lost: 'bg-red-50 text-red-700 border-red-200',
};

export const sourceStyles: Record<LeadSource, string> = {
  website: 'bg-violet-50 text-violet-700 border-violet-200',
  instagram: 'bg-pink-50 text-pink-700 border-pink-200',
  referral: 'bg-teal-50 text-teal-700 border-teal-200',
};

export const statusLabels: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  lost: 'Lost',
};

export const sourceLabels: Record<LeadSource, string> = {
  website: 'Website',
  instagram: 'Instagram',
  referral: 'Referral',
};

/** Format ISO date string to readable format */
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
