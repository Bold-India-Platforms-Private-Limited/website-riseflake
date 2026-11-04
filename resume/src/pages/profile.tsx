import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { MANAGE_SUBSCRIPTION_URL, formatDate } from '@/lib/authApi';
import { useAuthStore } from '@/stores/auth.store';

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-6 border-b border-slate-100 py-3 last:border-0">
    <dt className="text-slate-500">{label}</dt>
    <dd className="text-right font-medium text-slate-900">{value}</dd>
  </div>
);

const ProfilePage = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const access = useAuthStore((state) => state.access);
  const ready = useAuthStore((state) => state.ready);
  const logout = useAuthStore((state) => state.logout);
  const plan = access?.has_access ? access.plan : null;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f5f9]">
      <Head>
        <title>Your account | Riseflake Resume</title>
      </Head>
      <LandingNavbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        {!user ? (
          <div className="rounded-xl bg-white p-6 text-center">
            <p className="text-slate-700">{ready ? 'Please login to see your account.' : 'Loading your account...'}</p>
            {ready && (
              <Link href="/plans?auth=login" className="mt-3 inline-block font-semibold text-[#414BEA]">
                Login with Riseflake
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <section className="rounded-xl bg-white p-5 sm:p-6">
              <h1 className="text-xl font-bold text-slate-900">{user.full_name}</h1>
              <dl className="mt-3 text-[15px]">
                <Row label="Email" value={user.email} />
                {user.mobile_no && <Row label="Mobile" value={user.mobile_no} />}
              </dl>
            </section>

            <section className="rounded-xl bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900">Subscription</h2>
              {plan ? (
                <>
                  <dl className="mt-3 text-[15px]">
                    <Row label="Plan" value={plan.title} />
                    <Row label="Price" value={`₹${plan.price.toLocaleString('en-IN')} / ${plan.interval}`} />
                    <Row
                      label={plan.status === 'cancelled' ? 'Ends on' : 'Renews on'}
                      value={formatDate(plan.next_charge_at || plan.current_end)}
                    />
                  </dl>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <Link href="/builder-paid" className="rounded-lg bg-[#414BEA] px-5 py-2.5 font-semibold text-white hover:bg-[#3540d6]">
                      Open Resume Builder
                    </Link>
                    <a href={MANAGE_SUBSCRIPTION_URL} className="font-semibold text-[#414BEA] hover:underline">
                      Manage subscription
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-2 text-[15px] text-slate-600">You don't have a paid plan yet.</p>
                  <Link href="/plans" className="mt-4 inline-block rounded-lg bg-[#414BEA] px-5 py-2.5 font-semibold text-white hover:bg-[#3540d6]">
                    See plans
                  </Link>
                </>
              )}
            </section>

            <button type="button" onClick={handleLogout} className="cursor-pointer text-sm font-semibold text-slate-500 hover:text-slate-800">
              Logout
            </button>
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
};

export default ProfilePage;
