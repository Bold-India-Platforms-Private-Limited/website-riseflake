'use client';

import EditorLayout from './editor/EditorLayout';
import Image from 'next/image';
import NavBarLayout from './nav-bar/NavBarLayout';
import ResumeHeader from './resume/components/ResumeHeader';
import { ResumeLayout } from './resume/ResumeLayout';
import Tooltip from '@mui/material/Tooltip';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MobileWarningModal from './resume/MobileWarningModal';
import { BuilderMode, useTemplates } from '@/stores/useTemplate';
import PaidPlanBanner from './resume/components/PaidPlanBanner';
import { triggerResumePrint } from './nav-bar/components/PrintResume';

const MOBILE_SIZE = 768;

const BuilderLayout = ({ mode = 'free' }: { mode?: BuilderMode }) => {
  const [showMobileModal, setShowMobileModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    useTemplates.getState().configureBuilderMode(mode);
  }, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.matchMedia(`(max-width: ${MOBILE_SIZE - 1}px)`).matches;

    if (isMobile) {
      setShowMobileModal(true);
    }
  }, []);

  useEffect(() => {
    if (mode !== 'trial') {
      return;
    }

    const handlePrintShortcut = (event: KeyboardEvent) => {
      const isPrintShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p';

      if (!isPrintShortcut) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }
      triggerResumePrint('trial');
    };

    window.addEventListener('keydown', handlePrintShortcut, { capture: true });

    return () => {
      window.removeEventListener('keydown', handlePrintShortcut, { capture: true });
    };
  }, [mode]);

  const handleContinue = () => {
    setShowMobileModal(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      {showMobileModal && (
        <MobileWarningModal onContinue={handleContinue} onGoBack={handleGoBack} />
      )}

      <div className="flex flex-col h-screen">
        <NavBarLayout />
        {mode === 'paid' && <PaidPlanBanner />}

        <main className="flex flex-1 max-h-[calc(100vh-3.5rem)] print:max-h-fit">
          <div className="flex flex-col flex-1 justify-center bg-custom-grey100 print:bg-white">
            <header className="w-[210mm] mt-5 mb-3 mx-auto print:hidden">
              <ResumeHeader />
            </header>

            <div className="overflow-auto no-scrollbar">
              <ResumeLayout />
            </div>
          </div>

          <aside className="w-[25vw] min-w-[20rem] print:hidden">
            <EditorLayout />
          </aside>
        </main>

        <footer className="print:hidden">
          <Tooltip title="Share feedback">
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="fixed w-15 h-14 rounded-full bottom-15 left-10 flex justify-center items-center bg-resume-50 shadow-level-4dp"
            >
              <Image src="/icons/rate-review.svg" alt="Feedback button" width={24} height={24} />
            </a>
          </Tooltip>
        </footer>
      </div>
    </>
  );
};

export default BuilderLayout;
