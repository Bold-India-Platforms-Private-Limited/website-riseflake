import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { resetPassword } from '@/lib/authApi';
import { withBasePath } from '@/utils/withBasePath';
import LoadingOverlay from '@/components/common/LoadingOverlay';

const SetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (router.isReady && !token) {
      toast.error('Invalid or missing reset token.');
      router.push('/plans');
    }
  }, [router.isReady, token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(token as string, password);
      toast.success(response.message);
      setSuccess(true);
      
      const role = (response as any).role;
      setIsAdmin(role === 1);
      
      window.setTimeout(() => {
        router.push(role === 1 ? '/enter-404-refresh' : '/plans?auth=login');
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset password.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Set New Password | Riseflake</title>
      </Head>

      <LoadingOverlay isVisible={loading} />

      <main className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src={withBasePath('/hero.jpg')} alt="Riseflake" width={48} height={48} className="rounded-xl shadow-sm" />
              <span className="text-3xl font-bold text-[#2f5ee7]">Riseflake</span>
            </Link>
            
            <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-xl shadow-slate-200/50 w-full text-center">
              {success ? (
                <div className="space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-2">
                    <span className="text-4xl text-emerald-600">✓</span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">Password Updated!</h1>
                  <p className="text-slate-600">
                    Your password has been reset successfully. You will be redirected to login in a few seconds.
                  </p>
                  <Link href={isAdmin ? '/enter-404-refresh' : '/plans?auth=login'} className="block">
                    <button className="w-full rounded-full bg-[#2f5ee7] text-white py-4 font-bold hover:shadow-lg transition-all">
                      Go to Login Now
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2 text-left">Set New Password</h1>
                  <p className="text-slate-500 text-sm mb-8 text-left">
                    Please enter a new secure password for your account.
                  </p>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="text-left">
                      <label className="text-sm font-semibold text-slate-700 block mb-2">New Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="minimum 6 characters"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 focus:ring-2 focus:ring-[#2f5ee7] focus:bg-white transition-all outline-none"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="text-left">
                      <label className="text-sm font-semibold text-slate-700 block mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="re-enter password"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 focus:ring-2 focus:ring-[#2f5ee7] focus:bg-white transition-all outline-none"
                        required
                        minLength={6}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full bg-[#2f5ee7] text-white py-4 font-bold hover:shadow-lg transition-all disabled:opacity-50 mt-4"
                    >
                      Update Password
                    </button>
                  </form>
                </>
              )}
            </div>
            
            <p className="mt-8 text-slate-500 text-sm">
              Remember your password? <Link href="/plans?auth=login" className="text-[#2f5ee7] font-bold hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default SetPasswordPage;
