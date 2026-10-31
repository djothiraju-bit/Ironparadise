import React, { useState } from 'react';
import { Shield, Dumbbell, ArrowRight, KeyRound, User, Lock, Phone, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { User as UserType, Member as MemberType, GymSettings } from '../types';

interface SplashScreenProps {
  settings: GymSettings | null;
  onLoginSuccess: (user: UserType, member?: MemberType) => void;
  onExploreDemo: (role: 'member' | 'admin') => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  settings,
  onLoginSuccess,
  onExploreDemo,
}) => {
  const [authMode, setAuthMode] = useState<'splash' | 'login' | 'register' | 'forgot'>('splash');
  const [selectedRole, setSelectedRole] = useState<'member' | 'admin'>('member');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      onLoginSuccess(res.user, res.member);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.register({
        name,
        email,
        phone,
        password,
      });
      setSuccessMsg('Registration successful! Welcome to IP FITNESS.');
      setTimeout(() => {
        onLoginSuccess(res.user, res.member);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.resetPassword(email, newPassword);
      setSuccessMsg(res.message);
      setTimeout(() => {
        setAuthMode('login');
        setSuccessMsg(null);
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'member' | 'admin') => {
    if (role === 'admin') {
      setEmail('vignesh');
      setPassword('ironparadise@1234');
      setSelectedRole('admin');
    } else {
      setEmail('rahul.sharma@gmail.com');
      setPassword('rahul123');
      setSelectedRole('member');
    }
    setAuthMode('login');
  };

  return (
    <div className="flex-1 w-full min-h-full flex flex-col justify-between p-6 bg-[#101010] text-zinc-100">
      {/* Top Branding Section */}
      <div className="flex flex-col items-center justify-center pt-8 text-center">
        {/* Animated Neon Badge */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#18181b] to-[#27272a] border-2 border-[#B7F34A]/80 shadow-[0_0_35px_rgba(183,243,74,0.25)] flex items-center justify-center group">
            <Dumbbell className="w-10 h-10 text-[#B7F34A] transform -rotate-45 group-hover:scale-110 transition-transform" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#B7F34A] text-black text-[10px] font-black px-2 py-0.5 rounded shadow">
            EST 2026
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white uppercase mb-1">
          {settings?.gym_name || 'IP FITNESS'}
        </h1>
        <p className="text-xs font-bold tracking-[0.25em] text-[#B7F34A] uppercase mb-4">
          {settings?.tagline || 'TRAIN HARD. STAY CONSISTENT.'}
        </p>

        {/* Live Open / Closed Pill indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
          <span
            className={`w-2 h-2 rounded-full ${
              settings?.is_open ? 'bg-[#B7F34A] shadow-[0_0_8px_#B7F34A]' : 'bg-red-500'
            }`}
          />
          <span>{settings?.is_open ? 'Gym is Open Now' : 'Gym is Currently Closed'}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400 font-normal">{settings?.opening_time || '05:30 AM'} - {settings?.closing_time || '10:30 PM'}</span>
        </div>
      </div>

      {/* Main Interactive Action Zone */}
      <div className="my-auto py-6">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-[#B7F34A]/60 text-[#B7F34A] text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {authMode === 'splash' && (
          <div className="space-y-3">
            <button
              onClick={() => {
                setSelectedRole('member');
                setAuthMode('login');
              }}
              className="w-full h-13 rounded-2xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#B7F34A]/10 active:scale-[0.98] transition-all"
            >
              <User className="w-4 h-4" />
              <span>Enter Member Portal</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => {
                setSelectedRole('admin');
                setAuthMode('login');
              }}
              className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Shield className="w-4 h-4 text-[#B7F34A]" />
              <span>Gym Director / Admin Login</span>
            </button>

            {/* Quick Demo Launchers */}
            <div className="pt-4 border-t border-zinc-800/80">
              <p className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 text-center mb-2.5">
                Instant Demo Access (No typing needed)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => fillDemo('member')}
                  className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-[#B7F34A]/50 text-left transition-colors"
                >
                  <div className="text-[11px] font-bold text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A]" />
                    Rahul (Member)
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Active Plan · IP-1001</div>
                </button>

                <button
                  onClick={() => fillDemo('admin')}
                  className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-[#B7F34A]/50 text-left transition-colors"
                >
                  <div className="text-[11px] font-bold text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A]" />
                    Vignesh (Director)
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Admin · vignesh</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {selectedRole === 'admin' ? 'Admin Authentication' : 'Member Sign In'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedRole(selectedRole === 'admin' ? 'member' : 'admin')}
                className="text-[11px] text-[#B7F34A] hover:underline"
              >
                Switch to {selectedRole === 'admin' ? 'Member' : 'Admin'}
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul.sharma@gmail.com"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#B7F34A] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-zinc-400">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-[11px] text-zinc-400 hover:text-white"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#B7F34A] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            {/* Quick pre-fill helpers */}
            <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-zinc-400">
              <span>Quick Fill:</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('rahul.sharma@gmail.com');
                  setPassword('rahul123');
                  setSelectedRole('member');
                }}
                className="text-[#B7F34A] underline"
              >
                Member
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('vignesh');
                  setPassword('ironparadise@1234');
                  setSelectedRole('admin');
                }}
                className="text-[#B7F34A] underline"
              >
                Admin (vignesh)
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-zinc-400">
              <button
                type="button"
                onClick={() => setAuthMode('splash')}
                className="hover:text-white"
              >
                ← Back
              </button>

              {settings?.allow_member_registration && selectedRole === 'member' && (
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-[#B7F34A] hover:underline"
                >
                  New Member? Join Now
                </button>
              )}
            </div>
          </form>
        )}

        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Join IP FITNESS — New Member Registration
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Karan Kapoor"
                className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#B7F34A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="karan@example.com"
                className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#B7F34A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">Phone Number (10 digits)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#B7F34A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">Create Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#B7F34A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Member Account...' : 'Complete Registration'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}

        {authMode === 'forgot' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Reset Your Password
            </div>
            <p className="text-xs text-zinc-400">
              Enter your registered email address and choose a new secure password.
            </p>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul.sharma@gmail.com"
                className="w-full h-11 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#B7F34A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 6 chars)"
                className="w-full h-11 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#B7F34A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Branding */}
      <div className="text-center pt-4 border-t border-zinc-900">
        <p className="text-[11px] text-zinc-400">
          IRON PARADISE Unisex Fitness · Radhakrishnan Nagar, Puducherry, 605009
        </p>
        <p className="text-[10px] text-zinc-400 mt-0.5">
          Dedicated Single-Gym Architecture · Powered by Secure Express & Razorpay
        </p>
      </div>
    </div>
  );
};
