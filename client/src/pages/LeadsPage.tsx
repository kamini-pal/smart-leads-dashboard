import { Users } from 'lucide-react';

/**
 * Leads Page — placeholder for the leads table + filters.
 * Will be built fully in the next phase.
 */
const LeadsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and track your sales leads.
          </p>
        </div>
      </div>

      {/* Placeholder */}
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-card">
        <Users className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-semibold text-slate-700">Leads Table Coming Soon</h3>
        <p className="mt-2 text-sm text-slate-500">
          Filter, search, and manage leads from this page.
        </p>
      </div>
    </div>
  );
};

export default LeadsPage;
