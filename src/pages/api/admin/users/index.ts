// pages/api/admin/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, getUsersByRoleAndStatus } from '@/services/userService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { role, status } = req.query;

      if (role) {
        // Filtrar usuarios por rol y estado (si se proporciona)
        const filteredUsers = getUsersByRoleAndStatus(
          role as string,
          status ? (status as string) as "VERIFIED" | "UNVERIFIED" | "BLOCKED" : undefined
        );
        res.status(200).json(filteredUsers);
      } else {
        // Obtener todos los usuarios
        const users = getUsers();
        res.status(200).json(users);
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
}
