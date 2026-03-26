import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import BuilderLayout from '@/modules/builder/BuilderLayout';
import { withBasePath } from '@/utils/withBasePath';
import { useAuthStore } from '@/stores/auth.store';
import { getCurrentPlan, getPublicBuilderSettings } from '@/lib/authApi';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

const BuilderFreePage: NextPage = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [freeBuilderEnabled, setFreeBuilderEnabled] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [checkingPlan, setCheckingPlan] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setSettingsLoading(true);
      try {
        const response = await getPublicBuilderSettings();
        setFreeBuilderEnabled(Boolean(response.settings.builder_free_visibility));
      } catch (_error) {
        setFreeBuilderEnabled(true);
      } finally {
        setSettingsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleGoToPaidBuilder = async () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Head>
        <title>Riseflake Resume Builder - Free</title>
        <meta name="description" content="Single Page Resume Builder - Free" />
        <link rel="icon" type="image/png" href={withBasePath('/hero.jpg')} />
      </Head>

      {settingsLoading ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm animate-pulse">
            <div className="h-8 w-72 bg-slate-200 rounded mx-auto" />
            <div className="h-4 w-80 bg-slate-100 rounded mx-auto mt-4" />
            <div className="h-10 w-48 bg-slate-200 rounded mx-auto mt-8" />
          </div>
        </div>
      ) : freeBuilderEnabled ? (
        <BuilderLayout mode="free" />
      ) : (
        <>
          <LandingNavbar />
          <main className="flex-1 flex items-center justify-center py-20 px-6">
            <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-12 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-8">
                <span className="text-4xl text-indigo-600">🚀</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Free Builder No longer available
              </h1>
              <p className="text-lg text-slate-600 mt-4 font-medium">
                Continue with paid builder access to unlock all resume features.
              </p>

              <Button
                variant="contained"
                onClick={handleGoToPaidBuilder}
                disabled={checkingPlan}
                size="large"
                className="!mt-10 !bg-gradient-to-r !from-indigo-600 !to-purple-600 !px-10 !py-4 !rounded-xl !font-bold !text-lg !shadow-xl hover:!shadow-2xl transition-all"
              >
                {checkingPlan ? 'Checking your plan...' : 'Go To Paid Builder'}
              </Button>
            </div>
          </main>
          <LandingFooter />
        </>
      )}
    </div>
  );
};

export default BuilderFreePage;
