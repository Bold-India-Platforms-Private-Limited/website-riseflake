import { MenuItem } from '@mui/material';
import { StyledButton } from '../atoms';
import { useResumeStore } from '@/stores/useResumeStore';
import { useTemplates } from '@/stores/useTemplate';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/stores/auth.store';
import { consumeDownloadClick } from '@/lib/authApi';
import { toast } from 'sonner';
import { BuilderMode } from '@/stores/useTemplate';
import { useBasicDetails } from '@/stores/basic';
import Link from 'next/link';

const TRIAL_WATERMARK_ID = 'trial-print-watermark-overlay';
const TRIAL_WATERMARK_STYLE_ID = 'trial-print-watermark-style';

const addTrialWatermark = () => {
  if (typeof window === 'undefined') {
    return () => { };
  }

  const existing = document.getElementById(TRIAL_WATERMARK_ID);
  if (existing) {
    return () => existing.remove();
  }

  const watermark = document.createElement('div');
  watermark.id = TRIAL_WATERMARK_ID;
  watermark.className = 'trial-print-watermark-overlay';
  watermark.setAttribute(
    'style',
    [
      'display: none',
      'position: fixed',
      'top: 40%',
      'left: -55%',
      'width: 210%',
      'transform: rotate(-33deg)',
      'text-align: center',
      'pointer-events: none',
      'z-index: 99999',
      'opacity: 0.2',
      'font-weight: 700',
      'letter-spacing: 4px',
      'color: #111827',
      'font-family: Inter, system-ui, sans-serif',
      'line-height: 1.25',
    ].join(';')
  );

  const line1 = document.createElement('div');
  line1.textContent = 'TRIAL MODE';
  line1.setAttribute('style', 'font-size: 116px;');

  const line2 = document.createElement('div');
  line2.textContent = 'riseflake.com/resume';
  line2.setAttribute('style', 'font-size: 64px; margin-top: 14px;');

  if (!document.getElementById(TRIAL_WATERMARK_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = TRIAL_WATERMARK_STYLE_ID;
    style.textContent = `
      @media screen {
        .trial-print-watermark-overlay {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
      }

      @media print {
        .trial-print-watermark-overlay {
          display: block !important;
          visibility: visible !important;
          opacity: 0.2 !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  watermark.appendChild(line1);
  watermark.appendChild(line2);
  document.body.appendChild(watermark);

  return () => {
    const node = document.getElementById(TRIAL_WATERMARK_ID);
    if (node) {
      node.remove();
    }
  };
};

const triggerPrintFlow = (builderMode: BuilderMode, resumeName?: string) => {
  const name = resumeName || useBasicDetails.getState().values.name || 'Resume';
  const today = new Date().toISOString().split('T')[0];
  const safeName = name.replace(/\s+/g, '_');
  const fileName = `${safeName}_Resume_${today}`;

  const originalTitle = document.title;
  document.title = fileName;

  const cleanupWatermark = builderMode === 'trial' ? addTrialWatermark() : () => { };
  const restore = () => {
    cleanupWatermark();
    document.title = originalTitle;
  };

  const handleAfterPrint = () => {
    restore();
    window.removeEventListener('afterprint', handleAfterPrint);
  };

  window.addEventListener('afterprint', handleAfterPrint);

  setTimeout(() => {
    window.print();
    setTimeout(restore, 1000);
  }, 100);
};

export const triggerResumePrint = (builderMode: BuilderMode) => {
  triggerPrintFlow(builderMode);
};

export const PrintResume: React.FC<{ isMenuButton?: boolean }> = ({ isMenuButton }) => {
  const resumeData = useResumeStore();
  const builderMode = useTemplates((state) => state.builderMode);
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const handlePrint = async () => {
    if (builderMode === 'paid') {
      if (!token) {
        toast.error('Please login first to continue.');
        router.push('/plans?auth=login');
        return;
      }

      try {
        await consumeDownloadClick(token);
        window.dispatchEvent(new Event('payment-plan-updated'));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to use download quota.';
        toast.error(
          <div className="flex flex-col gap-2">
            <span>{message}</span>
            <Link
              href="/plans"
              className="text-white bg-red-600 px-3 py-1 rounded text-center font-bold text-xs hover:bg-red-700 transition-colors"
            >
              Buy Plan
            </Link>
          </div>,
          { duration: 6000 }
        );
        window.dispatchEvent(new Event('payment-plan-updated'));
        return;
      }
    }

    triggerPrintFlow(builderMode, resumeData?.basics?.name);
  };

  if (isMenuButton) {
    return (
      <MenuItem onClick={handlePrint} sx={{ color: '#000000', fontWeight: 600 }}>
        Download as PDF
      </MenuItem>
    );
  }

  return (
    <StyledButton
      onClick={handlePrint}
      variant="contained"
      sx={{
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        fontWeight: 700,
        textTransform: 'none',
        px: 4,
        '&:hover': {
          backgroundColor: '#4338ca',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
        },
      }}
    >
      Download as PDF
    </StyledButton>
  );
};
