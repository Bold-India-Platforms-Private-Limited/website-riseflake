import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Check, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import AuthSheet, { AuthMode } from '@/components/auth/AuthSheet';
import LandingFooter from '@/components/landing/LandingFooter';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import {
  MANAGE_SUBSCRIPTION_URL,
  PlanItem,
  ResumeConfig,
  createSubscription,
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

// The offer shown on this page. Razorpay charges the plan price, which is what
// "Total payable amount" shows; the MRP is that price with the offer added back.
const OFFER_PERCENT = 25;
const mrpOf = (price: number) => Math.round(price / (1 - OFFER_PERCENT / 100));
const inr = (value: number) => value.toLocaleString('en-IN');

const planFeatures = (plan: PlanItem) => [
  'Unlimited downloads',
  'ATS-friendly premium templates',
  `${inr(plan.job_apply_limit)} job applications a day`,
  `${inr(plan.job_view_limit)} job views a day`,
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
  const [config, setConfig] = useState<ResumeConfig | null>(null);
  const [configFailed, setConfigFailed] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cartCompleted, setCartCompleted] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentRetryMode, setPaymentRetryMode] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [awaitingActivation, setAwaitingActivation] = useState(false);
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  // Payment opens by itself after login only if Continue is what led to the login.
  const continueAfterLogin = useRef(false);

  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const access = useAuthStore((state) => state.access);
  const ready = useAuthStore((state) => state.ready);
  const refresh = useAuthStore((state) => state.refresh);

  const loginCompleted = Boolean(user);
  const hasAccess = Boolean(access?.has_access);
  const loadingPlans = !config && !configFailed;
  const plans = useMemo(() => config?.plans || [], [config]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) || plans[0] || null,
    [plans, selectedPlanId]
  );

  const amount = Number(selectedPlan?.price || 0);
  const mrp = mrpOf(amount);
  const saving = mrp - amount;
  const discount = 0;
  const tax = 0;
  const total = amount;

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

  const openAuthDrawer = (mode: AuthMode) => {
    setAuthMode(mode);
    setStep(2);
  };

  const closeAuthDrawer = () => {
    continueAfterLogin.current = false;
    setAuthMode(null);
    setStep(1);
  };

  useEffect(() => {
    if (!router.isReady || !ready || loginCompleted) return;

    const { auth } = router.query;
    if (auth === 'register' || auth === 'login') {
      setCartCompleted(true);
      openAuthDrawer(auth);
    }
  }, [router.isReady, router.query.auth, ready, loginCompleted]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Activation comes from Razorpay's webhook, usually within seconds of paying.
  const waitForActivation = useCallback(async () => {
    setIsVerifying(true);
    setAwaitingActivation(false);
    setError('');
    for (let check = 0; check < ACTIVATION_CHECKS; check += 1) {
      const latest = await refresh();
      if (latest?.has_access) {
        setPaymentCompleted(true);
        setPaymentRetryMode(false);
        toast.success('Payment successful. Redirecting you in a few seconds...');
        await router.push('/builder-paid');
        return;
      }
      await wait(ACTIVATION_GAP_MS);
    }
    setIsVerifying(false);
    setAwaitingActivation(true);
  }, [refresh, router]);

  const openRazorpayCheckout = useCallback(
    async (plan: PlanItem) => {
      setProcessingPayment(true);
      setError('');
      setStep(3);
      setPaymentCompleted(false);

      try {
        const { data } = await createSubscription(plan.razorpay_plan_id);
        await loadRazorpay();

        const razorpay = new window.Razorpay({
          key: config?.razorpay_key,
          subscription_id: data.subscription_id,
          name: 'Riseflake Resume Builder',
          description: `${data.plan_name} Purchase`,
          prefill: data.user_prefill,
          theme: {
            color: '#2f5ee7',
          },
          handler: () => waitForActivation(),
          modal: {
            ondismiss: () => {
              const message = 'Payment failed or cancelled.';
              toast.error(message);
              setError(message);
              setPaymentRetryMode(true);
            },
          },
        });
        razorpay.on('payment.failed', (response: { error?: { description?: string } }) => {
          const message = response?.error?.description || 'Payment failed. Please try again.';
          toast.error(message);
          setError(message);
          setPaymentRetryMode(true);
        });
        razorpay.open();
      } catch (payErr) {
        const message = payErr instanceof Error ? payErr.message : 'Unable to start the payment.';
        toast.error(message);
        setError(message);
        setPaymentRetryMode(true);
      } finally {
        setProcessingPayment(false);
      }
    },
    [config, waitForActivation]
  );

  const handleContinueFromCart = async () => {
    setError('');
    setCartCompleted(true);

    if (hasAccess) {
      setIsNavigating(true);
      await router.push('/builder-paid');
      return;
    }

    if (!loginCompleted) {
      continueAfterLogin.current = true;
      // Default to register unless explicitly set to login
      openAuthDrawer(router.query.auth === 'login' ? 'login' : 'register');
      return;
    }

    if (selectedPlan) await openRazorpayCheckout(selectedPlan);
  };

  const handleSignedIn = useCallback(async () => {
    setAuthMode(null);
    setStep(1);
    if (router.query.auth) router.replace('/plans', undefined, { shallow: true });
    if (useAuthStore.getState().access?.has_access) {
      await router.push('/builder-paid');
      return;
    }
    if (continueAfterLogin.current && selectedPlan) {
      continueAfterLogin.current = false;
      await openRazorpayCheckout(selectedPlan);
    }
  }, [router, selectedPlan, openRazorpayCheckout]);

  const stepLabelClass = (index: 1 | 2 | 3) => {
    const active = step === index;
    return active ? 'text-slate-900 font-semibold' : 'text-slate-600 font-medium';
  };

  return (
    <>
      <Head>
        <title>Plans & Checkout | RF Resume</title>
      </Head>

      <LoadingOverlay
        isVisible={isNavigating}
      />

      <LoadingOverlay
        isVisible={isVerifying}
        title="Verifying your payment..."
        message="Do not leave or refresh this page. It may take from 2 seconds up to 12 seconds."
      />

      <main className="plans-scroll-thin plans-font min-h-screen bg-[#f5f6fa] text-slate-900">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 min-w-[130px]">
              <Image src={withBasePath('/hero.jpg')} alt="Riseflake" width={34} height={34} />
              <span className="text-2xl leading-none font-bold text-[#2f5ee7] hidden sm:inline">Riseflake</span>
            </Link>

            <div className="flex items-center gap-3 text-[11px] sm:text-base font-medium">
              <span className={stepLabelClass(1)}>
                1. Cart {cartCompleted && <CheckCircle2 className="inline h-3 w-3 sm:h-4 sm:w-4 text-green-600" />}
              </span>
              <span className={stepLabelClass(2)}>
                2. Login {loginCompleted && <CheckCircle2 className="inline h-3 w-3 sm:h-4 sm:w-4 text-green-600" />}
              </span>
              <span className={stepLabelClass(3)}>
                3. Payment {paymentCompleted && <CheckCircle2 className="inline h-3 w-3 sm:h-4 sm:w-4 text-green-600" />}
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-slate-600 min-w-[240px] justify-end">
              <ShieldCheck className="h-5 w-5 text-slate-500" />
              <div className="text-xs leading-tight">
                <p className="font-semibold">Buy Safely with Riseflake.com</p>
                <p>We support secure payment methods</p>
              </div>
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-16">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4 sm:mb-2">My cart</h1>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#f0f4ff] to-[#f5f3ff] rounded-[16px] sm:rounded-[24px] p-3 sm:p-5 mb-4 sm:mb-10 shadow-xl shadow-indigo-100/50 border border-indigo-100">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-6 px-1 sm:px-2">
              <div className="flex items-center gap-3 sm:gap-5">
                <div className="flex-shrink-0 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-indigo-100 shadow-sm">
                  <div className="relative">
                    <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-[#4f46e5]" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3.5 sm:w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 bg-indigo-500"></span>
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#4f46e5] text-white text-[8px] sm:text-[10px] font-black px-1.5 sm:py-0.5 rounded uppercase tracking-tighter">
                      Limited Time
                    </span>
                    <h3 className="text-[#1e1b4b] font-black text-base sm:text-xl tracking-tight leading-none">BOLDSALE26</h3>
                  </div>
                  <p className="text-[#4338ca] text-[12px] sm:text-base font-bold">
                    Extra 25% Off Applied!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-indigo-100 w-full lg:w-auto justify-center shadow-sm">
                <div className="text-right pr-4 border-r border-indigo-100 hidden sm:block">
                  <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1 text-center">Active Offer</span>
                  <span className="block text-xs text-[#1e1b4b] font-bold opacity-80 italic">Save ₹{inr(saving)} Instantly</span>
                </div>
                <div className="flex items-center gap-4 lg:gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[20px] sm:text-[28px] font-black text-[#4f46e5] leading-none tabular-nums tracking-tighter">
                      {formatTime(timeLeft)}
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">Minutes left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_420px] gap-6">
            <div className="space-y-5">
              {configFailed && (
                <div className="rounded-3xl bg-white border border-slate-200 p-6">
                  <p className="text-slate-700">We could not load the plans right now.</p>
                  <button type="button" onClick={loadConfig} className="mt-2 font-semibold text-[#2f5ee7] cursor-pointer">
                    Try again
                  </button>
                </div>
              )}
              {loadingPlans
                ? Array.from({ length: 2 }).map((_, index) => (
                  <div key={`plan-skeleton-${index}`} className="rounded-3xl bg-white border border-slate-200 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="skeleton-shimmer mt-1 h-4 w-4 rounded-full" />
                        <div className="w-full max-w-md">
                          <div className="skeleton-shimmer h-8 w-44 rounded-lg" />
                          <div className="mt-4 space-y-2">
                            <div className="skeleton-shimmer h-4 w-56 rounded" />
                            <div className="skeleton-shimmer h-4 w-48 rounded" />
                          </div>
                        </div>
                      </div>
                      <div className="skeleton-shimmer h-10 w-28 rounded-lg" />
                    </div>
                  </div>
                ))
                : plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <label
                      key={plan.id}
                      className={`relative block rounded-3xl bg-white border p-6 cursor-pointer transition-all duration-300 transform ${isSelected
                        ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl -translate-y-1'
                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-lg'
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-white uppercase tracking-wider z-10 animate-bounce">
                          🔥 Selected Best Value
                        </div>
                      )}
                      {!isSelected && plan.id !== plans[0].id && (
                        <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-full">
                          RECOMMENDED
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-4">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className={`mt-1.5 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <input
                            type="radio"
                            name="selectedPlan"
                            className="hidden"
                            checked={isSelected}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                              if (event.target.checked) {
                                setSelectedPlanId(plan.id);
                              }
                            }}
                          />
                          <div>
                            <p className={`text-xl sm:text-2xl font-bold transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                              {plan.title}
                            </p>
                            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-600">
                              {planFeatures(plan).map((feature) => (
                                <li key={feature} className="flex items-center gap-2.5">
                                  <div className="flex-shrink-0 bg-emerald-100 rounded-full p-0.5">
                                    <Check className="h-3 w-3 text-emerald-600" />
                                  </div>
                                  <span className="font-medium text-slate-700">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="w-full sm:w-auto text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-0">
                          <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-md sm:mb-2 border border-emerald-100 uppercase">
                            SAVE 25%
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-[10px] sm:text-xs font-bold text-slate-400 line-through mb-0.5 tracking-tight">
                              MRP ₹{inr(mrpOf(plan.price))}
                            </p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">₹{inr(Number(plan.price))}</span>
                              <span className="text-[10px] sm:text-xs font-bold text-slate-500">/{plan.interval}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
            </div>

            <aside>
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sticky top-28">
                {loadingPlans || !selectedPlan ? (
                  <>
                    <div className="skeleton-shimmer h-10 w-44 rounded-lg" />
                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="skeleton-shimmer h-5 w-20 rounded" />
                        <div className="skeleton-shimmer h-5 w-16 rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="skeleton-shimmer h-5 w-24 rounded" />
                        <div className="skeleton-shimmer h-5 w-16 rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="skeleton-shimmer h-5 w-28 rounded" />
                        <div className="skeleton-shimmer h-5 w-16 rounded" />
                      </div>
                    </div>
                    <div className="mt-5 border-t border-slate-200 pt-4 flex items-center justify-between">
                      <div className="skeleton-shimmer h-7 w-44 rounded" />
                      <div className="skeleton-shimmer h-7 w-20 rounded" />
                    </div>
                    <div className="skeleton-shimmer mt-5 h-12 w-full rounded-full" />
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl sm:text-3xl font-semibold">Price details</h3>
                    <div className="mt-5 space-y-3 text-slate-700">
                      <div className="flex items-center justify-between">
                        <span>MRP Total</span>
                        <span className="plans-currency line-through text-slate-400">
                          ₹ {inr(mrp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-600 font-medium">
                        <span>Discount (BOLDSALE26)</span>
                        <span className="plans-currency">-₹ {inr(saving)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <span className="plans-currency">₹ {discount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Estimated GST</span>
                        <span className="plans-currency">₹ {tax}</span>
                      </div>
                    </div>
                    <div className="mt-5 border-t border-slate-200 pt-4 flex items-center justify-between font-semibold text-1xl">
                      <span>Total payable amount</span>
                      <span className="plans-currency">₹ {inr(total)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleContinueFromCart}
                      disabled={loadingPlans || processingPayment || paymentCompleted}
                      className="mt-5 w-full rounded-full bg-[#2f5ee7] text-white py-3 font-semibold cursor-pointer disabled:opacity-70"
                    >
                      {processingPayment
                        ? 'Processing...'
                        : paymentCompleted
                          ? 'Completed'
                          : hasAccess
                            ? 'Open Resume Builder'
                            : paymentRetryMode
                              ? 'Retry Payment'
                              : 'Continue'}
                    </button>
                    {paymentRetryMode && !processingPayment && (
                      <p className="mt-3 text-sm text-amber-700">
                        Your previous payment was not completed. Click <span className="font-semibold">Retry Payment</span>{' '}
                        to try again.
                      </p>
                    )}
                    {awaitingActivation && (
                      <p className="mt-3 text-sm text-amber-700">
                        Your payment went through and your subscription is still being activated.{' '}
                        <button type="button" onClick={waitForActivation} className="font-semibold underline cursor-pointer">
                          Check again
                        </button>
                      </p>
                    )}
                    {hasAccess ? (
                      <p className="mt-3 text-center text-sm text-slate-600">
                        You are on {access?.plan?.title}.{' '}
                        <a href={MANAGE_SUBSCRIPTION_URL} className="font-semibold text-[#2f5ee7] hover:underline">
                          Manage subscription
                        </a>
                      </p>
                    ) : (
                      !loginCompleted && (
                        <p className="mt-3 text-center text-sm text-slate-600">
                          Already on Riseflake?{' '}
                          <button
                            type="button"
                            onClick={() => openAuthDrawer('login')}
                            className="font-semibold text-[#2f5ee7] hover:underline cursor-pointer"
                          >
                            Login with Riseflake
                          </button>
                        </p>
                      )
                    )}
                  </>
                )}
              </div>
            </aside>
          </div>

          {error && <p className="mt-5 text-red-600 text-sm">{error}</p>}
        </section>

        <LandingFooter />

        {authMode && (
          <AuthSheet mode={authMode} onModeChange={setAuthMode} onClose={closeAuthDrawer} onSignedIn={handleSignedIn} />
        )}

        <style jsx global>{`
          .plans-font {
            font-family: 'Inter', 'Noto Sans', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          }
          .plans-currency {
            font-family: 'Noto Sans', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            font-variant-numeric: tabular-nums;
          }
          .plans-scroll-thin {
            scrollbar-width: thin;
            scrollbar-color: #f8fafc transparent;
          }
          .plans-scroll-thin::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .plans-scroll-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .plans-scroll-thin::-webkit-scrollbar-thumb {
            background: #f8fafc;
            border-radius: 9999px;
          }
          .skeleton-shimmer {
            position: relative;
            overflow: hidden;
            background: #e2e8f0;
          }
          .skeleton-shimmer::after {
            content: '';
            position: absolute;
            inset: 0;
            transform: translateX(-100%);
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.65), transparent);
            animation: plans-shimmer 1.1s infinite;
          }
          @keyframes plans-shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </main>
    </>
  );
};

export default PlansPage;
