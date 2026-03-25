import { useEffect } from 'react';
import { useRouter } from 'next/router';

const BuilderPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/builder-free');
  }, [router]);

  return null;
};

export default BuilderPage;
