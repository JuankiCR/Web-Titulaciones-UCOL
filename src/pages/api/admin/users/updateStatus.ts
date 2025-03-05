import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserStatus } from '../../../../services/userService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'PUT') {
      const { _id, status } = req.body;

      if (!_id || !status) {
        return res.status(400).json({ error: 'Faltan parámetros (_id o status).' });
      }

      updateUserStatus(_id, status as "VERIFIED" | "UNVERIFIED" | "BLOCKED");

      res.status(200).json({ message: 'Estado actualizado correctamente.' });
    } else {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
}
