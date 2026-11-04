import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { formatDate, recordDownload } from '@/lib/authApi';
import { useAuthStore } from '@/stores/auth.store';
import { useTemplates } from '@/stores/useTemplate';

const BANNER_SECONDS = 12;

const PaidPlanBanner = () => {
  const plan = useAuthStore((state) => (state.access?.has_access ? state.access.plan : null));
  const [isVisible, setIsVisible] = useState(true);
  const printingRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), BANNER_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, []);

  // Ctrl/Cmd+P is a download too, so it gets the same check and the same log entry.
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'p') return;
      event.preventDefault();
      event.stopPropagation();
      if (printingRef.current) return;

      printingRef.current = true;
      try {
        await recordDownload(useTemplates.getState().activeTemplate?.id);
        window.print();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Could not start the download.');
      } finally {
        printingRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible || !plan) return null;

  return (
    <div className="fixed left-1/2 top-16 z-40 flex w-fit max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-md print:hidden">
      <span>
        {plan.title}: unlimited downloads, {plan.status === 'cancelled' ? 'ends' : 'renews'}{' '}
        {formatDate(plan.next_charge_at || plan.current_end)}
      </span>
      <Link href="/profile" className="font-semibold underline">
        Account
      </Link>
    </div>
  );
};

export default PaidPlanBanner;
