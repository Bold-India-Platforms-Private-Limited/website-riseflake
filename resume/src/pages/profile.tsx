import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { FileText } from 'lucide-react';
import { getCurrentPlan, getCurrentUser, getPaymentLogs, PaymentSnapshot } from '@/lib/authApi';
import { useAuthStore } from '@/stores/auth.store';
import InitialsAvatar from '@/components/common/InitialsAvatar';
import { withBasePath } from '@/utils/withBasePath';

const getRoleLabel = (role?: number) => {
  if (role === 1) return 'Admin';
  if (role === 2) return 'User';
  return 'User';
};

const ProfilePage = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<PaymentSnapshot | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentSnapshot[]>([]);
  const [checkingPlan, setCheckingPlan] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [userRes, currentPlanRes, logsRes] = await Promise.all([
          getCurrentUser(token),
          getCurrentPlan(token),
          getPaymentLogs(token),
        ]);

        if (userRes.user) {
          setUser(userRes.user, token);
        }

        setCurrentPlan(currentPlanRes.payment);
        setPaymentHistory(logsRes.payments || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, setUser]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleBuildNow = async () => {
    if (!token) {
      router.push('/plans');
      return;
    }

    setCheckingPlan(true);
    try {
      const response = await getCurrentPlan(token);
      if (response.hasAnyPlan) {
        router.push('/builder-paid');
        return;
      }
    } catch (_error) {
      // fallback to plans
    } finally {
      setCheckingPlan(false);
    }

    router.push('/plans');
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center max-w-md">
          <p className="text-slate-700">Please login to view profile.</p>
          <Link href="/plans?auth=login" className="text-indigo-600 font-semibold mt-3 inline-block">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Profile | Riseflake</title>
      </Head>

      <main className="min-h-screen bg-slate-50 text-slate-900">
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 backdrop-blur-xl bg-opacity-95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image src={withBasePath('/hero.jpg')} alt="Riseflake" width={42} height={42} />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Riseflake
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="https://riseflake.com/jobs"
                className="text-gray-700 hover:text-indigo-600 font-medium transition"
              >
                Find Jobs
              </Link>
              <Link
                href="https://riseflake.com/companies"
                className="text-gray-700 hover:text-indigo-600 font-medium transition"
              >
                Companies
              </Link>
              <Link
                href="/builder-free"
                className="text-gray-700 hover:text-indigo-600 font-medium transition"
              >
                Resume Builder
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="contained"
                onClick={handleBuildNow}
                disabled={checkingPlan}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-xl"
              >
                {checkingPlan ? 'Checking...' : 'Build Now'}
              </Button>
              <Link href="/builder-trial">
                <Button
                  variant="outlined"
                  className="border-indigo-300 text-indigo-700 hover:border-indigo-600"
                >
                  Trial
                </Button>
              </Link>
              <Button
                variant="outlined"
                className="border-gray-300 text-gray-700 hover:border-indigo-600"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </nav>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Account details, active plan and payment history.</p>

          <div className="grid lg:grid-cols-[360px_1fr] gap-6 mt-6">
            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <InitialsAvatar name={user?.full_name} seed={user?.id} size={144} />
                <h2 className="text-xl font-semibold text-slate-900 mt-4">{user?.full_name || 'User'}</h2>
                <p className="text-slate-500 text-sm mt-1">Role: {getRoleLabel(user?.role)}</p>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">Email</p>
                  <p className="font-medium text-slate-900 break-all">{user?.email || '-'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">Mobile</p>
                  <p className="font-medium text-slate-900">{user?.mobile_no || '-'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">Status</p>
                  <p className="font-medium text-slate-900">{user?.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Current Plan</h3>
                {loading ? (
                  <div className="mt-4 grid sm:grid-cols-2 gap-3 animate-pulse">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="rounded-lg bg-slate-50 p-3">
                        <div className="h-3 w-20 bg-slate-200 rounded" />
                        <div className="h-5 w-32 bg-slate-300 rounded mt-2" />
                      </div>
                    ))}
                  </div>
                ) : currentPlan ? (
                  <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-slate-500">Plan</p>
                      <p className="font-medium text-slate-900">{currentPlan.plan_name}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-slate-500">Status</p>
                      <p className="font-medium text-slate-900">{currentPlan.status} / {currentPlan.plan_status}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-slate-500">Quota</p>
                      <p className="font-medium text-slate-900">
                        {currentPlan.download_used}/{currentPlan.download_limit} (left {currentPlan.downloads_left})
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-slate-500">Expires</p>
                      <p className="font-medium text-slate-900">
                        {currentPlan.end_time ? new Date(currentPlan.end_time).toLocaleString() : '-'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mt-2">No active plan currently.</p>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>

                {loading ? (
                  <div className="mt-4 space-y-3 animate-pulse">
                    <div className="grid grid-cols-4 gap-3">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={`header-${index}`} className="h-4 bg-slate-200 rounded" />
                      ))}
                    </div>
                    {Array.from({ length: 5 }).map((_, row) => (
                      <div key={`row-${row}`} className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 4 }).map((__, col) => (
                          <div key={`cell-${row}-${col}`} className="h-4 bg-slate-100 rounded" />
                        ))}
                      </div>
                    ))}
                  </div>
                ) : paymentHistory.length === 0 ? (
                  <p className="text-sm text-slate-500 mt-2">No payment history found.</p>
                ) : (
                  <div className="mt-4 overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-200">
                          <th className="py-2 pr-4">Plan</th>
                          <th className="py-2 pr-4">Payment</th>
                          <th className="py-2 pr-4">Plan Status</th>
                          <th className="py-2 pr-4">Quota</th>
                          <th className="py-2 pr-4">Created</th>
                          <th className="py-2 pr-4">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id} className="border-b border-slate-100">
                            <td className="py-2 pr-4">{payment.plan_name}</td>
                            <td className="py-2 pr-4">{payment.status}</td>
                            <td className="py-2 pr-4">{payment.plan_status}</td>
                            <td className="py-2 pr-4">
                              {payment.download_used}/{payment.download_limit} (left {payment.downloads_left})
                            </td>
                            <td className="py-2 pr-4">{new Date(payment.created_at).toLocaleString()}</td>
                            <td className="py-2 pr-4">
                              {payment.razorpay_invoice_id ? (
                                <a
                                  href={`https://invoices.razorpay.com/v1/t/${payment.razorpay_invoice_id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-100"
                                  title="Open Invoice"
                                >
                                  <FileText size={16} />
                                </a>
                              ) : (
                                '-'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProfilePage;
