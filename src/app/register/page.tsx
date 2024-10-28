"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import FormCard from '@components/Cards/FormCard/FormCard';

import styles from './page.module.scss';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, lastName }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch {
      setError('Hubo un error al intentar registrarse. Por favor, intenta nuevamente.');
    }
  };

  return (
    <FormCard>
      <h2 className={styles.formTitle}>Registrarse</h2>
      <form className={styles.formWrapper} onSubmit={handleRegister}>
        <div className={styles.formInputWrapper}>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formInputWrapper}>
          <label htmlFor="lastName">Apellidos:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Registrarse</button>
        <p>
          ¿Ya tienes una cuenta?
          <a href="/login">Inicia sesión aquí</a>
        </p>
      </form>
    </FormCard>
  );
}
