import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const gifs = await prisma.gif.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        videoTitle: true,
        fileName: true,
        fileSize: true,
        duration: true,
        createdAt: true,
        downloads: true,
        views: true,
        hasWatermark: true,
        quality: true,
      }
    })

    return NextResponse.json({ gifs })
  } catch (error) {
    console.error('Error fetching user GIFs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GIFs' },
      { status: 500 }
    )
  }
}