import { LayoutDashboard, Users, TrendingUp, UserCheck } from 'lucide-react';

/**
 * Dashboard Home Page — overview with stats cards.
 * This is a placeholder that will be filled with real data later.
 */

const stats = [
  { name: 'Total Leads', value: '—', icon: Users, color: 'bg-primary-100 text-primary-600' },
  { name: 'New Leads', value: '—', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Qualified', value: '—', icon: UserCheck, color: 'bg-amber-100 text-amber-600' },
  { name: 'Conversion', value: '—', icon: LayoutDashboard, color: 'bg-violet-100 text-violet-600' },
];

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your leads pipeline and performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Content */}
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-card">
        <LayoutDashboard className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-semibold text-slate-700">Dashboard Coming Soon</h3>
        <p className="mt-2 text-sm text-slate-500">
          Charts, analytics, and lead insights will appear here.
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
