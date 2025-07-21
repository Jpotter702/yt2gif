export const TIER_FEATURES = {
  FREE: {
    maxGifsPerDay: 5,
    maxClipLength: 10, // seconds
    maxStorageBytes: 50 * 1024 * 1024, // 50MB
    hasWatermark: true,
    quality: 'low' as const,
    features: [
      'Up to 5 GIFs per day',
      'Maximum 10 second clips',
      '50MB storage',
      'Watermarked GIFs',
      'Low quality (320px width)'
    ]
  },
  PREMIUM: {
    maxGifsPerDay: 50,
    maxClipLength: 30,
    maxStorageBytes: 1024 * 1024 * 1024, // 1GB
    hasWatermark: false,
    quality: 'high' as const,
    features: [
      'Up to 50 GIFs per day',
      'Maximum 30 second clips',
      '1GB storage',
      'No watermark',
      'High quality (640px width)',
      'Priority processing'
    ]
  },
  PRO: {
    maxGifsPerDay: -1, // unlimited
    maxClipLength: 60,
    maxStorageBytes: 10 * 1024 * 1024 * 1024, // 10GB
    hasWatermark: false,
    quality: 'high' as const,
    features: [
      'Unlimited GIFs',
      'Maximum 60 second clips',
      '10GB storage',
      'No watermark',
      'High quality (640px width)',
      'Priority processing',
      'API access',
      'Batch processing'
    ]
  }
} as const

export type UserTier = keyof typeof TIER_FEATURES

export function getTierFeatures(tier: string): typeof TIER_FEATURES[UserTier] {
  return TIER_FEATURES[tier as UserTier] || TIER_FEATURES.FREE
}

export function canAccessFeature(userTier: string, requiredTier: UserTier): boolean {
  const tierOrder: UserTier[] = ['FREE', 'PREMIUM', 'PRO']
  const userTierIndex = tierOrder.indexOf(userTier as UserTier)
  const requiredTierIndex = tierOrder.indexOf(requiredTier)
  
  return userTierIndex >= requiredTierIndex
}

export function getUpgradePath(currentTier: string): {
  nextTier: UserTier | null
  benefits: string[]
  price?: string
} {
  switch (currentTier) {
    case 'FREE':
      return {
        nextTier: 'PREMIUM',
        benefits: [
          '10x more GIFs per day (50 vs 5)',
          '3x longer clips (30s vs 10s)',
          '20x more storage (1GB vs 50MB)',
          'Remove watermarks',
          'HD quality GIFs',
          'Priority processing'
        ],
        price: '$9.99/month'
      }
    case 'PREMIUM':
      return {
        nextTier: 'PRO',
        benefits: [
          'Unlimited GIFs per day',
          '2x longer clips (60s vs 30s)',
          '10x more storage (10GB vs 1GB)',
          'API access for developers',
          'Batch processing',
          'Advanced customization'
        ],
        price: '$29.99/month'
      }
    default:
      return {
        nextTier: null,
        benefits: ['You have the highest tier!']
      }
  }
}