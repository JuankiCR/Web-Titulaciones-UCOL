import { NextApiRequest, NextApiResponse } from 'next';
import { getFacultyById, updateFaculty, deleteFaculty } from '@/services/titulaciones/facultyService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (req.method === 'GET') {
      const faculty = getFacultyById(id as string);

      if (!faculty) {
        return res.status(404).json({ error: 'Facultad no encontrada.' });
      }

      res.status(200).json(faculty);
    } else if (req.method === 'PUT') {
      const updatedFaculty = req.body;

      updateFaculty(id as string, updatedFaculty);
      res.status(200).json({ message: 'Facultad actualizada correctamente.' });
    } else if (req.method === 'DELETE') {
      deleteFaculty(id as string);
      res.status(200).json({ message: 'Facultad eliminada correctamente.' });
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Error desconocido';
    res.status(500).json({ error: 'Error del servidor.', details: errorMessage });
  }
}
