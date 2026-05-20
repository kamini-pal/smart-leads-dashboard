import api from './api';
import type { Lead, LeadFormData, LeadFilters, ApiResponse, PaginatedResponse } from '@/types';

/**
 * Lead Service — all lead-related API calls.
 *
 * DATA FLOW:
 * Component → leadService → Axios Instance → Backend API
 *    UI          fetch()       JWT header       Express
 */
export const leadService = {
  /** Fetch leads with filters, search, sort, and pagination */
  getLeads: async (filters: LeadFilters = {}): Promise<PaginatedResponse<Lead>> => {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const { data } = await api.get<PaginatedResponse<Lead>>(`/leads?${params.toString()}`);
    return data;
  },

  /** Get a single lead by ID */
  getLead: async (id: string): Promise<ApiResponse<Lead>> => {
    const { data } = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data;
  },

  /** Create a new lead */
  createLead: async (leadData: LeadFormData): Promise<ApiResponse<Lead>> => {
    const { data } = await api.post<ApiResponse<Lead>>('/leads', leadData);
    return data;
  },

  /** Update an existing lead */
  updateLead: async (id: string, leadData: Partial<LeadFormData>): Promise<ApiResponse<Lead>> => {
    const { data } = await api.put<ApiResponse<Lead>>(`/leads/${id}`, leadData);
    return data;
  },

  /** Delete a lead (admin only) */
  deleteLead: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return data;
  },

  /** Export leads as CSV (respects current filters) */
  exportCsv: async (filters: LeadFilters = {}): Promise<void> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);

    const { data } = await api.get(`/leads/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });

    // Trigger browser download
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leads-export.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  },
};
