"use client";
import ComiteIcon from "@icons/ucol_comite.svg";
import EstudiantesIcon from "@icons/ucol_estudiantes.svg";
import ModalidadesIcon from "@icons/ucol_modalidades.svg";
import SinodalesIcon from "@icons/ucol_sinodales.svg";

import styles from "./styles.module.scss";

export default function Entidades() {
  return (
    <div className={styles.cardContainer}>
      <a
        href="/ucol/titulaciones/entidades/estudiantes" 
        className={styles.entityCard}
      >
        <EstudiantesIcon 
          style={{ 
            height: '64px',
            width: '64px',
          }}
        />
        <p>Estudiantes</p>
      </a>

      <a
        href="/ucol/titulaciones/entidades/modalidades" 
        className={styles.entityCard}
      >
        <ModalidadesIcon 
          style={{ 
            height: '64px',
            width: '64px',
          }}
        />
        <p>Modalidades</p>
      </a>

      <a
        href="/ucol/titulaciones/entidades/comite" 
        className={styles.entityCard}
      >
        <ComiteIcon 
          style={{ 
            height: '64px',
            width: '64px',
          }}
        />
        <p>Comité</p>
      </a>

      <a
        href="/ucol/titulaciones/entidades/sinodales" 
        className={styles.entityCard}
      >
        <SinodalesIcon 
          style={{ 
            height: '64px',
            width: '64px',
          }}
        />
        <p>Sinodales</p>
      </a>
    </div>
  );
}
