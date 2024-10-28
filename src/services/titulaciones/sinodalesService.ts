// src/services/titulaciones/sinodalesService.ts
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface Sinodal {
  _id: string;
  numeroTrabajador: string;
  nombre: string;
  carrera: string;
  facultad: string;
  rol: 'Presidente/a' | 'Secretario/a' | 'Vocal';
}

const sinodalesFilePath = path.join(process.cwd(), 'src', 'data', 'titulaciones', 'sinodales.json');

const saveSinodales = (sinodales: Sinodal[]) => {
  fs.writeFileSync(sinodalesFilePath, JSON.stringify(sinodales, null, 2), 'utf-8');
};

export const getSinodales = (): Sinodal[] => {
  try {
    const data = fs.readFileSync(sinodalesFilePath, 'utf-8');
    return JSON.parse(data) as Sinodal[];
  } catch {
    return [];
  }
};

export const createSinodal = (numeroTrabajador: string, nombre: string, carrera: string, facultad: string, rol: 'Presidente/a' | 'Secretario/a' | 'Vocal'): Sinodal => {
  const sinodales = getSinodales();
  const newSinodal: Sinodal = {
    _id: uuidv4(),
    numeroTrabajador,
    nombre,
    carrera,
    facultad,
    rol,
  };
  sinodales.push(newSinodal);
  saveSinodales(sinodales);
  return newSinodal;
};

export const updateSinodal = (id: string, updatedData: Partial<Sinodal>): Sinodal | null => {
  const sinodales = getSinodales();
  const index = sinodales.findIndex((sinodal) => sinodal._id === id);
  if (index === -1) return null;
  sinodales[index] = { ...sinodales[index], ...updatedData };
  saveSinodales(sinodales);
  return sinodales[index];
};

export const deleteSinodal = (id: string): boolean => {
  const sinodales = getSinodales();
  const updatedSinodales = sinodales.filter((sinodal) => sinodal._id !== id);
  if (sinodales.length === updatedSinodales.length) return false;
  saveSinodales(updatedSinodales);
  return true;
};

export const getSinodalById = (id: string): Sinodal | null => {
  const sinodales = getSinodales();
  return sinodales.find((sinodal) => sinodal._id === id) || null;
};