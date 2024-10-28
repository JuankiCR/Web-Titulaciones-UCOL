"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

import Logo from '@logos/ucol_titulaciones.svg';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const pathname = usePathname();

  const isActive = (currentPath: string) => pathname === currentPath;

  return (
    <header className={styles.headerContainer}>
      <div>
        <Logo
          style={{
            fill: 'var(--foreground-white)',
            height: '48px',
            width: '48px',
          }}
        />
      </div>

      <nav className={styles.navContainer}>
        <ul>
          <li>
            <a
              className={isActive('/ucol/titulaciones/dashboard') ? styles.active : ''}
              href="/ucol/titulaciones/dashboard"
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              className={isActive('/ucol/titulaciones/titulaciones') ? styles.active : ''}
              href="/ucol/titulaciones/titulaciones"
            >
              Titulaciones
            </a>
          </li>
          <li>
            <a
              className={isActive('/ucol/titulaciones/entidades') ? styles.active : ''}
              href="/ucol/titulaciones/entidades"
            >
              Entidades
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
