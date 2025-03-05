'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import Loader from '@components/Loader/Loader';

import RedirectByRole from '@/utils/RedirectByRole/RedirectByRole';
import useUserStore from '@/store/ucol/userStore';

interface JwtPayload {
  exp: number;
}

export default function Home() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
  }, []);

  useEffect(() => {
    if (!authToken || !user) {
      router.replace('/login');
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(authToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem('authToken');
        router.replace('/login');
        return;
      }

      RedirectByRole({ role: user.role, navigate: router.replace });
    } catch {
      localStorage.removeItem('authToken');
      router.replace('/login');
    }
  }, [router, authToken, user]);

  return <Loader />;
}
