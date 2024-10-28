// src/pages/api/titulaciones/sinodales.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createSinodal, getSinodales, updateSinodal, deleteSinodal, getSinodalById } from '@/services/titulaciones/sinodalesService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      if (req.query.id) {
        const sinodal = getSinodalById(req.query.id as string);
        if (sinodal) {
          res.status(200).json(sinodal);
        } else {
          res.status(404).json({ message: 'Sinodal no encontrado' });
        }
      } else {
        res.status(200).json(getSinodales());
      }
      break;
    case 'POST':
      const { numeroTrabajador, nombre, carrera, facultad, rol } = req.body;
      if (!numeroTrabajador || !nombre || !carrera || !facultad || !rol) {
        res.status(400).json({ message: 'Faltan datos requeridos' });
        return;
      }
      const newSinodal = createSinodal(numeroTrabajador, nombre, carrera, facultad, rol);
      res.status(201).json(newSinodal);
      break;
    case 'PUT':
      const updatedSinodal = updateSinodal(req.query.id as string, req.body);
      if (updatedSinodal) {
        res.status(200).json(updatedSinodal);
      } else {
        res.status(404).json({ message: 'Sinodal no encontrado' });
      }
      break;
    case 'DELETE':
      const isDeleted = deleteSinodal(req.query.id as string);
      if (isDeleted) {
        res.status(200).json({ message: 'Sinodal eliminado' });
      } else {
        res.status(404).json({ message: 'Sinodal no encontrado' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}