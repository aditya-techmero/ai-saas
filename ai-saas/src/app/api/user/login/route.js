import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  const { username, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const token = jwt.sign({ sub: user.username }, process.env.JWT_SECRET, {
    algorithm: process.env.JWT_ALGORITHM,
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES}m`,
  });

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!user || !passwordMatch) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  return NextResponse.json({
    access_token: token,
    token_type: 'bearer',
    username: user.username,
    email: user.email,
    name: user.name,
  });
}
