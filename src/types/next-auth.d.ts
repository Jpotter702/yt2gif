import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      tier?: string
      gifsCreated?: number
      storageUsed?: number
    }
  }

  interface User {
    id: string
    tier?: string
    gifsCreated?: number
    storageUsed?: number
  }
}