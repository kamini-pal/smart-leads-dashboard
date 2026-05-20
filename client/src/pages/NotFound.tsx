import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

/**
 * 404 Page — shown when the user visits a URL that doesn't exist.
 */
const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary p-4">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-amber-400" />
        <h1 className="mt-6 text-6xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-lg text-slate-600">Page not found</p>
        <p className="mt-2 text-sm text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary-600/25 transition-all duration-300 hover:bg-primary-700 hover:-translate-y-0.5"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
