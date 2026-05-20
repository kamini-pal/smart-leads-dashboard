import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  gradient: string;
}

const StatsCard = ({ title, value, icon: Icon, iconBg, gradient }: StatsCardProps) => (
  <div
    className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
  >
    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50 ${gradient}`} />
    <div className="relative flex items-center gap-4">
      <div className={`rounded-xl p-3 shadow-sm ${iconBg}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

export default StatsCard;
