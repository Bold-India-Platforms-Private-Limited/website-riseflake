import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { consumeDownloadClick, getCurrentPlan, PaymentSnapshot } from '@/lib/authApi';
import { useAuthStore } from '@/stores/auth.store';

const PaidPlanBanner = () => {
  const token = useAuthStore((state) => state.token);
  const [payment, setPayment] = useState<PaymentSnapshot | null>(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const isHandlingShortcutRef = useRef(false);

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);

      if (!token) {
        setHasActivePlan(false);
        setPayment(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCurrentPlan(token);
        setHasActivePlan(response.hasActivePlan);
        setPayment(response.payment);
      } catch (_error) {
        setHasActivePlan(false);
        setPayment(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();

    const listener = () => {
      fetchPlan();
    };

    window.addEventListener('payment-plan-updated', listener);

    return () => {
      window.removeEventListener('payment-plan-updated', listener);
    };
  }, [token]);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      return;
    }

    setIsVisible(true);

    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, 20000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isLoading, hasActivePlan, payment, token]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!bannerRef.current) {
        return;
      }

      if (!bannerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('touchstart', handleOutsideClick);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isVisible]);

  useEffect(() => {
    const hasValidPaidAccess = Boolean(token && hasActivePlan && payment);

    const handleKeyDown = async (event: KeyboardEvent) => {
      const isPrintShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p';

      if (!isPrintShortcut) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (isHandlingShortcutRef.current) {
        return;
      }

      if (hasValidPaidAccess && token) {
        isHandlingShortcutRef.current = true;

        try {
          await consumeDownloadClick(token);
          window.dispatchEvent(new Event('payment-plan-updated'));
          window.print();
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Your paid plan has expired. Please renew to download/print resume.';
          toast.error(message);
          window.dispatchEvent(new Event('payment-plan-updated'));
        } finally {
          isHandlingShortcutRef.current = false;
        }

        return;
      }

      toast.error(
        <div className="flex flex-col gap-2">
          <span>No active paid plan found. Please renew to download/print resume.</span>
          <Link href="/plans" className="text-white bg-red-600 px-3 py-1 rounded text-center font-bold text-xs hover:bg-red-700">
            Buy Plan
          </Link>
        </div>,
        { duration: 5000 }
      );
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [token, hasActivePlan, payment]);

  if (!isVisible) {
    return null;
  }

  if (isLoading) {
    return (
      <div
        ref={bannerRef}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1rem)] w-fit rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-md print:hidden"
      >
        Loading plan details...
      </div>
    );
  }

  if (!token) {
    return (
      <div
        ref={bannerRef}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1rem)] w-fit rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-md print:hidden"
      >
        Login required for paid downloads. <Link href="/plans?auth=login" className="underline">Login</Link>
      </div>
    );
  }

  if (!hasActivePlan || !payment) {
    return (
      <div
        ref={bannerRef}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1rem)] w-fit rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg print:hidden flex items-center gap-3"
      >
        <span>No active paid plan found. Buy plan again to continue.</span>
        <Link
          href="/plans"
          className="bg-red-600 text-white px-3 py-1.5 rounded-md font-bold text-xs hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap"
        >
          Buy Plan
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={bannerRef}
      className="fixed top-16 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1rem)] w-fit rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-md print:hidden"
    >
      {payment.plan_name}: {payment.downloads_left} downloads left · valid till{' '}
      {new Date(payment.end_time).toLocaleString()}
    </div>
  );
};

export default PaidPlanBanner;
