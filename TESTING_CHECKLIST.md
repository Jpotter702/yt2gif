# yt2gif.app Testing Checklist

## Pre-Testing Setup

### Environment Setup
- [ ] Ensure FFmpeg is installed on your system
- [ ] Copy `.env.example` to `.env.local` and fill in basic values
- [ ] Run `npm install` to install all dependencies
- [ ] Run `npm run db:generate && npm run db:push` to set up database
- [ ] Start development server with `npm run dev`
- [ ] Verify app loads at `http://localhost:3000`

### Basic Environment Validation
- [ ] Check console for any startup errors
- [ ] Verify database connection (no Prisma errors)
- [ ] Confirm all environment variables are loaded
- [ ] Test hot reload by making a small change

---

## 1. Core Functionality Testing

### YouTube URL Processing
- [ ] **Valid YouTube URLs**: Test with various YouTube URL formats:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://youtube.com/watch?v=VIDEO_ID`
  - `https://www.youtube.com/watch?v=VIDEO_ID&t=30s`

- [ ] **Invalid URLs**: Verify proper error handling:
  - Non-YouTube URLs (`https://google.com`)
  - Malformed URLs (`not-a-url`)
  - Empty input
  - Private/unavailable YouTube videos

- [ ] **Video Metadata**: Check that video information loads correctly:
  - Video title displays
  - Duration is accurate
  - Thumbnail appears (if implemented)

### Video Preview & Range Selection
- [ ] **Video Player**: 
  - Video loads and plays correctly
  - Player controls work (play/pause)
  - Video quality is acceptable
  - Player is responsive on different screen sizes

- [ ] **Range Selector**:
  - Initial range is set (0-10 seconds default)
  - Drag handles to adjust start/end times
  - Click on timeline to set new range
  - Range duration updates correctly
  - Maximum length enforced (10s for free users)

### GIF Generation Process
- [ ] **Processing Workflow**:
  - Click "Convert to GIF" button
  - Processing status appears
  - Progress indicator works (if implemented)
  - Processing completes successfully
  - GIF preview appears

- [ ] **GIF Quality**:
  - Generated GIF plays correctly
  - Quality is acceptable for intended use
  - File size is reasonable
  - Watermark appears on free tier

- [ ] **Download Functionality**:
  - Download button works
  - File downloads with correct filename
  - Downloaded GIF file is playable
  - File size matches expectations

---

## 2. User Authentication Testing

### Registration Process
- [ ] **Email Registration**:
  - Navigate to sign-up page
  - Register with valid email/password
  - Verify password requirements work
  - Check for duplicate email handling
  - Confirm account creation success

- [ ] **OAuth Providers** (if configured):
  - Test Google sign-in flow
  - Test GitHub sign-in flow
  - Verify account linking works correctly

### Login/Logout Flow
- [ ] **Email Login**:
  - Login with correct credentials
  - Test incorrect password handling
  - Test non-existent email handling
  - Verify "remember me" functionality

- [ ] **Session Management**:
  - Verify user stays logged in on page refresh
  - Test logout functionality
  - Check session expiration handling

### Protected Routes
- [ ] **Access Control**:
  - Try accessing `/dashboard` without login (should redirect)
  - Try accessing `/settings` without login (should redirect)
  - Verify proper redirection after login

---

## 3. Freemium System Testing

### Free Tier Limits
- [ ] **Usage Tracking**:
  - Create multiple GIFs as free user
  - Verify usage counter increases
  - Test daily limit enforcement (5 GIFs/day)
  - Check limit reset at midnight

- [ ] **Feature Restrictions**:
  - Verify 10-second maximum clip length
  - Confirm watermark appears on all GIFs
  - Test upgrade prompts when hitting limits

### Tier Upgrade Flow
- [ ] **Upgrade Interface**:
  - Navigate to upgrade page
  - Review pricing plans display
  - Check feature comparison accuracy

- [ ] **Payment Flow** (with Stripe test mode):
  - Use test card numbers (4242 4242 4242 4242)
  - Complete payment process
  - Verify subscription activation
  - Check premium features unlock

### Premium Features
- [ ] **Premium User Benefits**:
  - Create GIFs longer than 10 seconds (up to 30s)
  - Verify no watermark on generated GIFs
  - Test unlimited daily usage
  - Check HD quality option availability

---

## 4. User Interface Testing

### Responsive Design
- [ ] **Desktop Testing** (1920x1080, 1366x768):
  - All components display correctly
  - Navigation menu works properly
  - Video player is appropriately sized
  - All text is readable

- [ ] **Tablet Testing** (768px width):
  - Layout adapts correctly
  - Touch targets are appropriate size
  - Navigation collapses to hamburger menu
  - All functionality remains accessible

- [ ] **Mobile Testing** (375px width):
  - All content fits on screen
  - Touch interactions work smoothly
  - Text remains readable
  - Forms are usable with mobile keyboard

### Touch Interactions (Mobile/Tablet)
- [ ] **Range Selector**:
  - Touch and drag handles work
  - Tap to set new range position
  - Handles are large enough for touch
  - No conflicts with page scrolling

- [ ] **Navigation**:
  - Hamburger menu opens/closes
  - Menu items are touch-friendly
  - User dropdown works on touch
  - All buttons are properly sized

### Dark Mode (if implemented)
- [ ] **Theme Switching**:
  - Dark mode activates correctly
  - All components respect theme
  - Text contrast is sufficient
  - Images/icons adapt appropriately

---

## 5. Error Handling Testing

### Network Errors
- [ ] **Offline Testing**:
  - Disconnect internet during GIF processing
  - Verify graceful error handling
  - Check error messages are user-friendly
  - Test retry functionality

### Invalid Input Handling
- [ ] **Form Validation**:
  - Submit empty forms
  - Enter invalid email formats
  - Test password requirements
  - Verify error messages appear

### Server Errors
- [ ] **API Error Simulation**:
  - Test with very long videos (1+ hours)
  - Try processing multiple GIFs simultaneously
  - Test with corrupted/invalid video URLs

---

## 6. Performance Testing

### Load Time Testing
- [ ] **Page Load Performance**:
  - Measure initial page load time (target: <3 seconds)
  - Test with slow 3G connection simulation
  - Verify images load progressively
  - Check for layout shift issues

### Video Processing Performance
- [ ] **Processing Speed**:
  - Time various clip lengths (5s, 10s, 30s)
  - Test different video qualities
  - Monitor memory usage during processing
  - Verify cleanup after processing

### Browser Compatibility
- [ ] **Cross-Browser Testing**:
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)
  - Mobile browsers (Chrome Mobile, Safari Mobile)

---

## 7. Security Testing

### Input Validation
- [ ] **XSS Prevention**:
  - Try entering `<script>alert('test')</script>` in forms
  - Test with malicious URLs
  - Verify all inputs are properly sanitized

### Authentication Security
- [ ] **Session Security**:
  - Verify JWT tokens are properly signed
  - Test session expiration
  - Check for proper logout cleanup

### Rate Limiting
- [ ] **API Protection**:
  - Make rapid API requests
  - Verify rate limiting kicks in
  - Test with different user accounts

---

## 8. Database & Data Testing

### Data Persistence
- [ ] **User Data**:
  - Create account and verify data saves
  - Update profile information
  - Check GIF history persistence
  - Test usage tracking accuracy

### Database Operations
- [ ] **CRUD Operations**:
  - Create new records (users, GIFs)
  - Read data correctly
  - Update existing records
  - Delete data when appropriate

---

## 9. Integration Testing

### Stripe Integration (Test Mode)
- [ ] **Payment Processing**:
  - Use Stripe test card numbers
  - Complete subscription signup
  - Test subscription cancellation
  - Verify webhook handling

### External APIs
- [ ] **YouTube Integration**:
  - Test with various video types
  - Verify API rate limiting
  - Test error handling for unavailable videos

---

## 10. Accessibility Testing

### Keyboard Navigation
- [ ] **Tab Navigation**:
  - Navigate entire app using only keyboard
  - Verify focus indicators are visible
  - Check all interactive elements are reachable

### Screen Reader Compatibility
- [ ] **ARIA Labels**:
  - Test with screen reader (VoiceOver, NVDA)
  - Verify alt text on images
  - Check form labels are properly associated

---

## 11. SEO & Analytics Testing

### SEO Validation
- [ ] **Meta Tags**:
  - View page source and verify meta tags
  - Test social media sharing (Open Graph)
  - Check structured data with Google's testing tool

### Analytics Tracking
- [ ] **Event Tracking** (if configured):
  - Verify page views are tracked
  - Test custom event firing
  - Check user identification works

---

## Critical Test Scenarios

### End-to-End User Journeys
- [ ] **Complete Free User Journey**:
  1. Visit homepage
  2. Paste YouTube URL
  3. Select video range
  4. Generate GIF
  5. Download result

- [ ] **Premium Upgrade Journey**:
  1. Hit free tier limit
  2. See upgrade prompt
  3. Complete payment process
  4. Access premium features

- [ ] **Mobile User Journey**:
  1. Access site on mobile
  2. Complete onboarding
  3. Create GIF using touch controls
  4. Share or download result

---

## Post-Testing Validation

### Build & Deploy Testing
- [ ] **Production Build**:
  - Run `npm run build` successfully
  - Test production build locally with `npm start`
  - Verify no console errors in production

### Environment Variables
- [ ] **Configuration Check**:
  - Verify all required environment variables
  - Test with production-like configuration
  - Check security of sensitive values

---

## Testing Tools & Commands

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check

# Database operations
npm run db:generate
npm run db:push
npm run db:studio
```

### Browser DevTools Testing
- Use Chrome DevTools Network tab to simulate slow connections
- Use Lighthouse for performance auditing
- Use Application tab to verify PWA manifest
- Use Console for JavaScript error monitoring

### Testing Browser Extensions
- **React Developer Tools**: Component state inspection
- **Lighthouse**: Performance and accessibility auditing
- **Web Vitals**: Core Web Vitals measurement

---

## Bug Reporting Template

When you find issues, please document:

```
**Bug Title**: Brief description

**Steps to Reproduce**:
1. Navigate to...
2. Click on...
3. Enter...
4. Observe...

**Expected Result**: What should happen

**Actual Result**: What actually happened

**Environment**:
- Browser: 
- Device: 
- Screen size: 
- User tier: 

**Screenshots**: (if applicable)

**Console Errors**: (copy any error messages)
```

This comprehensive testing checklist should help validate all aspects of the yt2gif.app implementation. Start with the core functionality tests and work through each section systematically.