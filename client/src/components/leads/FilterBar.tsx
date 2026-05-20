import { Search, SlidersHorizontal, Download, Plus, X } from 'lucide-react';
import type { LeadFilters } from '@/types';

interface FilterBarProps {
  filters: LeadFilters;
  onFilterChange: (filters: Partial<LeadFilters>) => void;
  onExport: () => void;
  onCreateNew: () => void;
  isExporting: boolean;
}

const FilterBar = ({ filters, onFilterChange, onExport, onCreateNew, isExporting }: FilterBarProps) => {
  const hasActiveFilters = filters.status || filters.source || filters.search;

  const clearFilters = () => {
    onFilterChange({ status: '', source: '', search: '', sort: 'latest', page: 1 });
  };

  return (
    <div className="space-y-4">
      {/* Top Row — Search + Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-300 hover:bg-primary-700 hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Bottom Row — Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <SlidersHorizontal className="h-4 w-4 text-slate-400" />

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: e.target.value as LeadFilters['status'], page: 1 })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all duration-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
        </select>

        {/* Source Filter */}
        <select
          value={filters.source || ''}
          onChange={(e) => onFilterChange({ source: e.target.value as LeadFilters['source'], page: 1 })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all duration-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        >
          <option value="">All Sources</option>
          <option value="website">Website</option>
          <option value="instagram">Instagram</option>
          <option value="referral">Referral</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sort || 'latest'}
          onChange={(e) => onFilterChange({ sort: e.target.value as LeadFilters['sort'] })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all duration-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
