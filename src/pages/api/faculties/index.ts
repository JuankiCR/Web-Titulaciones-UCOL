import { NextApiRequest, NextApiResponse } from 'next';
import { getFaculties, addFaculty } from '@/services/titulaciones/facultyService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const faculties = getFaculties();
      res.status(200).json(faculties);
    } else if (req.method === 'POST') {
      const { _id, name, alias, careers } = req.body;

      if (!_id || !name || !alias) {
        return res.status(400).json({ error: 'Faltan parámetros obligatorios (_id, name, alias).' });
      }

      addFaculty({ _id, name, alias, careers: careers || [] });
      res.status(201).json({ message: 'Facultad creada correctamente.' });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ error: 'Error del servidor.', details: errorMessage });
  }
}
