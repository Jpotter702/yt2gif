# 🚀 Production Deployment Guide

This guide covers deploying yt2gif.app to production environments with best practices for security, performance, and reliability.

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0 or higher
- **FFmpeg**: Latest stable version
- **Database**: PostgreSQL 12+ (production) or SQLite (development)
- **Memory**: Minimum 2GB RAM (4GB+ recommended)
- **Storage**: 20GB+ for video processing and temporary files

### Required Accounts
- **Database Provider**: Supabase, PlanetScale, Neon, or self-hosted PostgreSQL
- **Hosting Platform**: Vercel, Railway, Render, or cloud provider
- **Stripe Account**: For payment processing (optional)
- **Monitoring Services**: Sentry, PostHog (optional but recommended)

## 🌟 Platform-Specific Deployments

### Vercel (Recommended)

Vercel provides the best experience for Next.js applications with zero-config deployment.

#### 1. Initial Setup

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Navigate to your project directory
cd yt2gif

# Deploy (follow the prompts)
vercel
```

#### 2. Environment Variables

In the Vercel dashboard, add these environment variables:

**Required:**
```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-32-char-secret-here"
NODE_ENV="production"
FFMPEG_PATH="/usr/bin/ffmpeg"
```

**Optional (but recommended):**
```env
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"
SENTRY_DSN="your-sentry-dsn"
```

#### 3. Database Setup

```bash
# Run migrations after deployment
npx prisma migrate deploy

# Or if using Prisma db push
npx prisma db push
```

#### 4. Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` to use your custom domain

### Docker Deployment

Perfect for self-hosting or cloud container platforms.

#### 1. Build and Run Locally

```bash
# Build the Docker image
docker build -t yt2gif:latest .

# Create environment file
cp .env.example .env.production
# Edit .env.production with your production values

# Run the container
docker run -d \
  --name yt2gif \
  -p 3000:3000 \
  --env-file .env.production \
  yt2gif:latest
```

#### 2. Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://yt2gif:password@db:5432/yt2gif
      - NEXTAUTH_URL=https://yourdomain.com
      - NEXTAUTH_SECRET=your-secret-here
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./temp:/app/temp
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=yt2gif
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=yt2gif
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

Deploy with:
```bash
docker-compose up -d
```

### Railway

One-click deployment with automatic scaling.

#### 1. Deploy via GitHub

1. Connect your GitHub repository to Railway
2. Railway will automatically detect it's a Next.js app
3. Add environment variables in the Railway dashboard
4. Deploy automatically triggers on git push

#### 2. Custom Start Command

Set the start command in Railway:
```bash
npm run db:migrate:prod && npm start
```

### Render

Great alternative with simple deployment process.

#### 1. Create Web Service

1. Connect your GitHub repository
2. Configure build settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run db:migrate:prod && npm start`
3. Add environment variables
4. Deploy

#### 2. Database Setup

Use Render's PostgreSQL service or external provider:
```env
DATABASE_URL="postgresql://user:password@hostname:port/database"
```

### DigitalOcean App Platform

Managed platform with good scaling options.

#### 1. App Spec Configuration

Create `.do/app.yaml`:

```yaml
name: yt2gif
services:
- name: web
  source_dir: /
  github:
    repo: your-username/yt2gif
    branch: main
  run_command: npm run db:migrate:prod && npm start
  build_command: npm install && npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NODE_ENV
    value: "production"
  - key: DATABASE_URL
    value: "${database.DATABASE_URL}"
  - key: NEXTAUTH_URL
    value: "https://your-app.ondigitalocean.app"
  # Add other environment variables

databases:
- name: database
  engine: PG
  version: "15"
```

## 🔐 Security Configuration

### Environment Variables Security

**Never commit sensitive data to git:**
```bash
# Add to .gitignore
.env.local
.env.production
.env.*.local
```

**Use strong secrets:**
```bash
# Generate secure NEXTAUTH_SECRET
openssl rand -base64 32
```

### Stripe Webhook Configuration

1. **Create webhook endpoint in Stripe dashboard**
   - URL: `https://yourdomain.com/api/stripe/webhooks`
   - Events: `invoice.payment_failed`, `customer.subscription.updated`, etc.

2. **Add webhook secret to environment**
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

### CORS and Security Headers

The application includes production security headers:
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

## 📊 Monitoring Setup

### Error Tracking with Sentry

1. **Create Sentry project**
2. **Get your DSN**
3. **Add to environment variables**:
   ```env
   SENTRY_DSN="https://your-dsn@sentry.io/project-id"
   SENTRY_ORG="your-org"
   SENTRY_PROJECT="your-project"
   ```

### Analytics with PostHog

1. **Create PostHog account**
2. **Get project API key**
3. **Configure environment**:
   ```env
   NEXT_PUBLIC_POSTHOG_KEY="phc_your-key"
   NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
   ```

### Health Checks

The application includes a health check endpoint:
```bash
curl https://yourdomain.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

## 🗄️ Database Management

### Production Database Setup

**Recommended providers:**
- **Supabase**: PostgreSQL with real-time features
- **PlanetScale**: Serverless MySQL with branching
- **Neon**: Serverless PostgreSQL
- **Railway**: Simple PostgreSQL hosting

### Migration Strategy

**For new deployments:**
```bash
npx prisma migrate deploy
```

**For existing deployments:**
```bash
# Create migration locally
npx prisma migrate dev --name add_new_feature

# Apply to production
npx prisma migrate deploy
```

### Backup Strategy

**Automated backups:**
- Most hosted providers offer automatic backups
- Set up daily backups with 30-day retention
- Test backup restoration process regularly

**Manual backup:**
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

## ⚡ Performance Optimization

### CDN Configuration

**For static assets:**
- Vercel automatically provides CDN
- For other platforms, use Cloudflare or AWS CloudFront

### Caching Strategy

**Redis for session caching (optional):**
```env
REDIS_URL="redis://localhost:6379"
```

**Next.js built-in caching:**
- Static pages are automatically cached
- API routes use appropriate cache headers

### Image Optimization

The application is configured for optimal image delivery:
- WebP and AVIF format support
- Responsive image sizing
- Lazy loading enabled

## 📈 Scaling Considerations

### Horizontal Scaling

**Stateless design:**
- Application is stateless and can scale horizontally
- Store session data in database or Redis
- Use shared file storage for temporary files

**Load balancing:**
- Most platforms handle this automatically
- For custom deployments, use nginx or cloud load balancers

### Resource Monitoring

**Key metrics to monitor:**
- CPU usage (video processing intensive)
- Memory usage (FFmpeg operations)
- Disk space (temporary video files)
- Database connections
- API response times

### Auto-scaling Configuration

**Vercel:** Automatic scaling based on traffic
**Docker:** Use docker-compose with replica scaling
**Kubernetes:** HorizontalPodAutoscaler based on CPU/memory

## 🔧 Troubleshooting

### Common Issues

**FFmpeg not found:**
```bash
# Ensure FFmpeg is installed
ffmpeg -version

# For Docker, check the Dockerfile includes FFmpeg installation
```

**Database connection issues:**
```bash
# Test database connectivity
npx prisma db push

# Check environment variable format
echo $DATABASE_URL
```

**Build failures:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Log Analysis

**Application logs:**
```bash
# View Docker logs
docker logs yt2gif

# For Vercel, check function logs in dashboard
```

**Database logs:**
- Monitor slow queries
- Check connection pool usage
- Watch for lock timeouts

### Performance Issues

**Video processing timeouts:**
- Increase function timeout limits
- Monitor memory usage during FFmpeg operations
- Consider background job processing for large files

**API rate limiting:**
- Monitor rate limit hit rates
- Adjust limits based on usage patterns
- Implement graceful degradation

## 🚨 Disaster Recovery

### Backup Verification

**Regular testing:**
```bash
# Test database restoration
pg_restore -d test_db backup.sql

# Verify application functionality
npm run health-check
```

### Incident Response

1. **Monitor alerts** from Sentry and uptime services
2. **Check health endpoints** for service status
3. **Review application logs** for error patterns
4. **Rollback strategy** using git tags and platform features
5. **Communication plan** for user notifications

### Business Continuity

- **Multi-region deployment** for high availability
- **Database replication** for data redundancy
- **Automated failover** configuration
- **Regular disaster recovery drills**

## 📞 Support and Maintenance

### Regular Maintenance Tasks

**Weekly:**
- Review error rates and performance metrics
- Check database size and optimize if needed
- Update dependencies with security patches

**Monthly:**
- Analyze usage patterns and costs
- Review and rotate API keys/secrets
- Performance testing and optimization

**Quarterly:**
- Major dependency updates
- Security audit and penetration testing
- Capacity planning based on growth

### Getting Help

- **Documentation**: Check README.md and inline comments
- **Community**: GitHub discussions and issues
- **Professional Support**: Contact the development team

---

## 🎉 Deployment Checklist

Before going live, ensure:

- [ ] All environment variables configured
- [ ] Database migrations applied successfully  
- [ ] FFmpeg installed and working
- [ ] SSL certificate configured
- [ ] Domain DNS properly configured
- [ ] Stripe webhooks set up (if using payments)
- [ ] Error monitoring configured
- [ ] Analytics tracking working
- [ ] Health checks responding
- [ ] Backup strategy implemented
- [ ] Load testing completed
- [ ] Security scan passed
- [ ] Performance optimized
- [ ] Monitoring alerts configured

Your yt2gif.app is now ready for production! 🚀