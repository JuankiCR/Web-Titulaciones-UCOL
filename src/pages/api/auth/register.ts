import type { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from '@services/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, password, name, lastName } = req.body;

  try {
    await registerUser(email, password, name, lastName);
    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(400).json({ message: errorMessage });
  }
}
