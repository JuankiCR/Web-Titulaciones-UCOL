// src/services/titulaciones/alumnoService.ts
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface Alumno {
  _id: string;
  numeroCuenta: string;
  nombre: string;
  generacion: string;
  carrera: string;
  facultad: string;
}

const alumnosFilePath = path.join(process.cwd(), 'src', 'data', 'titulaciones', 'alumnos.json');


const saveAlumnos = (alumnos: Alumno[]) => {
  fs.writeFileSync(alumnosFilePath, JSON.stringify(alumnos, null, 2), 'utf-8');
};

export const getAlumnos = (): Alumno[] => {
  try {
    const data = fs.readFileSync(alumnosFilePath, 'utf-8');
    return JSON.parse(data) as Alumno[];
  } catch {
    return [];
  }
};

export const createAlumno = (numeroCuenta: string, nombre: string, generacion: string, carrera: string, facultad: string): Alumno => {
  const alumnos = getAlumnos();
  const newAlumno: Alumno = {
    _id: uuidv4(),
    numeroCuenta,
    nombre,
    generacion,
    carrera,
    facultad,
  };
  alumnos.push(newAlumno);
  saveAlumnos(alumnos);
  return newAlumno;
};

export const updateAlumno = (id: string, updatedData: Partial<Alumno>): Alumno | null => {
  const alumnos = getAlumnos();
  const index = alumnos.findIndex((alumno) => alumno._id === id);
  if (index === -1) return null;
  alumnos[index] = { ...alumnos[index], ...updatedData };
  saveAlumnos(alumnos);
  return alumnos[index];
};

export const deleteAlumno = (id: string): boolean => {
  const alumnos = getAlumnos();
  const updatedAlumnos = alumnos.filter((alumno) => alumno._id !== id);
  if (alumnos.length === updatedAlumnos.length) return false;
  saveAlumnos(updatedAlumnos);
  return true;
};

export const getAlumnoById = (id: string): Alumno | null => {
  const alumnos = getAlumnos();
  return alumnos.find((alumno) => alumno._id === id) || null;
};