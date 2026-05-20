import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
    <div className="text-slate-300">
      {icon || <Inbox className="h-12 w-12" />}
    </div>
    <h3 className="mt-4 text-lg font-semibold text-slate-700">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
