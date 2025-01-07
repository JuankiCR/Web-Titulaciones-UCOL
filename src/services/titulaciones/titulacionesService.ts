// src/services/titulaciones/titulacionesService.ts
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Alumno, Modalidad, Comite, Sinodal, Titulacion } from '../../types/ucolTypes';

const titulacionesFilePath = path.join(process.cwd(), 'src', 'data', 'titulaciones', 'titulaciones.json');

const saveTitulaciones = (titulaciones: Titulacion[]) => {
  fs.writeFileSync(titulacionesFilePath, JSON.stringify(titulaciones, null, 2), 'utf-8');
};

export const getTitulaciones = (): Titulacion[] => {
  try {
    const data = fs.readFileSync(titulacionesFilePath, 'utf-8');
    return JSON.parse(data) as Titulacion[];
  } catch {
    return [];
  }
};

export const createTitulacion = (
  modalidad: Modalidad,
  estudiantes: Alumno[],
  sinodales: Sinodal[],
  asesores: Comite[],
  documento: string | null,
  finalizada: boolean,
  fechaInicio: string,
  fechaFin?: string
): Titulacion => {
  const newTitulacion: Titulacion = {
    _id: uuidv4(),
    modalidadId: modalidad._id,
    estudiantes,
    sinodales,
    asesores,
    documento,
    finalizada,
    fechaInicio,
    fechaFin: fechaFin || null
  };
  
  const titulaciones = getTitulaciones();
  titulaciones.push(newTitulacion);
  saveTitulaciones(titulaciones);

  return newTitulacion;
};

