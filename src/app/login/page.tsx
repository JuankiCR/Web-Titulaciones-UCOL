"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import FormCard from '@components/Cards/FormCard/FormCard';

import RedirectByRole from '@/utils/RedirectByRole/RedirectByRole';
import useUserStore from '@/store/ucol/userStore';

import styles from './page.module.scss';

interface JwtPayload {
  exp: number;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const user = useUserStore((state) => state.user);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const setUser = useUserStore((state) => state.setUser);
  const setSeeYouName = useUserStore((state) => state.setSeeYouName);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.user.status != 'VERIFIED') {
          alert('Tu cuenta aún no ha sido verificada. Por favor, espera a que un administrador la apruebe.');
          return;
        }

        setUser(data.user);
        setSeeYouName(data.user.name);
        localStorage.setItem('authToken', data.token);

        RedirectByRole({ role: data.user.role, navigate: router.push });
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch {
      setError('Hubo un error al intentar iniciar sesión. Por favor, intenta nuevamente.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);

    const handlePopState = () => {
      history.pushState(null, '', window.location.href);
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!authToken || !user) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(authToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem('authToken');
        router.push('/login');
        return;
      }

      RedirectByRole({ role: user.role, navigate: router.push });
    } catch {
      localStorage.removeItem('authToken');
      router.push('/login');
    }
  }, [router, authToken, user]);

  

  return (
    <FormCard>
      <h2 className={styles.formTitle}>Iniciar Sesión</h2>
      <form className={styles.formWrapper} onSubmit={handleLogin}>
        <div className={styles.formInputWrapper}>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formInputWrapper}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Iniciar Sesión</button>
        <p>
          ¿No tienes una cuenta? 
          <a href="/register">Regístrate aquí</a>
        </p>
      </form>
    </FormCard>
  );
}
