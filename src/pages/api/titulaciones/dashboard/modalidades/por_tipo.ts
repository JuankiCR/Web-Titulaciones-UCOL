import { NextApiRequest, NextApiResponse } from 'next';
import { Modalidad } from '../../../../../types/ucolTypes';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'src/data/titulaciones/modalidades.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const modalidades = JSON.parse(fileContents);

    const tipos = modalidades.reduce(
      (acc: Record<string, number>, modalidad: Modalidad) => {
        acc[modalidad.conDocumento ? 'conDocumento' : 'sinDocumento']++;
        return acc;
      },
      { conDocumento: 0, sinDocumento: 0 }
    );

    res.status(200).json(tipos);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
