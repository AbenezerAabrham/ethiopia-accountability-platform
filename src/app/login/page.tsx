'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';

// Inner component reads useSearchParams — must be inside Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/home';
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email) {
      setError('Please enter your email.');
      setLoading(false);
      return;
    }

    if (authMethod === 'password') {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
      } else {
        router.push(next);
        router.refresh();
      }
    } else {
      const { error: magicError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (magicError) {
        setError(magicError.message);
        setLoading(false);
      } else {
        setMagicLinkSent(true);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg shadow-emerald-900/40">
            🇪🇹
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">Log in to your Tewedada account</p>
        </div>

        {/* Auth Form Card */}
        <Card className="bg-slate-900 border-slate-800 p-6 space-y-4 shadow-2xl">
          {/* Auth Method Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                authMethod === 'password' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('otp')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                authMethod === 'otp' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Email OTP / Magic Link
            </button>
          </div>

          {magicLinkSent ? (
            <div className="p-4 bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded-xl text-center text-xs space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="font-bold text-sm text-white">Magic Link Sent!</p>
              <p className="text-slate-300">Check your inbox at <strong className="text-white">{email}</strong> to sign in.</p>
              <Link href="/home">
                <Button size="sm" variant="primary" className="mt-2">Go to Home</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/80 text-red-300 border border-red-800 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              {authMethod === 'password' && (
                <Input
                  label="Password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-sm font-bold shadow-lg shadow-emerald-900/30"
                disabled={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {loading ? 'Authenticating...' : authMethod === 'password' ? 'Log In' : 'Send Magic Link'}
              </Button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="text-emerald-400 font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Suspense wrapper required by Next.js 15 for useSearchParams()
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
