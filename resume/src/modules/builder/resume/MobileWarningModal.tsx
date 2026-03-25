'use client';

import { useEffect } from 'react';
import Portal from './components/Portal';

type Props = {
  onContinue: () => void;
  onGoBack: () => void;
};

export default function MobileWarningModal({ onContinue, onGoBack }: Props) {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      document.documentElement.style.setProperty('--m-x', `${x}px`);
      document.documentElement.style.setProperty('--m-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <main className="relative w-full min-h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-10 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-10 left-4 sm:top-20 sm:left-10 w-40 h-40 sm:w-72 sm:h-72 bg-indigo-200 rounded-full blur-xl opacity-30 animate-blob"
              style={{ transform: `translate(var(--m-x), var(--m-y))` }}
            />
            <div
              className="absolute top-28 right-4 sm:top-40 sm:right-10 w-40 h-40 sm:w-72 sm:h-72 bg-purple-200 rounded-full blur-xl opacity-30 animate-blob animation-delay-2000"
              style={{ transform: `translate(calc(var(--m-x) * -1), calc(var(--m-y) * -1))` }}
            />
          </div>

          <div className="relative z-10 max-w-xl w-full">
            <div className="mb-6 sm:mb-8 flex justify-center animate-float ">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-9 h-9 sm:w-14 sm:h-14 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl leading-tight font-bold text-gray-900 mb-3 sm:mb-4 animate-fade-in-up">
              Better experience on Desktop
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 animate-fade-in-up animation-delay-200">
              The resume builder is optimized for larger screens. You can continue on mobile, but
              editing may feel limited.
            </p>

            <div className="flex flex-col gap-3 mb-8 sm:mb-10 animate-fade-in-up animation-delay-400">
              <button
                onClick={onContinue}
                className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg active:scale-95 transition-transform text-base sm:text-lg"
              >
                Skip & Continue →
              </button>

              <button
                onClick={onGoBack}
                className="w-full py-3.5 sm:py-4 rounded-xl bg-white border border-gray-200 text-gray-900 font-semibold shadow-sm active:scale-95 transition-transform text-base sm:text-lg"
              >
                ← Go Back
              </button>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-indigo-50 animate-fade-in-up animation-delay-600">
              <h3 className="font-semibold mb-2 sm:mb-3 text-gray-800 text-lg sm:text-xl">Why Desktop?</h3>
              <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm md:text-base text-gray-500">
                <span>• Side-by-side editing</span>
                <span>• Live resume preview</span>
                <span>• Faster workflow</span>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes blob {
              0%,
              100% {
                transform: scale(1);
              }
              33% {
                transform: scale(1.1) translate(10px, -10px);
              }
              66% {
                transform: scale(0.9) translate(-10px, 10px);
              }
            }
            @keyframes float {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-15px);
              }
            }
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
            .animate-fade-in-up {
              animation: fade-in-up 0.6s ease forwards;
            }
            .animation-delay-200 {
              animation-delay: 0.2s;
              opacity: 0;
            }
            .animation-delay-400 {
              animation-delay: 0.4s;
              opacity: 0;
            }
            .animation-delay-600 {
              animation-delay: 0.6s;
              opacity: 0;
            }
          `}</style>
        </main>
      </div>
    </Portal>
  );
}
