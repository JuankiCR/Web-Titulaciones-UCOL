// src/pages/api/titulaciones/alumnos.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createAlumno, getAlumnos, updateAlumno, deleteAlumno, getAlumnoById } from '@/services/titulaciones/alumnoService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      if (req.query.id) {
        const alumno = getAlumnoById(req.query.id as string);
        if (alumno) {
          res.status(200).json(alumno);
        } else {
          res.status(404).json({ message: 'Alumno no encontrado' });
        }
      } else {
        res.status(200).json(getAlumnos());
      }
      break;
    case 'POST':
      const { numeroCuenta, nombre, generacion, carrera, facultad } = req.body;
      if (!numeroCuenta || !nombre || !generacion || !carrera || !facultad) {
        res.status(400).json({ message: 'Faltan datos requeridos' });
        return;
      }
      const newAlumno = createAlumno(numeroCuenta, nombre, generacion, carrera, facultad);
      res.status(201).json(newAlumno);
      break;
    case 'PUT':
      const updatedAlumno = updateAlumno(req.query.id as string, req.body);
      if (updatedAlumno) {
        res.status(200).json(updatedAlumno);
      } else {
        res.status(404).json({ message: 'Alumno no encontrado' });
      }
      break;
    case 'DELETE':
      const isDeleted = deleteAlumno(req.query.id as string);
      if (isDeleted) {
        res.status(200).json({ message: 'Alumno eliminado' });
      } else {
        res.status(404).json({ message: 'Alumno no encontrado' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
