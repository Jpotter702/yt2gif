import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

// Build-safe adapter that only connects in production with proper DATABASE_URL
const getBuildSafeAdapter = () => {
  try {
    // Only use adapter if we have a valid database URL and we're not in build mode
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'file:./dev.db') {
      return PrismaAdapter(prisma)
    }
    return undefined
  } catch {
    return undefined
  }
}

// Build providers array conditionally based on available environment variables
const buildProviders = () => {
  const providers: any[] = []
  
  // Add Google provider if credentials are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }))
  }
  
  // Add GitHub provider if credentials are available
  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }))
  }
  
  // Always include credentials provider
  providers.push(CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null
      }

      try {
        // Only attempt database operations if we have a connection
        if (!process.env.DATABASE_URL) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      } catch (error) {
        console.debug('Auth credential check failed:', error)
        return null
      }
    }
  }))
  
  return providers
}

export const authOptions: NextAuthOptions = {
  adapter: getBuildSafeAdapter(),
  providers: buildProviders(),
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build-only',
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        
        // Only fetch user data if we have a database connection
        try {
          if (process.env.DATABASE_URL) {
            const user = await prisma.user.findUnique({
              where: { id: token.sub! },
              select: { tier: true, gifsCreated: true, storageUsed: true }
            })
            
            if (user) {
              session.user.tier = user.tier
              session.user.gifsCreated = user.gifsCreated
              session.user.storageUsed = user.storageUsed
            }
          }
        } catch (error) {
          // Silently fail during build or when DB is unavailable
          console.debug('Session callback database error:', error)
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}