import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import AuthSheet, { AuthMode } from '@/components/auth/AuthSheet';
import LandingFooter from '@/components/landing/LandingFooter';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import {
  MANAGE_SUBSCRIPTION_URL,
  PlanItem,
  ResumeConfig,
  createSubscription,
  formatDate,
  getConfig,
} from '@/lib/authApi';
import { useAuthStore } from '@/stores/auth.store';
import { withBasePath } from '@/utils/withBasePath';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';
const ACTIVATION_CHECKS = 10;
const ACTIVATION_GAP_MS = 2000;

const planFeatures = (plan: PlanItem) => [
  'All resume templates, no watermark',
  'Unlimited PDF downloads',
  `${plan.job_apply_limit.toLocaleString('en-IN')} job applications a day`,
  `${plan.job_view_limit.toLocaleString('en-IN')} job views a day`,
  ...(plan.job_apply_limit >= 500 ? ['Priority application review', 'Priority interview scheduling'] : []),
];

const loadRazorpay = () =>
  new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load the payment window. Please try again.'));
    document.body.appendChild(script);
  });

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const PlansPage = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const access = useAuthStore((state) => state.access);
  const ready = useAuthStore((state) => state.ready);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const refresh = useAuthStore((state) => state.refresh);
  const logout = useAuthStore((state) => state.logout);

  const [config, setConfig] = useState<ResumeConfig | null>(null);
  const [configFailed, setConfigFailed] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [paying, setPaying] = useState(false);
  const [activating, setActivating] = useState(false);
  const [awaitingActivation, setAwaitingActivation] = useState(false);
  const [error, setError] = useState('');
  // Payment opens by itself after login only if Continue is what led to the login.
  const continueAfterLogin = useRef(false);

  const plans = useMemo(() => config?.plans || [], [config]);
  const selected = plans.find((plan) => plan.id === selectedId) || plans[0] || null;
  const currentPlan = access?.has_access ? access.plan : null;

  const loadConfig = useCallback(async () => {
    setConfigFailed(false);
    try {
      setConfig(await getConfig());
    } catch (_error) {
      setConfigFailed(true);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    if (!router.isReady || !ready || isAuthenticated) return;
    const { auth } = router.query;
    if (auth === 'login' || auth === 'register') setAuthMode(auth);
  }, [router.isReady, router.query, ready, isAuthenticated]);

  // Activation comes from Razorpay's webhook, usually within seconds of paying.
  const waitForActivation = useCallback(async () => {
    setActivating(true);
    setAwaitingActivation(false);
    setError('');
    for (let check = 0; check < ACTIVATION_CHECKS; check += 1) {
      const latest = await refresh();
      if (latest?.has_access) {
        toast.success('Your subscription is active.');
        await router.push('/builder-paid');
        return;
      }
      await wait(ACTIVATION_GAP_MS);
    }
    setActivating(false);
    setAwaitingActivation(true);
  }, [refresh, router]);

  const startCheckout = useCallback(
    async (plan: PlanItem) => {
      setPaying(true);
      setError('');
      try {
        const { data } = await createSubscription(plan.razorpay_plan_id);
        await loadRazorpay();
        const checkout = new window.Razorpay({
          key: config?.razorpay_key,
          subscription_id: data.subscription_id,
          name: 'Riseflake',
          description: data.plan_name,
          prefill: data.user_prefill,
          theme: { color: '#414BEA' },
          handler: () => waitForActivation(),
          modal: {
            ondismiss: () => setError('Payment was not completed. You can try again whenever you are ready.'),
          },
        });
        checkout.on('payment.failed', (response: { error?: { description?: string } }) => {
          setError(response?.error?.description || 'Payment failed. Please try again.');
        });
        checkout.open();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not start the payment.');
      } finally {
        setPaying(false);
      }
    },
    [config, waitForActivation]
  );

  const handleContinue = async () => {
    if (!selected) return;
    if (currentPlan) {
      await router.push('/builder-paid');
      return;
    }
    if (!isAuthenticated) {
      continueAfterLogin.current = true;
      setAuthMode(router.query.auth === 'login' ? 'login' : 'register');
      return;
    }
    await startCheckout(selected);
  };

  const handleSignedIn = useCallback(async () => {
    setAuthMode(null);
    if (router.query.auth) router.replace('/plans', undefined, { shallow: true });
    const state = useAuthStore.getState();
    if (state.access?.has_access) {
      await router.push('/builder-paid');
      return;
    }
    if (continueAfterLogin.current && selected) {
      continueAfterLogin.current = false;
      await startCheckout(selected);
    }
  }, [router, selected, startCheckout]);

  return (
    <>
      <Head>
        <title>Plans | Riseflake Resume</title>
        <meta name="description" content="Build your resume with a Riseflake subscription." />
      </Head>

      <LoadingOverlay
        isVisible={activating}
        title="Activating your subscription"
        message="Please keep this page open. This usually takes a few seconds."
      />

      <div className="min-h-screen bg-[#f1f5f9] text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src={withBasePath('/hero.jpg')} alt="Riseflake" width={32} height={32} />
              <span className="text-lg font-bold text-slate-900">Riseflake Resume</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4 text-sm">
                <Link href="/profile" className="hidden font-medium text-slate-700 hover:text-[#414BEA] sm:inline">
                  {user.first_name || user.full_name}
                </Link>
                <button type="button" onClick={() => logout()} className="cursor-pointer font-medium text-slate-500 hover:text-slate-800">
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="cursor-pointer rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-800 hover:border-[#414BEA] hover:text-[#414BEA]"
              >
                Login with Riseflake
              </button>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-32 pt-7 sm:px-6 sm:pt-10 lg:pb-16">
          <h1 className="text-[26px] font-bold leading-tight sm:text-4xl">
            {currentPlan ? 'Your resume builder is ready' : 'Build your resume with a Riseflake subscription'}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] text-slate-600 sm:text-base">
            {currentPlan
              ? `You are on ${currentPlan.title}, so every template and download is open to you.`
              : 'One subscription covers the resume builder and your job applications on Riseflake. Already subscribed? Login and start building.'}
          </p>

          {awaitingActivation && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p>Your payment went through and your subscription is still being activated. This can take a minute.</p>
              <button type="button" onClick={waitForActivation} className="mt-2 cursor-pointer font-semibold underline">
                Check again
              </button>
            </div>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="grid gap-4 md:grid-cols-2" aria-label="Plans">
              {!config &&
                !configFailed &&
                [0, 1].map((item) => <div key={item} className="h-80 animate-pulse rounded-xl bg-white" />)}

              {configFailed && (
                <div className="rounded-xl bg-white p-6 md:col-span-2">
                  <p className="text-slate-700">We could not load the plans right now.</p>
                  <button type="button" onClick={loadConfig} className="mt-2 cursor-pointer font-semibold text-[#414BEA]">
                    Try again
                  </button>
                </div>
              )}

              {plans.map((plan) => {
                const isSelected = selected?.id === plan.id;
                const isCurrent = currentPlan?.id === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={Boolean(currentPlan)}
                    onClick={() => setSelectedId(plan.id)}
                    className={`flex flex-col rounded-xl border-2 bg-white p-5 text-left transition-colors sm:p-6 ${
                      isSelected && !currentPlan ? 'border-[#414BEA]' : 'border-transparent'
                    } ${currentPlan ? 'cursor-default' : 'cursor-pointer hover:border-[#c3c7f7]'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-bold">{plan.title}</h2>
                      {!currentPlan && (
                        <span
                          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected ? 'border-[#414BEA]' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-[#414BEA]" />}
                        </span>
                      )}
                      {isCurrent && <span className="text-sm font-semibold text-[#414BEA]">Current plan</span>}
                    </div>
                    <p className="mt-3">
                      <span className="text-[34px] font-bold leading-none">₹{plan.price.toLocaleString('en-IN')}</span>
                      <span className="text-[15px] text-slate-500"> / {plan.interval}</span>
                    </p>
                    <ul className="mt-5 space-y-2.5 text-[15px] text-slate-700">
                      {planFeatures(plan).map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#414BEA]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </section>

            <aside className="hidden lg:block">
              <div className="sticky top-6 rounded-xl bg-white p-6">
                {currentPlan ? (
                  <>
                    <h2 className="text-lg font-bold">{currentPlan.title}</h2>
                    <dl className="mt-4 space-y-2.5 text-[15px]">
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">{currentPlan.status === 'cancelled' ? 'Ends on' : 'Renews on'}</dt>
                        <dd className="font-medium">{formatDate(currentPlan.next_charge_at || currentPlan.current_end)}</dd>
                      </div>
                    </dl>
                    <Link href="/builder-paid" className="mt-5 block rounded-lg bg-[#414BEA] py-3 text-center font-semibold text-white hover:bg-[#3540d6]">
                      Open Resume Builder
                    </Link>
                    <a href={MANAGE_SUBSCRIPTION_URL} className="mt-3 block text-center text-sm font-semibold text-[#414BEA] hover:underline">
                      Manage subscription
                    </a>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-bold">Summary</h2>
                    <dl className="mt-4 space-y-2.5 text-[15px]">
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Plan</dt>
                        <dd className="text-right font-medium">{selected?.title || '-'}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Billing</dt>
                        <dd className="font-medium">Monthly</dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4">
                      <span className="font-semibold">Pay today</span>
                      <span className="text-2xl font-bold">₹{selected ? selected.price.toLocaleString('en-IN') : '-'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={!selected || paying}
                      className="mt-5 w-full cursor-pointer rounded-lg bg-[#414BEA] py-3 font-semibold text-white hover:bg-[#3540d6] disabled:cursor-default disabled:opacity-60"
                    >
                      {paying ? 'Opening payment...' : 'Continue'}
                    </button>
                    <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
                      Renews every month. Cancel anytime from your Riseflake account. Payments are handled by Razorpay.
                    </p>
                  </>
                )}
                {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
              </div>
            </aside>
          </div>

          {!currentPlan && config && (
            <p className="mt-6 text-[15px] text-slate-600">
              Want to look around first?{' '}
              <Link href={config.free_builder ? '/builder-free' : '/builder-trial'} className="font-semibold text-[#414BEA] hover:underline">
                {config.free_builder ? 'Try the free builder' : 'Try the builder'}
              </Link>
            </p>
          )}
        </main>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          {error && <p className="mb-2 text-sm text-red-700">{error}</p>}
          {currentPlan ? (
            <Link href="/builder-paid" className="block rounded-lg bg-[#414BEA] py-3 text-center font-semibold text-white">
              Open Resume Builder
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <div className="min-w-0">
                <p className="truncate text-[13px] text-slate-500">{selected?.title || 'Choose a plan'}</p>
                <p className="text-lg font-bold leading-tight">
                  ₹{selected ? selected.price.toLocaleString('en-IN') : '-'}
                  <span className="text-[13px] font-normal text-slate-500"> / month</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleContinue}
                disabled={!selected || paying}
                className="flex-1 cursor-pointer rounded-lg bg-[#414BEA] py-3 font-semibold text-white disabled:opacity-60"
              >
                {paying ? 'Opening...' : 'Continue'}
              </button>
            </div>
          )}
        </div>

        <LandingFooter />
      </div>

      {authMode && (
        <AuthSheet mode={authMode} onModeChange={setAuthMode} onClose={() => { continueAfterLogin.current = false; setAuthMode(null); }} onSignedIn={handleSignedIn} />
      )}
    </>
  );
};

export default PlansPage;
