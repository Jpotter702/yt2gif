#!/bin/bash

# yt2gif.app Deployment Script
# This script helps deploy the application to various platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
check_env() {
    if [ ! -f ".env.local" ] && [ ! -f ".env.production" ]; then
        print_warning "No environment file found. Creating from template..."
        cp .env.example .env.local
        print_warning "Please edit .env.local with your actual values before proceeding."
        exit 1
    fi
}

# Build and test the application
build_and_test() {
    print_step "Installing dependencies..."
    npm ci

    print_step "Running type checks..."
    npm run type-check

    print_step "Running linting..."
    npm run lint

    print_step "Building application..."
    npm run build

    print_success "Build completed successfully!"
}

# Deploy to Vercel
deploy_vercel() {
    print_step "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi

    vercel --prod
    print_success "Deployed to Vercel!"
}

# Deploy with Docker
deploy_docker() {
    print_step "Building Docker image..."
    docker build -t yt2gif:latest .
    
    print_step "Starting services with Docker Compose..."
    docker-compose up -d
    
    print_step "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_success "Application is running at http://localhost:3000"
    else
        print_error "Health check failed. Check Docker logs with: docker-compose logs"
        exit 1
    fi
}

# Database migration
migrate_database() {
    print_step "Running database migrations..."
    
    if [ "$NODE_ENV" = "production" ]; then
        npx prisma migrate deploy
    else
        npx prisma db push
    fi
    
    print_success "Database migrations completed!"
}

# Main deployment logic
main() {
    echo "🚀 yt2gif.app Deployment Script"
    echo "================================"
    
    # Parse command line arguments
    case "$1" in
        "vercel")
            check_env
            build_and_test
            deploy_vercel
            ;;
        "docker")
            check_env
            deploy_docker
            ;;
        "build")
            check_env
            build_and_test
            ;;
        "migrate")
            migrate_database
            ;;
        "check")
            print_step "Running pre-deployment checks..."
            check_env
            
            # Check if FFmpeg is available
            if command -v ffmpeg &> /dev/null; then
                print_success "FFmpeg is installed: $(ffmpeg -version | head -n1)"
            else
                print_error "FFmpeg not found. Please install FFmpeg."
                exit 1
            fi
            
            # Check Node.js version
            NODE_VERSION=$(node -v | cut -d'v' -f2)
            REQUIRED_VERSION="18.0.0"
            if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
                print_success "Node.js version: $NODE_VERSION"
            else
                print_error "Node.js version $NODE_VERSION is too old. Required: $REQUIRED_VERSION or higher"
                exit 1
            fi
            
            print_success "All pre-deployment checks passed!"
            ;;
        *)
            echo "Usage: $0 {vercel|docker|build|migrate|check}"
            echo ""
            echo "Commands:"
            echo "  vercel   - Deploy to Vercel"
            echo "  docker   - Deploy with Docker Compose"
            echo "  build    - Build and test the application"
            echo "  migrate  - Run database migrations"
            echo "  check    - Run pre-deployment checks"
            echo ""
            echo "Examples:"
            echo "  $0 check     # Run pre-deployment checks"
            echo "  $0 build     # Build and test application"
            echo "  $0 vercel    # Deploy to Vercel"
            echo "  $0 docker    # Deploy with Docker"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"