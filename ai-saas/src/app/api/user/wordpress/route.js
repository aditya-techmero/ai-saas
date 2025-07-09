import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const userData = verifyToken(token);
  if (!userData) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { siteUrl, username, applicationPassword } = await req.json();

  const updatedUser = await prisma.user.update({
    where: { username: userData.sub },
    data: {
      wordpress: {
        upsert: {
          create: { siteUrl, username, applicationPassword },
          update: { siteUrl, username, applicationPassword },
        },
      },
    },
    include: { wordpress: true },
  });

  return NextResponse.json({ message: 'WordPress credentials saved', wordpress: updatedUser.wordpress });
}
