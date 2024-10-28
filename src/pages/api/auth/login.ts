// src/pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser } from '@services/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, password } = req.body;

  try {
    const { user, token } = await authenticateUser(email, password);
    return res.status(200).json({ message: 'Autenticación exitosa', token, user: { email: user.email, name: user.name, lastName: user.lastName } });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(401).json({ message: errorMessage });
  }
}
