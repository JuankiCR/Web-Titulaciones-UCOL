// src/pages/api/titulaciones/modalidades.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createModalidad, getModalidades, updateModalidad, deleteModalidad, getModalidadById } from '@/services/titulaciones/modalidadesService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      if (req.query.id) {
        const modalidad = getModalidadById(req.query.id as string);
        if (modalidad) {
          res.status(200).json(modalidad);
        } else {
          res.status(404).json({ message: 'Modalidad no encontrada' });
        }
      } else {
        res.status(200).json(getModalidades());
      }
      break;
    case 'POST':
      const { nombre, conDocumento, maximoEstudiantes } = req.body;
      if (nombre === undefined || conDocumento === undefined || maximoEstudiantes === undefined) {
        res.status(400).json({ message: 'Faltan datos requeridos' });
        return;
      }
      const newModalidad = createModalidad(nombre, conDocumento, maximoEstudiantes);
      res.status(201).json(newModalidad);
      break;
    case 'PUT':
      const updatedModalidad = updateModalidad(req.query.id as string, req.body);
      if (updatedModalidad) {
        res.status(200).json(updatedModalidad);
      } else {
        res.status(404).json({ message: 'Modalidad no encontrada' });
      }
      break;
    case 'DELETE':
      const isDeleted = deleteModalidad(req.query.id as string);
      if (isDeleted) {
        res.status(200).json({ message: 'Modalidad eliminada' });
      } else {
        res.status(404).json({ message: 'Modalidad no encontrada' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}