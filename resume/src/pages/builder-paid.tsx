import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import BuilderLayout from '@/modules/builder/BuilderLayout';
import { withBasePath } from '@/utils/withBasePath';
import { useAuthStore } from '@/stores/auth.store';

const BuilderPaidPage: NextPage = () => {
  const router = useRouter();
  const ready = useAuthStore((state) => state.ready);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasAccess = useAuthStore((state) => Boolean(state.access?.has_access));

  useEffect(() => {
    if (!ready || hasAccess) return;
    router.replace(isAuthenticated ? '/plans' : '/plans?auth=login');
  }, [ready, hasAccess, isAuthenticated, router]);

  return (
    <div>
      <Head>
        <title>Riseflake Resume Builder</title>
        <meta name="description" content="Riseflake Resume Builder" />
        <link rel="icon" type="image/png" href={withBasePath('/hero.jpg')} />
      </Head>

      {ready && hasAccess ? (
        <BuilderLayout mode="paid" />
      ) : (
        <p className="p-10 text-center text-slate-500">Checking your subscription...</p>
      )}
    </div>
  );
};

export default BuilderPaidPage;
