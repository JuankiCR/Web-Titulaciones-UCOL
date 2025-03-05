import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_INVITE;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ valid: false, message: 'Token no proporcionado.' });
    }

    try {
      const decoded = jwt.verify(token, secretKey!);
    
      if (typeof decoded === 'object' && decoded !== null && 'role' in decoded && 'autoVerification' in decoded) {
        return res.status(200).json({
          valid: true,
          role: (decoded as any).role,
          autoVerification: (decoded as any).autoVerification,
        });
      } else {
        throw new Error('Token inválido.');
      }
    } catch (err) {
      return res.status(401).json({ valid: false, message: `Token inválido o expirado. ${err}` });
    }
    
    
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ message: 'Método no permitido' });
}
