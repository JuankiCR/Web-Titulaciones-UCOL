import React from 'react';
import styles from './FormCard.module.scss';

interface FormCardProps {
  children: React.ReactNode;
}

const FormCard: React.FC<FormCardProps> = ({ children }) => {
  return (
    <div className={styles.FormCard}>
      {children}
    </div>
  );
};

export default FormCard;
