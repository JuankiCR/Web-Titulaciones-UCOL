'use client';
import { useRouter } from 'next/navigation';

import NotFoundIllustration from "@icons/ucol_notfound.svg";

import styles from './not-found.module.scss';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Oops, no pudimos encontrar esta página.</p>
      <NotFoundIllustration
        style={{
          height: "256px",
          width: "256px",
        }}
      />
      <button onClick={() => router.back()} className={styles.button}>
        Volver atrás
      </button>
    </div>
  );
}
