// src/services/titulaciones/modalidadesService.ts
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface Modalidad {
  _id: string;
  nombre: string;
  conDocumento: boolean;
  maximoEstudiantes: number;
}

const modalidadesFilePath = path.join(process.cwd(), 'src', 'data', 'titulaciones', 'modalidades.json');

const saveModalidades = (modalidades: Modalidad[]) => {
  fs.writeFileSync(modalidadesFilePath, JSON.stringify(modalidades, null, 2), 'utf-8');
};

export const getModalidades = (): Modalidad[] => {
  try {
    const data = fs.readFileSync(modalidadesFilePath, 'utf-8');
    return JSON.parse(data) as Modalidad[];
  } catch {
    return [];
  }
};

export const createModalidad = (nombre: string, conDocumento: boolean, maximoEstudiantes: number): Modalidad => {
  const modalidades = getModalidades();
  const newModalidad: Modalidad = {
    _id: uuidv4(),
    nombre,
    conDocumento,
    maximoEstudiantes,
  };
  modalidades.push(newModalidad);
  saveModalidades(modalidades);
  return newModalidad;
};

export const updateModalidad = (id: string, updatedData: Partial<Modalidad>): Modalidad | null => {
  const modalidades = getModalidades();
  const index = modalidades.findIndex((modalidad) => modalidad._id === id);
  if (index === -1) return null;
  modalidades[index] = { ...modalidades[index], ...updatedData };
  saveModalidades(modalidades);
  return modalidades[index];
};

export const deleteModalidad = (id: string): boolean => {
  const modalidades = getModalidades();
  const updatedModalidades = modalidades.filter((modalidad) => modalidad._id !== id);
  if (modalidades.length === updatedModalidades.length) return false;
  saveModalidades(updatedModalidades);
  return true;
};

export const getModalidadById = (id: string): Modalidad | null => {
  const modalidades = getModalidades();
  return modalidades.find((modalidad) => modalidad._id === id) || null;
};