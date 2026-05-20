import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  Users,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { leadService } from '@/services/leadService';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentLeads from '@/components/dashboard/RecentLeads';
import LeadsBySource from '@/components/dashboard/LeadsBySource';
import ActivityOverview from '@/components/dashboard/ActivityOverview';
import DashboardSkeleton from '@/components/ui/DashboardSkeleton';
import type { DashboardStats } from '@/types';

const statCards = [
  {
    title: 'Total Leads',
    key: 'total' as const,
    icon: Users,
    iconBg: 'bg-primary-100 text-primary-600',
    gradient: 'from-primary-50 to-white',
  },
  {
    title: 'New Leads',
    key: 'new' as const,
    icon: Sparkles,
    iconBg: 'bg-blue-100 text-blue-600',
    gradient: 'from-blue-50 to-white',
  },
  {
    title: 'Contacted Leads',
    key: 'contacted' as const,
    icon: MessageCircle,
    iconBg: 'bg-amber-100 text-amber-600',
    gradient: 'from-amber-50 to-white',
  },
  {
    title: 'Qualified Leads',
    key: 'qualified' as const,
    icon: CheckCircle2,
    iconBg: 'bg-emerald-100 text-emerald-600',
    gradient: 'from-emerald-50 to-white',
  },
  {
    title: 'Lost Leads',
    key: 'lost' as const,
    icon: XCircle,
    iconBg: 'bg-red-100 text-red-600',
    gradient: 'from-red-50 to-white',
  },
] as const;

const getStatValue = (stats: DashboardStats, key: (typeof statCards)[number]['key']): number => {
  if (key === 'total') return stats.total;
  return stats.byStatus[key];
};

/**
 * DashboardHome — analytics overview with stats, recent leads, and summaries.
 */
const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const response = await leadService.getStats();
      setStats(response.data);
    } catch {
      setLoadError(true);
      setStats(null);
      toast.error('Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (loadError || !stats) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-8 text-center shadow-md">
        <p className="text-sm text-slate-500">Unable to load dashboard data.</p>
        <button
          type="button"
          onClick={fetchStats}
          className="mt-4 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader userName={user?.name} />

      {/* Stats Grid — 1 col mobile, 2 col tablet, 5 col desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => (
          <StatsCard
            key={card.key}
            title={card.title}
            value={getStatValue(stats, card.key)}
            icon={card.icon}
            iconBg={card.iconBg}
            gradient={card.gradient}
          />
        ))}
      </div>

      {/* Secondary sections — stack on mobile, 2 columns on large screens */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentLeads leads={stats.recentLeads} />
        <LeadsBySource bySource={stats.bySource} total={stats.total} />
      </div>

      <ActivityOverview byStatus={stats.byStatus} total={stats.total} />
    </div>
  );
};

export default DashboardHome;
