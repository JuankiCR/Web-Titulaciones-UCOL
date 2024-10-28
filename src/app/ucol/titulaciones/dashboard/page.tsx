"use client";
import React, { useState, useEffect } from "react";

import styles from "./styles.module.scss";

interface Alumno {
  _id: string;
  numeroCuenta: string;
  nombre: string;
  generacion: string;
  carrera: string;
  facultad: string;
}

interface Modalidad {
  _id: string;
  nombre: string;
  conDocumento: boolean;
  maximoEstudiantes: number;
}

interface Comite {
  _id: string;
  numeroTrabajador: string;
  nombre: string;
  carrera: string;
  facultad: string;
}

interface Sinodal {
  _id: string;
  numeroTrabajador: string;
  nombre: string;
  carrera: string;
  facultad: string;
  rol: "Presidente/a" | "Secretario/a" | "Vocal";
}

export default function Dashboard() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [comite, setComite] = useState<Comite[]>([]);
  const [sinodales, setSinodales] = useState<Sinodal[]>([]);

  useEffect(() => {
    fetch("/api/titulaciones/alumnos")
      .then((response) => response.json())
      .then((data) => setAlumnos(data.slice(0, 5)));

    fetch("/api/titulaciones/modalidades")
      .then((response) => response.json())
      .then((data) => setModalidades(data.slice(0, 5)));

    fetch("/api/titulaciones/comite")
      .then((response) => response.json())
      .then((data) => setComite(data.slice(0, 5)));

    fetch("/api/titulaciones/sinodales")
      .then((response) => response.json())
      .then((data) => setSinodales(data.slice(0, 5)));
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      {/* Tabla de Alumnos */}
      <div className={styles.sectionContainer}>
        <h2>Estudiantes</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cuenta</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno._id}>
                <td>{alumno.nombre}</td>
                <td>{alumno.numeroCuenta}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href="/ucol/titulaciones/entidades/estudiantes">
          <button className={styles.button}>Ver todos los estudiantes</button>
        </a>
      </div>

      {/* Tabla de Modalidades */}
      <div className={styles.sectionContainer}>
        <h2>Modalidades de Titulación</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Con Documento</th>
            </tr>
          </thead>
          <tbody>
            {modalidades.map((modalidad) => (
              <tr key={modalidad._id}>
                <td>{modalidad.nombre}</td>
                <td>{modalidad.conDocumento ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href="/ucol/titulaciones/entidades/modalidades">
          <button className={styles.button}>Ver todas las modalidades</button>
        </a>
      </div>

      {/* Tabla del Comité Revisor */}
      <div className={styles.sectionContainer}>
        <h2>Comité Revisor</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Número de Trabajador</th>
            </tr>
          </thead>
          <tbody>
            {comite.map((miembro) => (
              <tr key={miembro._id}>
                <td>{miembro.nombre}</td>
                <td>{miembro.numeroTrabajador}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href="/ucol/titulaciones/entidades/comite">
          <button className={styles.button}>Ver todo el comité revisor</button>
        </a>
      </div>

      {/* Tabla de Sinodales */}
      <div className={styles.sectionContainer}>
        <h2>Sinodales</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {sinodales.map((sinodal) => (
              <tr key={sinodal._id}>
                <td>{sinodal.nombre}</td>
                <td>{sinodal.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href="/ucol/titulaciones/entidades/sinodales">
          <button className={styles.button}>Ver todos los sinodales</button>
        </a>
      </div>
    </div>
  );
}
