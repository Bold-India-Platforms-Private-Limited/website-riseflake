import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { loginAdmin } from '@/lib/authApi';
import { useAuthStore } from '@/stores/auth.store';

const Enter404RefreshPage = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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

  return (
    <>
      <Head>
        <title>Admin Access | Riseflake</title>
      </Head>

      <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
          <p className="text-slate-500 mt-1 text-sm">Restricted panel authentication</p>

          <form className="mt-5 space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Admin email"
              value={loginEmail}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setLoginEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setLoginPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 text-white py-2.5 font-semibold disabled:opacity-60"
            >
              {loading ? 'Please wait...' : 'Admin Login'}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </section>
      </main>
    </>
  );
};

export default Enter404RefreshPage;
