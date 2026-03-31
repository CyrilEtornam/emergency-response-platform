import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/common/Spinner';

const ROLE_ROUTES = {
  SUPER_ADMIN: '/admin/overview',
  HOSPITAL_ADMIN: '/dashboard',
  POLICE_ADMIN: '/dashboard',
  FIRE_ADMIN: '/dashboard',
};

const DEMO_CREDENTIALS = [
  { label: 'Super Admin', email: 'admin@ghanaers.gov.gh',    password: 'Admin@1234',    color: '#e8622a' },
  { label: 'Hospital',    email: 'hospital@ghanaers.gov.gh', password: 'Hospital@1234', color: '#4a9ee8' },
  { label: 'Police',      email: 'police@ghanaers.gov.gh',   password: 'Police@1234',   color: '#e8a82a' },
  { label: 'Fire',        email: 'fire@ghanaers.gov.gh',     password: 'Fire@1234',     color: '#e84242' },
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
    <div className="flex h-screen">
      {/* Left panel — 60% */}
      <div className="w-[60%] bg-[#1a1a17] flex flex-col justify-between p-12">
        {/* Top wordmark */}
        <div>
          <span className="text-[15px] font-semibold text-primary">GhanaERS</span>
        </div>

        {/* Middle content */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-accent font-medium mb-4">
            Emergency Response Platform
          </p>
          <h1 className="text-[42px] font-semibold text-primary leading-[1.15] mb-4">
            Coordinating emergency<br />response across Ghana.
          </h1>
          <p className="text-[15px] text-secondary">
            Dispatch. Track. Respond. All in one screen.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="flex">
          {[
            { number: '3', label: 'Agencies' },
            { number: '16', label: 'Regions Covered' },
            { number: 'Real-time', label: 'Dispatch' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-1 px-8 ${i === 0 ? 'pl-0' : ''} ${i === 2 ? 'pr-0 border-r-0' : 'border-r border-subtle'}`}
            >
              <span className="text-[32px] font-semibold text-primary">{stat.number}</span>
              <span className="text-[11px] uppercase tracking-widest text-secondary">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — 40% */}
      <div className="w-[40%] bg-base flex items-center justify-center">
        <div className="w-[380px] bg-surface border border-subtle rounded-[8px] p-10">
          <h2 className="text-[22px] font-semibold text-primary mb-1">Sign in</h2>
          <p className="text-[14px] text-secondary mb-8">Access your agency dashboard</p>

          {/* Demo credentials */}
          <div className="mb-6">
            <p className="text-[11px] font-medium uppercase tracking-widest text-secondary mb-2">Demo accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_CREDENTIALS.map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => { setEmail(d.email); setPassword(d.password); setError(''); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-input border border-subtle hover:border-default hover:bg-elevated transition-colors text-left"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-[13px] text-primary font-medium truncate">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-secondary">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="bg-input border border-subtle rounded-[4px] px-3 py-2 text-[14px] text-primary placeholder:text-muted focus:outline-none focus:border-strong transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-secondary">
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
                  className="w-full bg-input border border-subtle rounded-[4px] px-3 py-2 text-[14px] text-primary placeholder:text-muted focus:outline-none focus:border-strong transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
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
              <p className="text-danger text-[13px]">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!email || !password || loading}
              className="w-full h-10 mt-2 bg-accent hover:bg-accent-hover text-white text-[13px] font-medium rounded-[4px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Spinner size="sm" className="text-white" /> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
