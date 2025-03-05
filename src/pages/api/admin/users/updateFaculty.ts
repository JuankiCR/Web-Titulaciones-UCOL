import { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, saveUsers } from '../../../../services/userService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'PUT') {
      const { _id, facultyId } = req.body;

      if (!_id || !facultyId) {
        return res.status(400).json({ error: 'Faltan parámetros (_id o facultyId).' });
      }

      const users = getUsers();
      const userIndex = users.findIndex((user) => user._id === _id);

      if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      users[userIndex].facultyId = facultyId;
      saveUsers(users);

      res.status(200).json(users[userIndex]);
    } else {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
}
