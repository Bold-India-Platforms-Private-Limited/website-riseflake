import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import PhoneInput from 'react-phone-input-2';
import { Check, CheckCircle2, ShieldCheck, X, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import LandingFooter from '@/components/landing/LandingFooter';
import {
  createOrder,
  getCurrentPlan,
  getPlans,
  loginUser,
  registerUser,
  verifyOrderPayment,
  forgotPassword,
  type PlanItem,
} from '@/lib/authApi';
import { useAuthStore } from '@/stores/auth.store';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { withBasePath } from '@/utils/withBasePath';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const defaultPlans: PlanItem[] = [
  {
    id: 1,
    name: 'Starter Plan',
    price: 299,
    currency: 'INR',
    durationHours: 24,
    maxResumeDownload: 5,
  },
  {
    id: 2,
    name: 'Pro Plan',
    price: 499,
    currency: 'INR',
    durationHours: 24,
    maxResumeDownload: 20,
  },
];

const AUTH_DRAWER_TRANSITION_MS = 220;

const PlansPage = () => {
  const [plans, setPlans] = useState<PlanItem[]>(defaultPlans);
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlans[0].id);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cartCompleted, setCartCompleted] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentRetryMode, setPaymentRetryMode] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState('');

  const [authDrawerMounted, setAuthDrawerMounted] = useState(false);
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [forgotEmail, setForgotEmail] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerMobileNo, setRegisterMobileNo] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  const loginCompleted = Boolean(user && token);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) || plans[0],
    [plans, selectedPlanId]
  );

  const amount = Number(selectedPlan?.price || 0);
  const discount = 0;
  const tax = 0;
  const total = amount;

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await getPlans();
        if (response.plans?.length) {
          const sorted = [...response.plans].sort((a, b) => a.price - b.price);
          setPlans(sorted);
          setSelectedPlanId(sorted[0].id);
        }
      } catch (_error) {
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPlans();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const auth = router.query.auth;
    if (!auth || loginCompleted) return;

    if (auth === 'register' || auth === 'login') {
      setCartCompleted(true);
      openAuthDrawer(auth);
    }
  }, [router.isReady, router.query.auth, loginCompleted]);

  const openAuthDrawer = (mode: 'login' | 'register' | 'forgot') => {
    setAuthMode(mode);
    setStep(2);

    if (!authDrawerMounted) {
      setAuthDrawerMounted(true);
      window.setTimeout(() => setAuthDrawerOpen(true), 10);
      return;
    }

    setAuthDrawerOpen(true);
  };

  const closeAuthDrawer = () => {
    setAuthDrawerOpen(false);
    window.setTimeout(() => {
      setAuthDrawerMounted(false);
      setAuthMode('login');
    }, AUTH_DRAWER_TRANSITION_MS);
  };

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

  const openRazorpayCheckout = async (
    authToken: string,
    authUser: { full_name: string; email: string; mobile_no?: string | null } | null
  ) => {
    if (!selectedPlan) {
      throw new Error('Please select a plan.');
    }

    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded. Please refresh and try again.');
    }

    setProcessingPayment(true);
    setError('');
    setStep(3);
    setPaymentCompleted(false);

    try {
      const orderData = await createOrder(authToken, selectedPlan.id);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Riseflake Resume Builder',
        description: `${selectedPlan.name} Purchase`,
        order_id: orderData.order.id,
        prefill: {
          name: orderData.prefill?.name || authUser?.full_name || '',
          email: orderData.prefill?.email || authUser?.email || '',
          contact: orderData.prefill?.contact || authUser?.mobile_no || '',
        },
        theme: {
          color: '#2f5ee7',
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setIsVerifying(true);
          try {
            await verifyOrderPayment(authToken, response);
            setPaymentCompleted(true);
            setPaymentRetryMode(false);
            toast.success('Payment successful. Redirecting you in a few seconds...');

            window.setTimeout(async () => {
              await router.push('/builder-paid');
            }, 1800);
          } catch (verifyErr) {
            setIsVerifying(false);
            const message = verifyErr instanceof Error ? verifyErr.message : 'Payment verification failed.';
            toast.error(message);
            setError(message);
            setPaymentRetryMode(true);
          }
        },
        modal: {
          ondismiss: () => {
            const message = 'Payment failed or cancelled.';
            toast.error(message);
            setError(message);
            setPaymentRetryMode(true);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: { error?: { description?: string } }) => {
        const message = response?.error?.description || 'Payment failed. Please try again.';
        toast.error(message);
        setError(message);
        setPaymentRetryMode(true);
      });
      razorpay.open();
    } catch (payErr) {
      const message = payErr instanceof Error ? payErr.message : 'Unable to create payment order.';
      toast.error(message);
      setError(message);
      setPaymentRetryMode(true);
    } finally {
      setIsVerifying(false);
      setProcessingPayment(false);
    }
  };

  const handleContinueFromCart = async () => {
    setIsNavigating(true);
    setError('');
    setCartCompleted(true);

    if (!loginCompleted || !token || !user) {
      setIsNavigating(false);
      // Default to register unless explicitly set to login
      const preferredMode = router.query.auth === 'login' ? 'login' : 'register';
      openAuthDrawer(preferredMode);
      return;
    }

    try {
      const currentPlanResponse = await getCurrentPlan(token);
      if (currentPlanResponse.hasActivePlan) {
        await router.push('/builder-paid');
        return;
      }
    } catch (_error) {
    } finally {
      setIsNavigating(false);
    }

    await openRazorpayCheckout(token, user);
  };

  const handleInlineLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await loginUser({ email: loginEmail, password: loginPassword });
      if (response.user && response.token) {
        setUser(response.user, response.token);
        closeAuthDrawer();
        await openRazorpayCheckout(response.token, response.user);
      }
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Login failed.';
      setError(message);
    }
  };

  const handleInlineRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const normalizedMobileNo = registerMobileNo ? `+${registerMobileNo}` : '';
      const response = await registerUser({
        firstName: registerFirstName,
        lastName: registerLastName,
        email: registerEmail,
        mobileNo: normalizedMobileNo,
        password: registerPassword,
      });

      if (response.user && response.token) {
        setUser(response.user, response.token);
        closeAuthDrawer();
        await openRazorpayCheckout(response.token, response.user);
      }
    } catch (registerError) {
      const message = registerError instanceof Error ? registerError.message : 'Registration failed.';
      setError(message);
    }
  };

  const handleInlineForgot = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsNavigating(true);

    try {
      const response = await forgotPassword(forgotEmail);
      toast.success(response.message);
      setAuthMode('login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset link.';
      setError(message);
      toast.error(message);
    } finally {
      setIsNavigating(false);
    }
  };

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
                  <span className="block text-xs text-[#1e1b4b] font-bold opacity-80 italic">Save ₹150 Instantly</span>
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
                      {!isSelected && plan.id === 2 && (
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
                              {plan.name}
                            </p>
                            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-600">
                              <li className="flex items-center gap-2.5">
                                <div className="flex-shrink-0 bg-emerald-100 rounded-full p-0.5">
                                  <Check className="h-3 w-3 text-emerald-600" />
                                </div>
                                <span className="font-medium text-slate-700">Total <b>{plan.maxResumeDownload}</b> downloads</span>
                              </li>
                              <li className="flex items-center gap-2.5">
                                <div className="flex-shrink-0 bg-emerald-100 rounded-full p-0.5">
                                  <Check className="h-3 w-3 text-emerald-600" />
                                </div>
                                <span className="font-medium text-slate-700">ATS-friendly premium templates</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="w-full sm:w-auto text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-0">
                          <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-md sm:mb-2 border border-emerald-100 uppercase">
                            SAVE 25%
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-[10px] sm:text-xs font-bold text-slate-400 line-through mb-0.5 tracking-tight">
                              MRP ₹{plan.id === 1 ? '399' : '649'}
                            </p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">₹{Number(plan.price)}</span>
                              <span className="text-[10px] sm:text-xs font-bold text-slate-500">/one-time</span>
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
                {loadingPlans ? (
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
                          ₹ {selectedPlan.id === 1 ? '399' : '649'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-600 font-medium">
                        <span>Discount (BOLDSALE26)</span>
                        <span className="plans-currency">-₹ {selectedPlan.id === 1 ? '100' : '150'}</span>
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
                      <span className="plans-currency">₹ {total}</span>
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
                  </>
                )}
              </div>
            </aside>
          </div>

          {error && <p className="mt-5 text-red-600 text-sm">{error}</p>}
        </section>

        <LandingFooter />

        {authDrawerMounted && (
          <>
            <div
              className={`fixed inset-0 bg-slate-900/30 z-40 transition-opacity duration-200 ${authDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              onClick={closeAuthDrawer}
            />
            <aside
              className={`fixed right-0 top-0 z-50 h-full w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 overflow-y-auto transform transition-transform duration-200 ${authDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {authMode === 'login' ? 'Login' : authMode === 'register' ? 'Register' : 'Reset Password'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (authMode === 'forgot') setAuthMode('login');
                      else setAuthMode(authMode === 'login' ? 'register' : 'login');
                    }}
                    className="text-[#2f5ee7] font-semibold text-sm cursor-pointer"
                  >
                    {authMode === 'login'
                      ? 'Register for free'
                      : authMode === 'register'
                        ? 'Already have an account? Login'
                        : 'Back to Login'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={closeAuthDrawer}
                  className="p-1 text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                {authMode === 'login' ? (
                  <form className="space-y-4" onSubmit={handleInlineLogin}>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Email ID</label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setLoginEmail(event.target.value)}
                        placeholder="Enter your email"
                        className="w-full mt-2 rounded-lg border border-slate-300 px-4 py-3"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Password</label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setLoginPassword(event.target.value)}
                        placeholder="Enter your password"
                        className="w-full mt-2 rounded-lg border border-slate-300 px-4 py-3"
                        required
                      />
                    </div>
                    <div className="flex justify-end -mt-2">
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-xs font-semibold text-[#2f5ee7] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#2f5ee7] text-white py-3 font-semibold cursor-pointer"
                    >
                      Login
                    </button>
                  </form>
                ) : authMode === 'register' ? (
                  <form className="space-y-4" onSubmit={handleInlineRegister}>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={registerFirstName}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setRegisterFirstName(event.target.value)
                        }
                        placeholder="First name"
                        className="rounded-lg border border-slate-300 px-4 py-3"
                        required
                      />
                      <input
                        type="text"
                        value={registerLastName}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setRegisterLastName(event.target.value)
                        }
                        placeholder="Last name"
                        className="rounded-lg border border-slate-300 px-4 py-3"
                        required
                      />
                    </div>
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setRegisterEmail(event.target.value)}
                      placeholder="Email"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3"
                      required
                    />
                    <PhoneInput
                      country={'in'}
                      value={registerMobileNo}
                      onChange={(value: string) => setRegisterMobileNo(value)}
                      inputProps={{ name: 'mobileNo', required: true }}
                      containerStyle={{ width: '100%' }}
                      inputStyle={{
                        width: '100%',
                        height: '46px',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                      }}
                      buttonStyle={{
                        borderTopLeftRadius: '0.5rem',
                        borderBottomLeftRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                      }}
                      dropdownStyle={{ zIndex: 100 }}
                    />
                    <input
                      type="password"
                      value={registerPassword}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setRegisterPassword(event.target.value)
                      }
                      placeholder="Password"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3"
                      required
                      minLength={6}
                    />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#2f5ee7] text-white py-3 font-semibold cursor-pointer"
                    >
                      Register
                    </button>
                  </form>
                ) : (
                  <form className="space-y-4" onSubmit={handleInlineForgot}>
                    <p className="text-sm text-slate-600 mb-4">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Email ID</label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setForgotEmail(event.target.value)}
                        placeholder="Enter your registered email"
                        className="w-full mt-2 rounded-lg border border-slate-300 px-4 py-3"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#2f5ee7] text-white py-3 font-semibold cursor-pointer"
                    >
                      Send Reset Link
                    </button>
                  </form>
                )}

                {error && (
                  <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <p className="text-sm font-medium text-red-800 leading-tight">
                      {error}
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </>
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
