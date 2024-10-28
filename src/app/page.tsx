"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import Loader from '@components/Loader/Loader';

interface JwtPayload {
  exp: number;
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
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
      router.replace('/ucol/titulaciones/dashboard');
    } catch {
      localStorage.removeItem('authToken');
      router.replace('/login');
    }
  }, [router]);

  return <Loader />;
}
