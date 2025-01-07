"use client";

import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import TableSkeleton from "@components/UCOL/ui/Skeletons/TableSkeleton";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

import styles from "./styles.module.scss";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [alumnosPorCarrera, setAlumnosPorCarrera] = useState<Record<string, number>>({});
  const [alumnosPorGeneracion, setAlumnosPorGeneracion] = useState<Record<string, number>>({});
  const [modalidadesPorTipo, setModalidadesPorTipo] = useState<Record<string, number>>({});
  const [sinodalesPorFacultad, setSinodalesPorFacultad] = useState<Record<string, number>>({});
  const [titulacionesPorModalidad, setTitulacionesPorModalidad] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/titulaciones/dashboard/alumnos/por_carrera")
        .then((response) => response.json())
        .then((data) => setAlumnosPorCarrera(data)),

      fetch("/api/titulaciones/dashboard/alumnos/por_generacion")
        .then((response) => response.json())
        .then((data) => setAlumnosPorGeneracion(data)),

      fetch("/api/titulaciones/dashboard/modalidades/por_tipo")
        .then((response) => response.json())
        .then((data) => setModalidadesPorTipo(data)),

      fetch("/api/titulaciones/dashboard/sinodales/por_facultad")
        .then((response) => response.json())
        .then((data) => setSinodalesPorFacultad(data)),

      fetch("/api/titulaciones/dashboard/titulaciones/por_modalidad")
        .then((response) => response.json())
        .then((data) => setTitulacionesPorModalidad(data)),
    ]).then(() => setLoading(false));
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      {/* Gráfico: Alumnos por Carrera */}
      <div className={styles.sectionContainer}>
        <h2>Distribución de Estudiantes por Carrera</h2>
        {loading ? (
          <TableSkeleton nHeaders={2} nRows={5} />
        ) : (
          <Bar
            data={{
              labels: Object.keys(alumnosPorCarrera),
              datasets: [
                {
                  label: "Estudiantes",
                  data: Object.values(alumnosPorCarrera),
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
            }}
          />
        )}
      </div>

      {/* Gráfico: Alumnos por Generación */}
      <div className={styles.sectionContainer}>
        <h2>Distribución de Estudiantes por Generación</h2>
        {loading ? (
          <TableSkeleton nHeaders={2} nRows={5} />
        ) : (
          <Bar
            data={{
              labels: Object.keys(alumnosPorGeneracion),
              datasets: [
                {
                  label: "Estudiantes",
                  data: Object.values(alumnosPorGeneracion),
                  backgroundColor: "rgba(153, 102, 255, 0.2)",
                  borderColor: "rgba(153, 102, 255, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
            }}
          />
        )}
      </div>

      {/* Gráfico: Modalidades por Tipo */}
      <div className={styles.sectionContainer}>
        <h2>Modalidades de Titulación</h2>
        {loading ? (
          <TableSkeleton nHeaders={2} nRows={5} />
        ) : (
          <Pie
            data={{
              labels: Object.keys(modalidadesPorTipo),
              datasets: [
                {
                  label: "Modalidades",
                  data: Object.values(modalidadesPorTipo),
                  backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
                  borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
            }}
          />
        )}
      </div>

      {/* Gráfico: Sinodales por Facultad */}
      <div className={styles.sectionContainer}>
        <h2>Sinodales por Facultad</h2>
        {loading ? (
          <TableSkeleton nHeaders={2} nRows={5} />
        ) : (
          <Bar
            data={{
              labels: Object.keys(sinodalesPorFacultad),
              datasets: [
                {
                  label: "Sinodales",
                  data: Object.values(sinodalesPorFacultad),
                  backgroundColor: "rgba(255, 159, 64, 0.2)",
                  borderColor: "rgba(255, 159, 64, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
            }}
          />
        )}
      </div>

      {/* Gráfico: Titulaciones por Modalidad */}
      <div className={styles.sectionContainer}>
        <h2>Titulaciones por Modalidad</h2>
        {loading ? (
          <TableSkeleton nHeaders={2} nRows={5} />
        ) : (
          <Bar
            data={{
              labels: Object.keys(titulacionesPorModalidad),
              datasets: [
                {
                  label: "Titulaciones",
                  data: Object.values(titulacionesPorModalidad),
                  backgroundColor: "rgba(255, 206, 86, 0.2)",
                  borderColor: "rgba(255, 206, 86, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
