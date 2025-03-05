import { NextApiRequest, NextApiResponse } from 'next';
import { addCareerToFaculty, deleteCareerFromFaculty } from '@/services/titulaciones/facultyService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { facultyId } = req.query;

    if (req.method === 'POST') {
      const { _id, name, alias } = req.body;

      if (!_id || !name || !alias) {
        return res.status(400).json({ error: 'Faltan parámetros obligatorios (_id, name, alias).' });
      }

      addCareerToFaculty(facultyId as string, { _id, name, alias });
      res.status(201).json({ message: 'Carrera agregada correctamente.' });
    } else if (req.method === 'DELETE') {
      const { careerId } = req.body;

      if (!careerId) {
        return res.status(400).json({ error: 'Faltan parámetros obligatorios (careerId).' });
      }

      deleteCareerFromFaculty(facultyId as string, careerId);
      res.status(200).json({ message: 'Carrera eliminada correctamente.' });
    } else {
      res.setHeader('Allow', ['POST', 'DELETE']);
      res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Error desconocido';
    res.status(500).json({ error: 'Error del servidor.', details: errorMessage });
  }
}
