import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { XCircle } from 'lucide-react';
import { loginAdmin, forgotPassword } from '@/lib/authApi';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

const Enter404RefreshPage = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'forgot'>('login');
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginAdmin({ email: loginEmail, password: loginPassword });
      if (response.user && response.token) {
        setUser(response.user, response.token);
        await router.push('/admin-panel');
      }
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Admin login failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await forgotPassword(forgotEmail);
      toast.success(response.message);
      setAuthMode('login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset link.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Access | Riseflake</title>
      </Head>

      <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-900">
            {authMode === 'login' ? 'Admin Access' : 'Forgot Password'}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {authMode === 'login' ? 'Restricted panel authentication' : 'Enter your admin email to reset password'}
          </p>

          {authMode === 'login' ? (
            <form className="mt-5 space-y-4" onSubmit={handleLogin}>
              <div>
                <input
                  type="email"
                  placeholder="Admin email"
                  value={loginEmail}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setLoginEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setLoginPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5"
                  required
                />
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 text-white py-2.5 font-semibold disabled:opacity-60"
              >
                {loading ? 'Please wait...' : 'Admin Login'}
              </button>
            </form>
          ) : (
            <form className="mt-5 space-y-4" onSubmit={handleForgot}>
              <input
                type="email"
                placeholder="Enter your admin email"
                value={forgotEmail}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setForgotEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 text-white py-2.5 font-semibold disabled:opacity-60"
              >
                {loading ? 'Please wait...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-full text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                Back to Login
              </button>
            </form>
          )}

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-sm font-medium text-red-800 leading-tight">
                {error}
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Enter404RefreshPage;
