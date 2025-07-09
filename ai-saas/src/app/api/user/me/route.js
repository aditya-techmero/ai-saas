import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const userData = verifyToken(token);
  if (!userData) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { username: userData.sub },
    include: { wordpress: true },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({
    username: user.username,
    email: user.email,
    name: user.name,
    wordpress: user.wordpress ? {
      siteUrl: user.wordpress.siteUrl,
      username: user.wordpress.username,
      applicationPassword: user.wordpress.applicationPassword,
    } : null,
  });
}