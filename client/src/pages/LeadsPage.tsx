import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { leadService } from '@/services/leadService';
import useDebounce from '@/hooks/useDebounce';
import FilterBar from '@/components/leads/FilterBar';
import LeadTable from '@/components/leads/LeadTable';
import LeadCard from '@/components/leads/LeadCard';
import LeadFormModal from '@/components/modals/LeadFormModal';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import LeadsTableSkeleton from '@/components/ui/LeadsTableSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import type { Lead, LeadFormData, LeadFilters, PaginationMeta } from '@/types';

/**
 * LeadsPage — the main dashboard page that orchestrates everything.
 *
 * STATE MANAGEMENT:
 * ┌──────────────────────────────────────────────────┐
 * │ leads[]        ← fetched from API                │
 * │ filters{}      ← status, source, search, sort    │
 * │ pagination{}   ← page, total, hasNext, hasPrev   │
 * │ isLoading      ← shows spinner during fetch      │
 * │ modalState     ← which modal is open + data      │
 * └──────────────────────────────────────────────────┘
 *
 * DATA FLOW:
 * FilterBar changes → filters update → debounced search triggers
 * → API called → leads + pagination updated → table re-renders
 */
const LeadsPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  // ── Data State ──
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // ── Filter State ──
  const [filters, setFilters] = useState<LeadFilters>({
    status: '', source: '', search: '', sort: 'latest', page: 1, limit: 10,
  });

  // Debounce the search input (wait 500ms after user stops typing)
  const debouncedSearch = useDebounce(filters.search || '', 500);

  // ── Modal State ──
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // ── Fetch Leads ──
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await leadService.getLeads({
        ...filters,
        search: debouncedSearch, // Use debounced value, not raw input
      });
      setLeads(response.data);
      setPagination(response.pagination);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.source, filters.sort, filters.page, filters.limit, debouncedSearch]);

  // Re-fetch when filters or debounced search changes
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Open create modal when navigated from dashboard "Add lead"
  useEffect(() => {
    const state = location.state as { openCreate?: boolean } | null;
    if (state?.openCreate) {
      setSelectedLead(null);
      setIsFormModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // ── Filter Handlers ──
  const handleFilterChange = (newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // ── Create Lead ──
  const handleCreateLead = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      await leadService.createLead(data);
      toast.success('Lead created successfully!');
      setIsFormModalOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch {
      toast.error('Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Edit Lead ──
  const handleEditLead = async (data: LeadFormData) => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    try {
      await leadService.updateLead(selectedLead._id, data);
      toast.success('Lead updated successfully!');
      setIsFormModalOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch {
      toast.error('Failed to update lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete Lead ──
  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    setIsDeleting(true);
    try {
      await leadService.deleteLead(selectedLead._id);
      toast.success('Lead deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch {
      toast.error('Failed to delete lead');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── CSV Export ──
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await leadService.exportCsv(filters);
      toast.success('CSV exported successfully!');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Modal Openers ──
  const openCreateModal = () => {
    setSelectedLead(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage and track your sales leads.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        onCreateNew={openCreateModal}
        isExporting={isExporting}
      />

      {/* Content Area */}
      {isLoading ? (
        <LeadsTableSkeleton />
      ) : leads.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="No leads found"
          description={
            filters.search || filters.status || filters.source
              ? 'Try adjusting your filters or search query.'
              : 'Get started by adding your first lead.'
          }
          action={
            !filters.search && !filters.status && !filters.source ? (
              <button
                onClick={openCreateModal}
                className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-300 hover:bg-primary-700"
              >
                Add Your First Lead
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Desktop Table */}
          <LeadTable
            leads={leads}
            isAdmin={isAdmin}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                isAdmin={isAdmin}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}

      {/* Modals */}
      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setSelectedLead(null); }}
        onSubmit={selectedLead ? handleEditLead : handleCreateLead}
        lead={selectedLead}
        isSubmitting={isSubmitting}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedLead(null); }}
        onConfirm={handleDeleteLead}
        lead={selectedLead}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default LeadsPage;
