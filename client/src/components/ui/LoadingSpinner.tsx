import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
    <p className="mt-3 text-sm text-slate-500">{message}</p>
  </div>
);

export default LoadingSpinner;
