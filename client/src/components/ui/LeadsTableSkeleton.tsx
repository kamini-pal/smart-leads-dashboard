/**
 * LeadsTableSkeleton — placeholder while the leads list loads.
 */
const LeadsTableSkeleton = () => (
  <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading leads">
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
      <div className="h-10 w-full max-w-xs rounded-xl bg-slate-200" />
      <div className="flex gap-2">
        <div className="h-10 w-28 rounded-xl bg-slate-200" />
        <div className="h-10 w-28 rounded-xl bg-slate-200" />
      </div>
    </div>
    <div className="hidden rounded-2xl border border-slate-100 bg-white p-4 md:block">
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-slate-100" />
        ))}
      </div>
    </div>
    <div className="space-y-3 md:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 rounded-2xl bg-slate-200/80" />
      ))}
    </div>
  </div>
);

export default LeadsTableSkeleton;
