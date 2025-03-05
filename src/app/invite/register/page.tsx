'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import FormCard from '@components/Cards/FormCard/FormCard';

import styles from './page.module.scss';

interface Career {
  _id: string;
  name: string;
}

interface Faculty {
  _id: string;
  name: string;
  careers: Career[];
}

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [cuentaUCOL, setCuentaUCOL] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<string>('STUDENT');
  const [autoVerification, setAutoVerification] = useState<boolean>(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch('/api/faculties');
        if (!response.ok) throw new Error();
        const data = await response.json();
        setFaculties(data);
      } catch {
        setError('Error al cargar las facultades y carreras.');
      }
    };

    fetchFaculties();
  }, []);

  useEffect(() => {
    const token = searchParams?.get('token');
    if (!token) return;

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/invite/verify?token=${token}`);
        const data = await response.json();
        if (data.valid) {
          setRole(data.role);
          setAutoVerification(data.autoVerification);
        } else {
          setError('El enlace de invitación no es válido o ha expirado.');
        }
      } catch {
        setError('Error al verificar el token de invitación.');
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFaculty || !selectedCareer || !cuentaUCOL) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      const response = await fetch('/api/invite/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          lastName,
          facultyId: selectedFaculty,
          careerId: selectedCareer,
          cuentaUCOL,
          role,
          autoVerification,
        }),
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
          <label htmlFor="cuentaUCOL">Número de Cuenta:</label>
          <input
            type="text"
            id="cuentaUCOL"
            value={cuentaUCOL}
            onChange={(e) => setCuentaUCOL(e.target.value)}
            required
          />
        </div>
        <div className={styles.formInputWrapper}>
          <label htmlFor="faculty">Seleccionar Facultad:</label>
          <select
            id="faculty"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            required
          >
            <option value="">Selecciona una facultad</option>
            {faculties.map((faculty) => (
              <option key={faculty._id} value={faculty._id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>
        {selectedFaculty && (
          <div className={styles.formInputWrapper}>
            <label htmlFor="career">Seleccionar Carrera:</label>
            <select
              id="career"
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              required
            >
              <option value="">Selecciona una carrera</option>
              {faculties
                .find((faculty) => faculty._id === selectedFaculty)
                ?.careers.map((career) => (
                  <option key={career._id} value={career._id}>
                    {career.name}
                  </option>
                ))}
            </select>
          </div>
        )}
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
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </form>
    </FormCard>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
