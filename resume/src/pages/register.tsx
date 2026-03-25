import { useEffect } from 'react';
import { useRouter } from 'next/router';

const RegisterPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/plans?auth=register');
  }, [router]);

  return null;
};

export default RegisterPage;
