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

⚠️ **Project Status**: This is a greenfield project with no code implementation yet. Only requirements documentation exists.

The README.md outlines the intended tech stack areas:
- YouTube clip fetching system
- GIF rendering and watermarking engine
- Frontend user interface
- Backend API services  
- Authentication and usage tracking
- Temporary GIF storage system

## Development Commands

No build system, package management, or development commands are currently configured. The tech stack and development workflow need to be established.

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