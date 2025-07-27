# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **yt2gif.app** - a web application that converts YouTube videos into shareable GIFs. The project is currently in early development phase with only a README.md file defining the requirements and roadmap.

### Core Functionality
- YouTube URL input and video preview
- Visual range selector for clip timing
- GIF generation with palette optimization  
- Free watermarked exports vs HD premium options
- Download and share capabilities

### Business Model
- Freemium model with free watermarked GIFs
- Premium HD exports without watermarks
- Light advertising integration
- Future API offering for developers

## Architecture Status

✅ **Project Status**: Production-ready application with full implementation completed.

**Implemented Systems:**
- ✅ YouTube clip fetching system (ytdl-core + yt-dlp fallback)
- ✅ GIF rendering and watermarking engine (FFmpeg + fluent-ffmpeg)
- ✅ Frontend user interface (Next.js 15 + React + Tailwind CSS)
- ✅ Backend API services (Next.js API routes)
- ✅ Authentication and usage tracking (NextAuth.js + Prisma)
- ✅ Temporary GIF storage system (local filesystem + cleanup)
- ✅ Payment processing (Stripe integration)
- ✅ Error monitoring (Sentry)
- ✅ Analytics (PostHog)
- ✅ Production deployment configurations

## Development Commands

### Core Development
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checking
- `npm run type-check` - Run TypeScript checking

### Database Management  
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database (development)
- `npm run db:migrate` - Create and apply migrations (development)
- `npm run db:migrate:prod` - Apply migrations (production)
- `npm run db:studio` - Open Prisma Studio

### Deployment
- `npm run deploy:check` - Run pre-deployment checks
- `npm run deploy:build` - Build and test application
- `npm run deploy:vercel` - Deploy to Vercel
- `npm run deploy:docker` - Deploy with Docker Compose  
- `npm run deploy:migrate` - Run database migrations

### Monitoring & Maintenance
- `npm run health` - Check application health
- `npm run performance:audit` - Run Lighthouse performance audit
- `npm run size:check` - Check bundle size

## Implementation Phases

### Phase 1 - Core MVP
- Implement basic YouTube to GIF conversion
- Build frontend UI with range selector
- Set up freemium model infrastructure
- Add payment processing integration

### Phase 2 - API Platform  
- Develop REST API with key system
- Enable developer integrations

## Next Steps for Development

When implementing this project, consider:
1. Choose appropriate tech stack for video processing and web frontend
2. Set up development environment with proper build tools
3. Implement YouTube video fetching (respecting YouTube's ToS)
4. Build GIF generation pipeline with optimization
5. Create responsive frontend interface
6. Establish backend services for user management and processing