// src/components/Loader.tsx
import React from 'react';
import styles from './Loader.module.scss';

const Loader: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <p className={styles.text}>Cargando...</p>
    </div>
  );
};

export default Loader;
