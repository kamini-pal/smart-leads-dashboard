import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  userName?: string;
}

/**
 * DashboardHeader — page title, greeting, and quick actions.
 */
const DashboardHeader = ({ userName }: DashboardHeaderProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        {userName
          ? `Welcome back, ${userName}. Here's your pipeline overview.`
          : 'Overview of your leads pipeline and performance.'}
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <Link
        to="/dashboard/leads"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 hover:bg-slate-50"
      >
        View all leads
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link
        to="/dashboard/leads"
        state={{ openCreate: true }}
        className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition-all duration-300 hover:bg-primary-700"
      >
        <Plus className="h-4 w-4" />
        Add lead
      </Link>
    </div>
  </div>
);

export default DashboardHeader;
