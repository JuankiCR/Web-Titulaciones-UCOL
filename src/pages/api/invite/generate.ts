// pages/api/invite/generate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: `Método ${req.method} no permitido` });
    }

    const { autoVerification, role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'El rol es obligatorio.' });
    }

    const secretKey = process.env.JWT_SECRET_INVITE;
    if (!secretKey) {
      return res.status(500).json({ error: 'JWT_SECRET_INVITE no está configurado.' });
    }

    // Generar el token
    const token = jwt.sign(
      {
        autoVerification,
        role,
      },
      secretKey,
      { expiresIn: '1h' }
    );

    const link = `/invite/register?token=${token}`;

    res.status(200).json({ link });
  } catch (error) {
    console.error('Error al generar el token:', error);
    res.status(500).json({ error: 'Error al generar el token.' });
  }
}
