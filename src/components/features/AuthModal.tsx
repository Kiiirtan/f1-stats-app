import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  const glass = settings.glassMorphism;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setError('');
      setSuccess('');
      setEmail('');
      setPassword('');
      setDisplayName('');
      setShowPassword(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const result = await signIn(email, password);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Login failed.');
        }
      } else {
        const result = await signUp(email, password, displayName || undefined);
        if (result.success) {
          setSuccess('Account created! You are now signed in.');
          setTimeout(() => onClose(), 1500);
        } else {
          setError(result.error || 'Registration failed.');
        }
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-2xl overflow-hidden animate-search-in ${
          glass
            ? 'bg-[#0f0f0f]/90 backdrop-blur-2xl border border-white/10'
            : 'bg-[#1a1a24] border border-white/5'
        }`}
        style={{ boxShadow: '0 25px 100px rgba(0,0,0,0.6)' }}
      >
        {/* Top accent line */}
        <div className="h-1 bg-gradient-to-r from-[var(--theme-accent)] via-[#E10600] to-[var(--theme-accent)]/40" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors z-10"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-white/60 text-lg">close</span>
        </button>

        <div className="p-8 pt-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--theme-accent)]/10 mb-4">
              <span
                className="material-symbols-outlined text-[var(--theme-accent)]"
                style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}
              >
                {mode === 'login' ? 'login' : 'person_add'}
              </span>
            </div>
            <h2 className="font-headline font-black text-2xl tracking-tight text-white mb-1">
              {mode === 'login' ? 'WELCOME BACK' : 'JOIN THE GRID'}
            </h2>
            <p className="text-white/40 text-sm font-body">
              {mode === 'login'
                ? 'Sign in to your F1 Stats cockpit'
                : 'Create your driver profile'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-headline font-bold text-white/50 tracking-widest uppercase block">
                  DISPLAY NAME
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/30 text-lg">badge</span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Max Verstappen"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[var(--theme-accent)]/50 focus:bg-white/[0.06] transition-all font-body"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-headline font-bold text-white/50 tracking-widest uppercase block">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/30 text-lg">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver@f1stats.com"
                  required
                  autoComplete="email"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[var(--theme-accent)]/50 focus:bg-white/[0.06] transition-all font-body"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-headline font-bold text-white/50 tracking-widest uppercase block">
                PASSWORD
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/30 text-lg">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[var(--theme-accent)]/50 focus:bg-white/[0.06] transition-all font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-body">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || authLoading}
              className="w-full py-3.5 rounded-xl font-headline font-black text-xs tracking-widest uppercase bg-gradient-to-br from-[var(--theme-accent)] to-[#E10600] text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[var(--theme-accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'SIGNING IN...' : 'CREATING ACCOUNT...'}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {mode === 'login' ? 'login' : 'person_add'}
                  </span>
                  {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                </>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center">
            <p className="text-white/30 text-xs font-body">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={switchMode}
                className="ml-1.5 text-[var(--theme-accent)] font-headline font-bold tracking-wider hover:underline"
              >
                {mode === 'login' ? 'REGISTER' : 'SIGN IN'}
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-[10px] text-white/20 font-body leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            <br />Your data is secured with enterprise-grade encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
