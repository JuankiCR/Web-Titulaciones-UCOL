// src/pages/api/titulaciones/comite.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createComite, getComite, updateComite, deleteComite, getComiteById } from '@/services/titulaciones/comiteService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      if (req.query.id) {
        const comite = getComiteById(req.query.id as string);
        if (comite) {
          res.status(200).json(comite);
        } else {
          res.status(404).json({ message: 'Miembro del comité no encontrado' });
        }
      } else {
        res.status(200).json(getComite());
      }
      break;
    case 'POST':
      const { numeroTrabajador, nombre, carrera, facultad } = req.body;
      if (!numeroTrabajador || !nombre || !carrera || !facultad) {
        res.status(400).json({ message: 'Faltan datos requeridos' });
        return;
      }
      const newComite = createComite(numeroTrabajador, nombre, carrera, facultad);
      res.status(201).json(newComite);
      break;
    case 'PUT':
      const updatedComite = updateComite(req.query.id as string, req.body);
      if (updatedComite) {
        res.status(200).json(updatedComite);
      } else {
        res.status(404).json({ message: 'Miembro del comité no encontrado' });
      }
      break;
    case 'DELETE':
      const isDeleted = deleteComite(req.query.id as string);
      if (isDeleted) {
        res.status(200).json({ message: 'Miembro del comité eliminado' });
      } else {
        res.status(404).json({ message: 'Miembro del comité no encontrado' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
