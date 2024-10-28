// src/services/titulaciones/comiteService.ts
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface Comite {
  _id: string;
  numeroTrabajador: string;
  nombre: string;
  carrera: string;
  facultad: string;
}

const comiteFilePath = path.join(process.cwd(), 'src', 'data', 'titulaciones', 'comite.json');

const saveComite = (comite: Comite[]) => {
  fs.writeFileSync(comiteFilePath, JSON.stringify(comite, null, 2), 'utf-8');
};

export const getComite = (): Comite[] => {
  try {
    const data = fs.readFileSync(comiteFilePath, 'utf-8');
    return JSON.parse(data) as Comite[];
  } catch {
    return [];
  }
};

export const createComite = (numeroTrabajador: string, nombre: string, carrera: string, facultad: string): Comite => {
  const comite = getComite();
  const newComite: Comite = {
    _id: uuidv4(),
    numeroTrabajador,
    nombre,
    carrera,
    facultad,
  };
  comite.push(newComite);
  saveComite(comite);
  return newComite;
};

export const updateComite = (id: string, updatedData: Partial<Comite>): Comite | null => {
  const comite = getComite();
  const index = comite.findIndex((member) => member._id === id);
  if (index === -1) return null;
  comite[index] = { ...comite[index], ...updatedData };
  saveComite(comite);
  return comite[index];
};

export const deleteComite = (id: string): boolean => {
  const comite = getComite();
  const updatedComite = comite.filter((member) => member._id !== id);
  if (comite.length === updatedComite.length) return false;
  saveComite(updatedComite);
  return true;
};

export const getComiteById = (id: string): Comite | null => {
  const comite = getComite();
  return comite.find((member) => member._id === id) || null;
};
