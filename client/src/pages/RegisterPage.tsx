import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, Loader2, LayoutDashboard } from 'lucide-react';
import { authService } from '@/services/authService';
import { registerSchema, type RegisterFormData } from '@/utils/validations';
import type { AxiosError } from 'axios';

/**
 * Register Page — creates a new user account.
 *
 * FLOW:
 * 1. User fills name, email, password, role
 * 2. Zod validates all fields
 * 3. authService.register() sends POST /api/auth/register
 * 4. On success → toast "Account created!" → redirect to /login
 * 5. On error → toast with error message
 *
 * WHY redirect to login instead of auto-login?
 * Professional apps usually ask users to verify their email first.
 * Even though we don't have email verification, this pattern is
 * standard and recruiter-friendly.
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', role: 'sales' },
  });

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      await authService.register(formData);
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Branding */}
      <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 lg:flex">
        <div className="max-w-md px-8 text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">SmartLeads</h1>
          <p className="mt-4 text-lg text-primary-100">
            Start managing your leads with a powerful, intuitive dashboard.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-primary-200">
            <span>✓ Role-Based Access</span>
            <span>✓ Real-Time Data</span>
            <span>✓ CSV Export</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div className="flex w-full items-center justify-center bg-surface-secondary p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SmartLeads</span>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-card">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
              <p className="mt-2 text-sm text-slate-500">
                Fill in the details to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-slate-200 focus:border-primary-400 focus:ring-primary-100'
                  }`}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-slate-200 focus:border-primary-400 focus:ring-primary-100'
                  }`}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-primary-400 focus:ring-primary-100'
                    }`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Role
                </label>
                <select
                  id="role"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 transition-all duration-200 outline-none focus:ring-2 ${
                    errors.role
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-slate-200 focus:border-primary-400 focus:ring-primary-100'
                  }`}
                  {...register('role')}
                >
                  <option value="sales">Sales User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.role.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-300 hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-600/30 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
