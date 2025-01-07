// src/pages/api/titulaciones/titulacion.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getTitulaciones, createTitulacion } from '../../../services/titulaciones/titulacionesService';
import { getModalidadById } from '../../../services/titulaciones/modalidadesService';
import { Alumno, Sinodal, Comite, Modalidad } from '../../../types/ucolTypes';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(getTitulaciones());
  }

  if (req.method === 'POST') {
    try {
      const { modalidadId, estudiantes, sinodales, asesores, documento, finalizada, fechaInicio, fechaFin } = req.body;

      if (!modalidadId) {
        return res.status(400).json({ error: 'modalidadId es requerido y no puede estar vacío' });
      }

      console.log("Modalidad ID recibido:", modalidadId);

      const modalidad = getModalidadById(modalidadId as string) as Modalidad;
      if (!modalidad) {
        console.log("Modalidad no encontrada para ID:", modalidadId);
        return res.status(404).json({ error: `Modalidad no encontrada: ${modalidadId}` });
      }

      const newTitulacionId = uuidv4();
      const newTitulacion = createTitulacion(
        modalidad,
        estudiantes as Alumno[],
        sinodales as Sinodal[],
        asesores as Comite[],
        null, // Documento será guardado después
        finalizada,
        fechaInicio,
        fechaFin
      );

      const documentosDir = path.join(process.cwd(), 'src', 'data', 'documentos');
      const documentoPath = path.join(documentosDir, `${newTitulacionId}.pdf`);

      if (!fs.existsSync(documentosDir)) {
        fs.mkdirSync(documentosDir, { recursive: true });
      }

      if (documento) {
        const base64Data = documento.split(";base64,").pop();
        fs.writeFileSync(documentoPath, base64Data, { encoding: 'base64' });
        newTitulacion.documento = documentoPath;
      }

      return res.status(201).json(newTitulacion);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Método ${req.method} no permitido`);
}
