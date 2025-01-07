import { NextApiRequest, NextApiResponse } from 'next';
import { Alumno } from '../../../../../types/ucolTypes';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'src/data/titulaciones/alumnos.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const alumnos = JSON.parse(fileContents);

    const generaciones = alumnos.reduce((acc: Record<string, number>, alumno: Alumno) => {
      acc[alumno.generacion] = (acc[alumno.generacion] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(generaciones);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
