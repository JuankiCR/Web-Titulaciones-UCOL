// pages/api/faculties/[facultyId]/careers/[careerId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getFacultyById, saveFaculties, getFaculties } from '@/services/titulaciones/facultyService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { facultyId, careerId } = req.query;

    // Validar parámetros
    if (!facultyId || !careerId) {
      return res.status(400).json({ error: 'Faltan parámetros (facultyId o careerId).' });
    }

    if (req.method === 'GET') {
      // Obtener la facultad por ID
      const faculty = getFacultyById(facultyId as string);
      if (!faculty) {
        return res.status(404).json({ error: 'Facultad no encontrada.' });
      }

      // Buscar la carrera dentro de la facultad
      const career = faculty.careers.find((c) => c._id === careerId);
      if (!career) {
        return res.status(404).json({ error: 'Carrera no encontrada.' });
      }

      res.status(200).json(career);

    } else if (req.method === 'DELETE') {
      // Obtener la facultad por ID
      const faculties = getFaculties();
      const facultyIndex = faculties.findIndex((f) => f._id === facultyId);

      if (facultyIndex === -1) {
        return res.status(404).json({ error: 'Facultad no encontrada.' });
      }

      const faculty = faculties[facultyIndex];

      // Filtrar las carreras eliminando la carrera específica
      const updatedCareers = faculty.careers.filter((c) => c._id !== careerId);

      // Si no se encontró la carrera, retornar error
      if (updatedCareers.length === faculty.careers.length) {
        return res.status(404).json({ error: 'Carrera no encontrada en esta facultad.' });
      }

      // Actualizar las carreras en la facultad y guardar
      faculties[facultyIndex].careers = updatedCareers;
      saveFaculties(faculties);

      res.status(200).json({ message: 'Carrera eliminada correctamente.' });

    } else {
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ error: 'Error del servidor.', details: errorMessage });
  }
}
