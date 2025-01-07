import { NextApiRequest, NextApiResponse } from 'next';
import { Titulacion } from '../../../../../types/ucolTypes';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'src/data/titulaciones/titulaciones.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const titulaciones = JSON.parse(fileContents);

    const modalidades = titulaciones.reduce((acc: Record<string, number>, titulacion: Titulacion) => {
      acc[titulacion.modalidadId] = (acc[titulacion.modalidadId] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(modalidades);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
