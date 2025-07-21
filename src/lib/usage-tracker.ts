import { prisma } from './prisma'

export class UsageTracker {
  async trackGifCreation(userId: string, gifData: {
    youtubeUrl: string
    videoId: string
    videoTitle: string
    fileName: string
    filePath: string
    fileSize: number
    duration: number
    startTime: number
    endTime: number
    quality: string
    hasWatermark: boolean
  }) {
    try {
      // Create GIF record
      const gif = await prisma.gif.create({
        data: {
          ...gifData,
          userId,
        }
      })

      // Update user stats
      await prisma.user.update({
        where: { id: userId },
        data: {
          gifsCreated: { increment: 1 },
          storageUsed: { increment: gifData.fileSize },
        }
      })

      return gif
    } catch (error) {
      console.error('Error tracking GIF creation:', error)
      throw error
    }
  }

  async canCreateGif(userId: string): Promise<{
    canCreate: boolean
    reason?: string
    tier: string
    limits: {
      gifsPerDay: number
      maxClipLength: number
      storageLimit: number
    }
  }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          tier: true,
          gifsCreated: true,
          storageUsed: true,
          lastResetDate: true,
        }
      })

      if (!user) {
        return {
          canCreate: false,
          reason: 'User not found',
          tier: 'FREE',
          limits: { gifsPerDay: 0, maxClipLength: 0, storageLimit: 0 }
        }
      }

      const limits = this.getTierLimits(user.tier)
      
      // Check if it's a new day (reset daily limits)
      const today = new Date()
      const lastReset = new Date(user.lastResetDate)
      const isNewDay = today.toDateString() !== lastReset.toDateString()

      if (isNewDay) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            gifsCreated: 0,
            lastResetDate: today,
          }
        })
        user.gifsCreated = 0
      }

      // Check daily GIF limit
      if (limits.gifsPerDay !== -1 && user.gifsCreated >= limits.gifsPerDay) {
        return {
          canCreate: false,
          reason: `Daily limit of ${limits.gifsPerDay} GIFs reached. Upgrade for more.`,
          tier: user.tier,
          limits
        }
      }

      // Check storage limit
      if (user.storageUsed >= limits.storageLimit) {
        return {
          canCreate: false,
          reason: 'Storage limit reached. Please upgrade your plan.',
          tier: user.tier,
          limits
        }
      }

      return {
        canCreate: true,
        tier: user.tier,
        limits
      }
    } catch (error) {
      console.error('Error checking GIF creation limits:', error)
      return {
        canCreate: false,
        reason: 'Error checking limits',
        tier: 'FREE',
        limits: { gifsPerDay: 0, maxClipLength: 0, storageLimit: 0 }
      }
    }
  }

  private getTierLimits(tier: string) {
    const limits = {
      FREE: {
        gifsPerDay: 5,
        maxClipLength: 10, // seconds
        storageLimit: 50 * 1024 * 1024, // 50MB
      },
      PREMIUM: {
        gifsPerDay: 50,
        maxClipLength: 30,
        storageLimit: 1024 * 1024 * 1024, // 1GB
      },
      PRO: {
        gifsPerDay: -1, // unlimited
        maxClipLength: 60,
        storageLimit: 10 * 1024 * 1024 * 1024, // 10GB
      }
    }

    return limits[tier as keyof typeof limits] || limits.FREE
  }

  async trackGifDownload(gifId: string) {
    try {
      await prisma.gif.update({
        where: { id: gifId },
        data: { downloads: { increment: 1 } }
      })
    } catch (error) {
      console.error('Error tracking download:', error)
    }
  }

  async trackGifView(gifId: string) {
    try {
      await prisma.gif.update({
        where: { id: gifId },
        data: { views: { increment: 1 } }
      })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  async getUserStats(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          tier: true,
          gifsCreated: true,
          storageUsed: true,
          lastResetDate: true,
          createdAt: true,
        }
      })

      if (!user) return null

      const totalGifs = await prisma.gif.count({
        where: { userId }
      })

      const totalDownloads = await prisma.gif.aggregate({
        where: { userId },
        _sum: { downloads: true }
      })

      const totalViews = await prisma.gif.aggregate({
        where: { userId },
        _sum: { views: true }
      })

      return {
        ...user,
        totalGifs,
        totalDownloads: totalDownloads._sum.downloads || 0,
        totalViews: totalViews._sum.views || 0,
        limits: this.getTierLimits(user.tier)
      }
    } catch (error) {
      console.error('Error getting user stats:', error)
      return null
    }
  }
}

export const usageTracker = new UsageTracker()