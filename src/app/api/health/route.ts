import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check temp directory exists
    const fs = await import('fs')
    const tempDir = process.env.TEMP_DIR || './temp'
    if (!fs.existsSync(tempDir)) {
      throw new Error('Temp directory not accessible')
    }

    // Check ffmpeg availability
    const { execSync } = await import('child_process')
    try {
      execSync('ffmpeg -version', { stdio: 'ignore' })
    } catch {
      throw new Error('FFmpeg not available')
    }

    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}