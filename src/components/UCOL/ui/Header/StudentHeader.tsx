"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import useUserStore from '@/store/ucol/userStore';
import Logo from '@logos/ucol_titulaciones.svg';
import styles from './TeacherHeader.module.scss';

const Header: React.FC = () => {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userName = user?.name.split(' ')[0];

  const isActive = (currentPath: string) => pathname === currentPath;

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

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
              className={isActive('/ucol/titulaciones/student/home') ? styles.active : ''}
              href="/ucol/titulaciones/student/home"
            >
              Dashboard
            </a>
          </li>
        </ul>
      </nav>

      <div className={styles.userContainer}>
        <div 
          className={styles.userAvatar}
          onClick={handleToggleMenu}
          ref={menuRef}  
        >
          <span>{'Hola, '}</span>
          <span>{ userName }</span>
          <span>{' ▼'}</span>

          <div className={`${styles.userMenu} ${isMenuOpen ? styles.show : ''}`}>
            <ul>
              <li>
                <a href="/ucol/logout">Cerrar sesión</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
