# Production Environment Configuration

## Required Environment Variables

### Database Configuration
```env
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
```

### Authentication (NextAuth v5)
```env
AUTH_SECRET="your-32-character-random-secret"
NEXTAUTH_URL="https://your-domain.com"
```

### Application Configuration
```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Admin Credentials
```env
ADMIN_EMAIL="admin@your-domain.com"
ADMIN_PASSWORD="your-secure-admin-password"
```

## Environment Variable Generation

### Generate AUTH_SECRET
```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using PowerShell
[System.Convert]::ToBase64String((Get-Random -Count 32 -AsByte))
```

### Database URL Format (Supabase)
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## Vercel Environment Variables Setup

### 1. Access Environment Variables
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Select "Environment Variables"

### 2. Add Required Variables
Add each of the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@db.project.supabase.co:5432/postgres` |
| `AUTH_SECRET` | NextAuth secret key (32+ chars) | `abc123...` |
| `NEXTAUTH_URL` | Your deployment URL | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://your-app.vercel.app` |
| `ADMIN_EMAIL` | Admin login email | `admin@your-domain.com` |
| `ADMIN_PASSWORD` | Admin login password | `secure-password-123` |

### 3. Environment-Specific Variables
- **Production**: Set values for production deployment
- **Preview**: Set values for preview deployments (optional)
- **Development**: Set values for development branches

## Security Considerations

### AUTH_SECRET
- Must be at least 32 characters long
- Use a cryptographically secure random string
- Never commit to version control
- Regenerate if compromised

### Database URL
- Use SSL connections (Supabase provides this)
- Keep credentials secure
- Use connection pooling when possible

### Admin Credentials
- Use a strong, unique password
- Consider using a password manager
- Change default credentials in production

## Deployment Checklist

### Pre-Deployment
- [ ] Generate secure AUTH_SECRET
- [ ] Set up PostgreSQL database
- [ ] Configure database connection
- [ ] Set admin credentials
- [ ] Test locally with production variables

### Vercel Setup
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Set build command to `prisma generate && npm run build`
- [ ] Enable automatic deployments
- [ ] Configure custom domain (optional)

### Post-Deployment
- [ ] Run database migrations
- [ ] Test authentication flow
- [ ] Verify API endpoints
- [ ] Check rate limiting
- [ ] Test admin dashboard
- [ ] Monitor error logs

## Troubleshooting

### Database Connection Errors
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
npx prisma db pull --force
```

### Authentication Issues
```bash
# Verify AUTH_SECRET length
echo $AUTH_SECRET | wc -c

# Check NextAuth configuration
curl https://your-domain.com/api/auth/session
```

### Build Failures
```bash
# Check build locally
npm run build

# Verify Prisma generation
npm run prisma:generate
```

## Environment-Specific Notes

### Development
```env
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zylo_dev"
AUTH_SECRET="dev-secret-not-for-production"
NEXTAUTH_URL="http://localhost:3000"
```

### Production
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/zylo_prod"
AUTH_SECRET="production-secret-32-chars-long"
NEXTAUTH_URL="https://your-domain.com"
```

### Staging/Preview
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/zylo_staging"
AUTH_SECRET="staging-secret-32-chars-long"
NEXTAUTH_URL="https://staging.your-domain.com"
```
