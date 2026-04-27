# Production Deployment Guide

## Overview

This guide covers the complete deployment process for the Zylo Dental Clinic platform to production using Vercel.

## Prerequisites

- **Vercel Account**: Create a free Vercel account
- **GitHub Repository**: Push your code to GitHub
- **PostgreSQL Database**: Supabase or other PostgreSQL provider
- **Domain Name**: Optional custom domain

## Step 1: Database Setup

### Supabase Setup (Recommended)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign in with GitHub
   - Create new project

2. **Get Database Credentials**
   - Go to Project Settings > Database
   - Copy the connection string
   - Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

3. **Run Database Migrations**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed initial data (optional)
   npm run db:seed
   ```

## Step 2: Environment Variables

### Generate Secure Secrets

```bash
# Generate AUTH_SECRET (32+ characters)
openssl rand -base64 32
```

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://postgres:pass@db.project.supabase.co:5432/postgres` |
| `AUTH_SECRET` | NextAuth secret | `abc123...32chars...` |
| `NEXTAUTH_URL` | Deployment URL | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://your-app.vercel.app` |
| `ADMIN_EMAIL` | Admin email | `admin@your-domain.com` |
| `ADMIN_PASSWORD` | Admin password | `secure-password-123` |

## Step 3: Vercel Configuration

### Connect to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   vercel link
   ```

### Configure Project Settings

1. **Build Command**: `prisma generate && npm run build`
2. **Output Directory**: `.next`
3. **Install Command**: `npm install`
4. **Framework Preset**: Next.js

### Add Environment Variables

1. Go to Vercel Dashboard > Project > Settings > Environment Variables
2. Add all required variables from Step 2
3. Select appropriate environments (Production, Preview, Development)

## Step 4: Deployment Process

### Method 1: Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Vercel Auto-Deploys**
   - Vercel will automatically detect the push
   - Build process starts automatically
   - Deployment completes in 2-5 minutes

### Method 2: Manual Deployment

1. **Deploy via CLI**
   ```bash
   vercel --prod
   ```

2. **Deploy via Dashboard**
   - Go to Vercel Dashboard
   - Click "Deployments"
   - Click "New Deployment"
   - Select main branch
   - Click "Deploy"

## Step 5: Post-Deployment Verification

### Health Checks

1. **Basic Health Check**
   ```bash
   curl https://your-domain.com/api/health
   ```

2. **Expected Response**
   ```json
   {
     "status": "healthy",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "services": {
       "database": {
         "status": "healthy"
       }
     }
   }
   ```

### Functionality Tests

1. **Authentication Test**
   - Visit `/admin/login`
   - Try logging in with admin credentials

2. **API Endpoints Test**
   ```bash
   # Test blog API
   curl https://your-domain.com/api/blog
   
   # Test auth session
   curl https://your-domain.com/api/auth/session
   ```

3. **Frontend Test**
   - Navigate through all pages
   - Test contact form
   - Test appointment booking

## Step 6: Custom Domain (Optional)

### Configure Custom Domain

1. **Add Domain in Vercel**
   - Go to Project > Settings > Domains
   - Add your custom domain
   - Verify ownership

2. **Update Environment Variables**
   - Update `NEXTAUTH_URL` to your custom domain
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain

3. **Redeploy**
   ```bash
   git commit --allow-empty -m "Update domain configuration"
   git push origin main
   ```

## Step 7: Monitoring and Maintenance

### Health Monitoring

1. **Set up Uptime Monitoring**
   - Use UptimeRobot or similar service
   - Monitor `/api/health` endpoint
   - Set up alerts for downtime

2. **Error Monitoring**
   - Check Vercel logs regularly
   - Monitor error rates
   - Set up email notifications

### Performance Monitoring

1. **Vercel Analytics**
   - Enable Analytics in Vercel Dashboard
   - Monitor Core Web Vitals
   - Track user engagement

2. **Database Performance**
   - Monitor Supabase dashboard
   - Check query performance
   - Optimize slow queries

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build locally
npm run build

# Common solutions:
# - Check environment variables
# - Update dependencies
# - Fix TypeScript errors
# - Check Prisma schema
```

#### Database Connection Issues
```bash
# Test database connection
npx prisma db pull --force

# Common solutions:
# - Check DATABASE_URL format
# - Verify database credentials
# - Check network connectivity
# - Restart database
```

#### Authentication Issues
```bash
# Check AUTH_SECRET
echo $AUTH_SECRET | wc -c  # Should be 32+ chars

# Common solutions:
# - Regenerate AUTH_SECRET
# - Check NEXTAUTH_URL
# - Clear browser cookies
# - Restart deployment
```

#### Performance Issues
```bash
# Analyze bundle size
npx @next/bundle-analyzer .next

# Common solutions:
# - Optimize images
# - Enable caching
# - Reduce bundle size
# - Optimize database queries
```

### Emergency Procedures

#### Rollback Deployment
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or use Vercel dashboard to rollback
```

#### Database Recovery
```bash
# Restore from backup (Supabase)
# 1. Go to Supabase Dashboard
# 2. Settings > Database > Backups
# 3. Select backup and restore
```

## Security Considerations

### Production Security

1. **Environment Variables**
   - Never commit `.env.local` to Git
   - Use strong, unique passwords
   - Regularly rotate secrets

2. **Database Security**
   - Use SSL connections
   - Enable row-level security
   - Regular backups

3. **Application Security**
   - Keep dependencies updated
   - Monitor security advisories
   - Enable rate limiting

### Security Monitoring

1. **Regular Security Audits**
   ```bash
   npm audit
   ```

2. **Access Logs**
   - Monitor admin access
   - Track failed login attempts
   - Set up alerting for suspicious activity

## Performance Optimization

### Database Optimization

1. **Connection Pooling**
   - Already configured in `lib/prisma.ts`
   - Monitor connection usage
   - Adjust pool size if needed

2. **Query Optimization**
   - Use Prisma query optimization
   - Add database indexes
   - Monitor slow queries

### Frontend Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Enable AVIF/WebP formats
   - Implement lazy loading

2. **Code Splitting**
   - Dynamic imports for large components
   - Route-based code splitting
   - Optimize bundle size

## Maintenance Schedule

### Daily
- Monitor health checks
- Check error logs
- Review performance metrics

### Weekly
- Update dependencies
- Review security advisories
- Check database performance

### Monthly
- Full security audit
- Performance optimization review
- Backup verification

### Quarterly
- Major dependency updates
- Architecture review
- Disaster recovery testing

## Support

For deployment issues:
- Check Vercel documentation
- Review error logs
- Create GitHub issue
- Contact support team

---

**Deployment Checklist:**
- [ ] Database set up and migrated
- [ ] Environment variables configured
- [ ] Vercel project configured
- [ ] Build process tested
- [ ] Health checks passing
- [ ] Functionality verified
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring set up
- [ ] Security measures implemented
- [ ] Performance optimized

**Ready for production! 🚀**
