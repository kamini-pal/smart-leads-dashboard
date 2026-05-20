/**
 * DashboardSkeleton — placeholder layout while dashboard stats load.
 */
const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-8" aria-busy="true" aria-label="Loading dashboard">
    <div className="space-y-2">
      <div className="h-8 w-48 rounded-lg bg-slate-200" />
      <div className="h-4 w-72 max-w-full rounded-lg bg-slate-200" />
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-slate-200/80" />
      ))}
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="h-72 rounded-xl bg-slate-200/80" />
      <div className="h-72 rounded-xl bg-slate-200/80" />
    </div>

    <div className="h-80 rounded-xl bg-slate-200/80" />
  </div>
);

export default DashboardSkeleton;
