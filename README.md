# Zylo Dental Clinic Platform

Production-oriented dental clinic platform built with Next.js App Router, TypeScript, Tailwind, Prisma, PostgreSQL, and NextAuth.

![Landing Page](../../image/landing.png)

## 🚀 Features

- **Modern Tech Stack**: Next.js 16, TypeScript, Tailwind CSS 4, Prisma 7, PostgreSQL
- **Secure Authentication**: NextAuth v5 with credentials provider and CSRF protection
- **Performance Optimized**: Database connection pooling, query optimization, image optimization
- **Security Hardened**: Rate limiting, enhanced security headers, session management
- **Testing Ready**: Jest + React Testing Library with comprehensive test coverage
- **Code Quality**: ESLint + Prettier with automated formatting and linting
- **Admin Dashboard**: Complete content management system for appointments, blog, gallery
- **Responsive Design**: Mobile-first approach with modern UI components

## 🛠 Tech Stack

### Core Framework
- **Next.js 16** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **React 19** - UI library with latest features

### Backend & Database
- **Prisma 7** - Modern ORM with type safety
- **PostgreSQL** - Robust relational database
- **Supabase** - Database hosting and management

### Authentication & Security
- **NextAuth v5** (Auth.js) - Authentication library
- **bcrypt** - Password hashing
- **CSRF Protection** - Cross-site request forgery prevention
- **Rate Limiting** - API abuse prevention

### Development Tools
- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **React Testing Library** - Component testing

### UI & Forms
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

## Setup Steps


1. Install dependencies:

```bash
npm install
```

2. Copy environment variables and update values:

```bash
copy .env.example .env
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run database migration:

```bash
npx prisma migrate dev --name init_appointment
```

5. (Optional) Seed demo/test data:

```bash
npm run db:seed
```

6. Start development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zylo?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="replace-with-long-random-secret"
ADMIN_EMAIL="admin@test.com"
ADMIN_PASSWORD="password123"
```

## Migration Commands

- Generate client:

```bash
npm run prisma:generate
```

- Create and apply a new migration:

```bash
npx prisma migrate dev --name <migration_name>
```

- Check migration status:

```bash
npx prisma migrate status
```

## Deployment Instructions

1. Build app:

```bash
npm run build
```

2. Run production server:

```bash
npm run start
```

3. Ensure production env vars are set (especially `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`).

4. Apply migrations in deployment pipeline before app start:

```bash
npx prisma migrate deploy
```

## Admin Access

- Login URL: `/admin/login`
- Default development credentials are taken from `.env`:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`

## 📋 Available Scripts

### Development
```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm run start            # Start production server
```

### Database
```bash
npm run prisma:generate  # Generate Prisma client
npm run db:seed         # Seed database with demo data
```

### Code Quality
```bash
npm run lint             # Run ESLint checks
npm run typecheck        # Run TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

### Testing
```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/zylo"

# NextAuth v5
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin credentials
ADMIN_EMAIL="admin@zylo.com"
ADMIN_PASSWORD="your-secure-admin-password"

# App URL (for production)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Security Notes
- `AUTH_SECRET` should be a random 32+ character string
- Use `openssl rand -base64 32` to generate a secure secret
- Never commit `.env.local` to version control

## 📁 Project Structure

```
zylo/
├── app/                    # Next.js app directory
│   ├── (pages)/           # Route pages
│   │   ├── admin/         # Admin dashboard
│   │   └── api/           # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/             # Reusable UI components
│   ├── ui/               # Base UI components
│   └── sections/         # Page sections
├── lib/                   # Utility functions
│   ├── db/               # Database utilities
│   └── rate-limit.ts     # Rate limiting
├── modules/               # Feature modules
│   ├── admin/            # Admin functionality
│   ├── blog/             # Blog management
│   └── gallery/          # Gallery management
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── public/               # Static assets
├── docs/                 # Documentation
│   └── API.md            # API documentation
└── types/                # TypeScript type definitions
```

## 🧪 Testing

The project includes comprehensive testing setup:

### Unit Tests
- Rate limiting functionality
- CSRF protection utilities
- Authentication flows

### Test Coverage
```bash
npm run test:coverage
```

### Running Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode during development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Prepare for Deployment**
   ```bash
   npm run build
   npm run test
   npm run lint
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

3. **Configure Vercel**
   - Connect your Vercel account to GitHub
   - Import the project
   - Configure environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

### Environment Variables for Production
Set these in your Vercel dashboard:
- `DATABASE_URL` - Supabase connection string
- `AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `ADMIN_EMAIL` - Admin email address
- `ADMIN_PASSWORD` - Secure admin password
- `NEXTAUTH_URL` - Your Vercel deployment URL

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run start
   ```

## 🔒 Security Features

### Authentication & Authorization
- NextAuth v5 with credentials provider
- Secure session management (30-minute timeout)
- Role-based access control (ADMIN/USER)
- CSRF protection for all forms

### API Security
- Rate limiting on all endpoints
- Enhanced security headers
- Input validation with Zod schemas
- SQL injection prevention with Prisma ORM

### Performance & Security
- Database connection pooling
- Query optimization
- Image optimization with AVIF/WebP
- Secure cookies in production

## 📊 Performance Optimizations

### Database
- Connection pooling (20 max, 5 min connections)
- Optimized Prisma queries
- Raw SQL for complex aggregations

### Frontend
- Image optimization with modern formats
- API response caching
- Lazy loading for components
- CSS and bundle optimization

### Monitoring
- Comprehensive error logging
- Rate limiting headers
- Performance metrics

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run quality checks**
   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```
5. **Format your code**
   ```bash
   npm run format
   ```
6. **Submit a pull request**

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Add JSDoc comments for public functions
- Write tests for new features

## 📚 Documentation

- [API Documentation](./docs/API.md) - Complete API reference
- [Database Schema](./prisma/schema.prisma) - Database structure
- [Component Docs](./components/) - UI component documentation

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Regenerate Prisma client
npm run prisma:generate
```

**Authentication Issues**
```bash
# Check AUTH_SECRET is set
echo $AUTH_SECRET

# Clear NextAuth session
# Delete cookies and restart dev server
```

**Build Errors**
```bash
# Check TypeScript
npm run typecheck

# Check ESLint
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: dev@zylo.com
- Documentation: Check the [docs](./docs/) folder

---

**Built with ❤️ for dental clinics worldwide**
