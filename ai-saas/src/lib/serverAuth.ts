import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  // Better validation
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return null;
  }
  
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token:', err.message);
    } else if (err instanceof jwt.TokenExpiredError) {
      console.error('Token expired:', err.message);
    } else {
      console.error('Token verification error:', err);
    }
    return null;
  }
}