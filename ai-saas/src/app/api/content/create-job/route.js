import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/serverAuth'; 
import { NextResponse } from 'next/server';
import axios from 'axios';

// Better to instantiate Prisma this way to avoid connection issues
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export async function POST(req) {
  try {
    // Get and verify token
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const userData = verifyToken(token);
    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse JSON body with proper error handling
    let jobData;
    try {
      jobData = await req.json();
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({ 
      where: { username: userData.sub } 
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new job with correct Prisma field names (camelCase)
    console.log('Creating job with data:', {
      userId: user.id,
      title: jobData.title,
      mainKeyword: jobData.main_keyword,
      toneOfVoice: jobData.tone_of_voice,
      audienceType: jobData.audience_type,
      contentFormat: jobData.content_format,
      status: 'pending',
    });
    
    const newJob = await prisma.contentJob.create({
      data: {
        userId: user.id,
        title: jobData.title,
        mainKeyword: jobData.main_keyword,
        toneOfVoice: jobData.tone_of_voice,
        audienceType: jobData.audience_type,
        contentFormat: jobData.content_format,
        status: 'pending',
      },
    });

    // Trigger N8N webhook
    try {
      if (process.env.N8N_WEBHOOK_URL) {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
          job_id: newJob.id,
          ...jobData,
          user_id: user.id,
        });
      }
    } catch (webhookError) {
      console.error('Failed to trigger N8N webhook:', webhookError);
      // Don't fail the request if webhook fails
    }

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('API ERROR:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error meta:', error.meta);
    
    // More specific error handling
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Duplicate entry' }, { status: 409 });
    }
    
    if (error.code === 'P2000') {
      return NextResponse.json({ error: 'Column mapping issue - check database schema' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}