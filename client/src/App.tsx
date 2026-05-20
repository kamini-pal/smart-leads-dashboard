import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardHome from '@/pages/DashboardHome';
import LeadsPage from '@/pages/LeadsPage';
import NotFound from '@/pages/NotFound';

/**
 * App — the root component.
 *
 * ROUTING STRUCTURE:
 * ┌──────────────────────────────────────────────────┐
 * │ /login              → LoginPage (public)         │
 * │ /register           → RegisterPage (public)      │
 * │                                                  │
 * │ /dashboard          → ProtectedRoute             │
 * │   ├── /             → DashboardHome              │
 * │   └── /leads        → LeadsPage                  │
 * │                                                  │
 * │ /                   → Redirect to /dashboard     │
 * │ *                   → 404 NotFound               │
 * └──────────────────────────────────────────────────┘
 *
 * HOW NESTED ROUTING WORKS:
 * /dashboard uses DashboardLayout as the parent.
 * DashboardLayout renders <Outlet /> where child routes appear.
 * So /dashboard/leads renders DashboardLayout + LeadsPage inside it.
 */
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes — wrapped in DashboardLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/dashboard/leads" element={<LeadsPage />} />
            </Route>
          </Route>

          {/* Redirects & Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      {/* Toast notifications — positioned globally */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#f8fafc',
            fontSize: '14px',
          },
        }}
      />
    </AuthProvider>
  );
};

export default App;
