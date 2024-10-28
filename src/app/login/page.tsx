"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import FormCard from '@components/Cards/FormCard/FormCard';

import styles from './page.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
        localStorage.setItem('authToken', data.token);
        console.log('Usuario autenticado:', data.user);
        router.push('/ucol/titulaciones/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch {
      setError('Hubo un error al intentar iniciar sesión. Por favor, intenta nuevamente.');
    }
  };

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
