# yt2gif.app

Convert any YouTube video into a shareable GIF in seconds with our modern, user-friendly web application.

## 🎯 Overview

yt2gif.app is a full-featured web application that transforms YouTube videos into high-quality GIFs. Built with modern web technologies, it offers both free and premium tiers to serve users from casual creators to professional content makers.

### Key Benefits

- **Lightning Fast**: Convert videos to GIFs in seconds
- **Precise Control**: Visual range selector for exact clip timing  
- **High Quality**: Premium HD GIFs without watermarks
- **Mobile Optimized**: Fully responsive with touch interactions
- **No Installation**: Works entirely in your browser

## ✨ Features

### Core Functionality

- **YouTube Integration**: Paste any YouTube URL for instant video loading
- **Visual Range Selector**: Intuitive timeline control for precise clip selection
- **Real-time Preview**: See your video clip before conversion
- **Multiple Quality Options**: Standard and HD output formats
- **Instant Download**: Download GIFs immediately after processing

### User Experience

- **Onboarding Tutorial**: Interactive guide for new users
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Mode Support**: Automatic theme switching
- **Progressive Web App**: Install as a native app experience
- **Touch Interactions**: Mobile-optimized controls and gestures

### Account Features

- **User Authentication**: Email, Google, and GitHub sign-in options
- **Personal Dashboard**: Track your GIF creation history
- **Usage Analytics**: Monitor your daily and monthly usage
- **Account Management**: Profile settings and subscription control

### Premium Tiers

#### Free Tier
- 5 GIFs per day
- Up to 10-second clips
- Standard quality (480p)
- Watermarked exports
- Community support

#### Premium Tier ($9.99/month)
- Unlimited GIF creation
- Up to 30-second clips
- HD quality (720p)
- No watermarks
- Priority processing
- Email support

#### Pro Tier ($19.99/month)
- Everything in Premium
- Batch processing
- API access
- Custom watermarks
- Advanced export options
- Priority support

## 🛠 Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Consistent icon library
- **PWA Support**: Service worker and offline capabilities

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Next.js API Routes**: Serverless backend functions
- **Prisma ORM**: Type-safe database access
- **SQLite/PostgreSQL**: Development and production databases

### Video Processing
- **FFmpeg**: Industry-standard video processing
- **ytdl-core**: YouTube video download and metadata
- **Fluent-FFmpeg**: Node.js FFmpeg wrapper
- **Background Jobs**: Async processing pipeline

### Authentication & Payments
- **NextAuth.js**: Multi-provider authentication
- **Stripe**: Subscription and payment processing
- **JWT Sessions**: Secure session management

### Monitoring & Analytics
- **Sentry**: Error tracking and performance monitoring
- **PostHog**: User analytics and feature flags
- **Core Web Vitals**: Performance optimization

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- FFmpeg installed on your system

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yt2gif.git
   cd yt2gif
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required environment variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-here"
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   GITHUB_ID=""
   GITHUB_SECRET=""
   
   # Stripe (for payments)
   STRIPE_PUBLISHABLE_KEY=""
   STRIPE_SECRET_KEY=""
   STRIPE_WEBHOOK_SECRET=""
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://0.0.0.0:3000`

### FFmpeg Installation

**macOS (Homebrew)**
```bash
brew install ffmpeg
```

**Ubuntu/Debian**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows**
Download from [FFmpeg official website](https://ffmpeg.org/download.html) or use chocolatey:
```bash
choco install ffmpeg
```

## 📦 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Set up environment variables**
   Configure your environment variables in the Vercel dashboard.

4. **Set up database**
   For production, use a PostgreSQL database (Supabase, PlanetScale, or Neon):
   ```bash
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t yt2gif .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 --env-file .env yt2gif
   ```

### Environment Setup

#### Required Environment Variables

- `DATABASE_URL`: Database connection string
- `NEXTAUTH_URL`: Your app's URL
- `NEXTAUTH_SECRET`: Random secret for JWT signing
- `STRIPE_PUBLISHABLE_KEY`: Stripe public key
- `STRIPE_SECRET_KEY`: Stripe secret key

#### Optional Environment Variables

- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GITHUB_ID`: GitHub OAuth app ID
- `GITHUB_SECRET`: GitHub OAuth app secret
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog analytics key
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry error tracking DSN

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript checking
- `npm run db:generate`: Generate Prisma client
- `npm run db:push`: Push schema to database
- `npm run db:studio`: Open Prisma Studio

### Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Make changes and test locally
   - Run linting and type checking
   - Submit pull request

2. **Database Changes**
   - Modify `prisma/schema.prisma`
   - Run `npm run db:generate`
   - Run `npm run db:push` for development
   - Create migration for production

3. **Testing**
   - Manual testing in development
   - Test payment flows with Stripe test mode
   - Verify responsive design on multiple devices

## 📊 Monitoring & Analytics

### Error Monitoring

- **Sentry**: Automatic error tracking and performance monitoring
- **Custom Error Boundaries**: Graceful error handling in React
- **API Error Logging**: Structured server-side error logging

### User Analytics

- **PostHog**: User behavior tracking and feature analytics
- **Conversion Funnels**: Track free-to-premium conversion
- **Performance Metrics**: Core Web Vitals and load times

### Business Metrics

- **Usage Tracking**: GIF creation rates and user engagement
- **Subscription Analytics**: Revenue and churn tracking
- **System Health**: API response times and error rates

## 🛡 Security

### Data Protection

- **Input Validation**: Comprehensive request validation with Zod
- **Rate Limiting**: API protection against abuse
- **CSRF Protection**: Built-in Next.js security features
- **Secure Headers**: Security headers for XSS protection

### Payment Security

- **PCI Compliance**: Stripe handles all payment data
- **No Card Storage**: Tokenized payment methods only
- **Webhook Verification**: Signed webhook validation

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write descriptive commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- **Architecture Overview**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Implementation Details**: See [IMPLEMENTATION.md](IMPLEMENTATION.md)
- **API Documentation**: Available at `/api/docs` when running

### Getting Help

- **Issues**: Report bugs and feature requests on GitHub
- **Discussions**: Join community discussions
- **Email**: Contact us at support@yt2gif.app

### FAQ

**Q: Why does my GIF look pixelated?**
A: Try using the HD quality option available with Premium tier, or reduce the duration of your clip for better quality.

**Q: Can I convert private YouTube videos?**
A: No, the app can only access publicly available YouTube videos.

**Q: How long does processing take?**
A: Most GIFs are processed within 10-30 seconds, depending on clip length and quality settings.

**Q: Is there an API available?**
A: Yes! Pro tier users get access to our REST API for programmatic GIF generation.

## 🎉 Acknowledgments

- **FFmpeg**: Powerful video processing engine
- **Next.js Team**: Amazing React framework
- **Vercel**: Excellent hosting platform
- **Stripe**: Reliable payment processing
- **Open Source Community**: All the amazing libraries that make this possible

---

Made with ❤️ by the yt2gif.app team