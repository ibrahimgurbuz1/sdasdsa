import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getQueueStatus } from '@/lib/emailQueue';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      latencyMs: Date.now() - startedAt,
      services: {
        database: 'ok',
        emailQueue: getQueueStatus(),
      },
    });
  } catch (error) {
    console.error('Health check hatası:', error);
    return NextResponse.json(
      {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        services: {
          database: 'error',
          emailQueue: getQueueStatus(),
        },
      },
      { status: 503 }
    );
  }
}