'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Wheat, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <div className="auth-header">
          <div className="auth-logo-box">
            <Wheat size={32} />
          </div>
          <h2>Sign in to your account</h2>
          <p>
            Or <Link href="/register">register to join Agro-Connect</Link>
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2, color: '#EF5350' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="email" className="auth-label">Email address</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
                placeholder="farmer@domain.com"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="password" className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -12, marginBottom: 24 }}>
            <Link href="#" style={{ color: 'var(--color-primary-100)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Forgot your password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign in securely'}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <button onClick={signInWithGoogle} className="auth-google-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
            <path d="M5.26498 14.2949C5.02498 13.5699 4.875 12.805 4.875 12C4.875 11.195 5.01998 10.43 5.26498 9.70498L1.275 6.60998C0.46 8.27998 0 10.085 0 12C0 13.915 0.46 15.72 1.28 17.39L5.26498 14.2949Z" fill="#FBBC05"/>
            <path d="M12.0004 24C15.2404 24 17.9654 22.935 20.0604 21.095L16.2154 18.095C15.0804 18.85 13.6404 19.31 12.0004 19.31C8.8754 19.31 6.22538 17.25 5.28038 14.36L1.29538 17.455C3.28038 21.365 7.3354 24 12.0004 24Z" fill="#34A853"/>
            <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.81498 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

      </div>
    </div>
  );
}
