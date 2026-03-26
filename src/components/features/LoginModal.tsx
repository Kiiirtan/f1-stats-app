import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = mode === 'login' ? login(username, password) : register(username, password);

    if (result.success) {
      resetForm();
      onClose();
    } else {
      setError(result.error || 'An error occurred');
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-c-30 border border-c-10/20 shadow-2xl rounded-sm animate-search-in">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-c-10/20">
          <h2 className="font-headline text-xl font-bold text-t-bright uppercase tracking-wider">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-t-main hover:text-c-10 transition-colors"
          >
            close
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm rounded-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-label uppercase tracking-widest text-t-main mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-c-60 border border-c-10/20 px-4 py-3 text-t-bright font-body outline-none focus:border-c-10 transition-colors rounded-sm"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-xs font-label uppercase tracking-widest text-t-main mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-c-60 border border-c-10/20 px-4 py-3 text-t-bright font-body outline-none focus:border-c-10 transition-colors rounded-sm"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-c-10 text-c-60 py-4 text-sm font-black tracking-[0.2em] hover:brightness-110 transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(102,252,241,0.4)]"
          >
            {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>

          <p className="text-center text-sm text-t-main">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={switchMode} className="text-c-10 font-bold hover:underline">
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
