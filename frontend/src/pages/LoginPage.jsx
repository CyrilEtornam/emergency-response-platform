import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

const ROLE_ROUTES = {
  SUPER_ADMIN: '/admin/overview',
  HOSPITAL_ADMIN: '/dashboard',
  POLICE_ADMIN: '/dashboard',
  FIRE_ADMIN: '/dashboard',
};

const DEMO_CREDENTIALS = [
  { label: 'Super Admin',   email: 'admin@ghanaers.gov.gh',    password: 'Admin@1234',    color: '#6366F1' },
  { label: 'Hospital',      email: 'hospital@ghanaers.gov.gh', password: 'Hospital@1234', color: '#2563EB' },
  { label: 'Police',        email: 'police@ghanaers.gov.gh',   password: 'Police@1234',   color: '#D97706' },
  { label: 'Fire',          email: 'fire@ghanaers.gov.gh',     password: 'Fire@1234',     color: '#DC2626' },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const route = ROLE_ROUTES[user?.role] || '/dashboard';
      navigate(route, { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left panel — 60% */}
      <div className="flex-[60] relative bg-[#0F172A] flex flex-col justify-between p-12 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 login-bg-grid" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">GhanaERS</span>
          </div>
          <h1 className="text-4xl font-semibold text-white leading-tight max-w-md">
            Coordinating emergency response across Ghana
          </h1>
        </div>

        {/* Stat cards */}
        <div className="relative z-10 flex gap-4">
          {[
            { label: '3 Agencies', sub: 'Hospital · Police · Fire' },
            { label: 'Real-time Dispatch', sub: 'Live vehicle tracking' },
            { label: 'Nationwide Coverage', sub: 'All 16 regions' },
          ].map((card) => (
            <div
              key={card.label}
              className="flex-1 bg-white/10 border border-white/20 rounded-[8px] px-4 py-4"
            >
              <p className="text-white font-semibold text-sm">{card.label}</p>
              <p className="text-white/60 text-xs mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — 40% */}
      <div className="flex-[40] flex items-center justify-center px-12 bg-[#1E293B]">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="text-accent font-semibold text-lg tracking-tight">GhanaERS</span>
          </div>

          <h2 className="text-xl font-semibold text-[#F1F5F9] mb-1">Sign in to your account</h2>
          <p className="text-sm text-[#94A3B8] mb-7">
            Enter your credentials to access the platform
          </p>

          {/* Demo credentials */}
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-2">Demo accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_CREDENTIALS.map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => { setEmail(d.email); setPassword(d.password); setError(''); }}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-[#0F172A] border border-[#334155] hover:border-[#475569] hover:bg-[#1a2744] transition-colors text-left"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-[#F1F5F9] font-medium truncate">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 text-sm bg-[#0F172A] border border-[#334155] text-[#F1F5F9] placeholder:text-[#94A3B8] rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-sm bg-[#0F172A] border border-[#334155] text-[#F1F5F9] placeholder:text-[#94A3B8] rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F1F5F9]"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-[#FEE2E2] border border-[#DC2626]/30 rounded px-3 py-2.5 text-sm text-[#DC2626]">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
              disabled={!email || !password}
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
