import { NextApiRequest, NextApiResponse } from 'next';
import { Sinodal } from '../../../../../types/ucolTypes';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'src/data/titulaciones/sinodales.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const sinodales = JSON.parse(fileContents);

    const facultades = sinodales.reduce((acc: Record<string, number>, sinodal: Sinodal) => {
      acc[sinodal.facultad] = (acc[sinodal.facultad] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(facultades);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
