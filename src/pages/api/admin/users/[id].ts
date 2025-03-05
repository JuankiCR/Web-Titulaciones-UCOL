// pages/api/admin/users/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, saveUsers } from '@/services/userService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'DELETE') {
      const { id } = req.query;
      const users = getUsers();
      const updatedUsers = users.filter((user) => user._id !== id);

      if (users.length === updatedUsers.length) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      saveUsers(updatedUsers);
      res.status(200).json({ message: 'Usuario eliminado correctamente.' });
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
}
