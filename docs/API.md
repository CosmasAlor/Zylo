# Zylo Dental Clinic - API Documentation

## Overview

This document describes the REST API endpoints available for the Zylo Dental Clinic platform. The API provides endpoints for managing appointments, blog posts, gallery items, contact messages, and more.

## Base URL

```
https://your-domain.com/api
```

## Authentication

Most API endpoints require authentication using NextAuth.js. The authentication token should be included in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Admin Role Required

The following endpoints require admin privileges:
- `POST /api/blog`
- `PATCH /api/blog`
- `DELETE /api/blog`
- `POST /api/gallery`
- `PATCH /api/gallery`
- `DELETE /api/gallery`
- `POST /api/media`
- `DELETE /api/media`
- `POST /api/content`
- `DELETE /api/logs`

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per 15 minutes
- **Contact form**: 3 requests per hour
- **Appointment booking**: 5 requests per hour
- **General API**: 20 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 20
X-RateLimit-Window: 60
```

## Endpoints

### Authentication

#### `GET /api/auth/session`
Get the current user session.

**Response:**
```json
{
  "user": {
    "name": "Admin User",
    "email": "admin@zylo.com",
    "role": "ADMIN"
  },
  "expires": "2024-01-01T00:00:00.000Z"
}
```

#### `POST /api/auth/signin`
Sign in with credentials.

**Request Body:**
```json
{
  "email": "admin@zylo.com",
  "password": "password",
  "callbackUrl": "/admin"
}
```

#### `POST /api/auth/signout`
Sign out the current user.

**Request Body:**
```json
{
  "callbackUrl": "/admin/login"
}
```

### Blog Posts

#### `GET /api/blog`
Retrieve blog posts.

**Query Parameters:**
- `published` (boolean): Filter by published status (default: false)
- `id` (string): Get a specific post by ID

**Response:**
```json
[
  {
    "id": "post-id",
    "title": "Blog Post Title",
    "slug": "blog-post-slug",
    "excerpt": "Post excerpt",
    "content": {
      "body": "Post content"
    },
    "published": true,
    "coverImage": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### `POST /api/blog` 🔒
Create a new blog post (Admin only).

**Request Body:**
```json
{
  "title": "New Blog Post",
  "slug": "new-blog-post",
  "excerpt": "Post excerpt",
  "content": {
    "body": "Post content"
  },
  "published": true,
  "coverImage": "https://example.com/image.jpg"
}
```

#### `PATCH /api/blog` 🔒
Update an existing blog post (Admin only).

**Request Body:**
```json
{
  "id": "post-id",
  "title": "Updated Blog Post",
  "published": false
}
```

#### `DELETE /api/blog` 🔒
Delete a blog post (Admin only).

**Request Body:**
```json
{
  "id": "post-id"
}
```

### Gallery

#### `GET /api/gallery`
Retrieve gallery items.

**Response:**
```json
[
  {
    "id": "item-id",
    "beforeUrl": "https://example.com/before.jpg",
    "afterUrl": "https://example.com/after.jpg",
    "caption": "Treatment Result",
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### `POST /api/gallery` 🔒
Create a new gallery item (Admin only).

**Request Body:**
```json
{
  "beforeUrl": "https://example.com/before.jpg",
  "afterUrl": "https://example.com/after.jpg",
  "caption": "Treatment Result",
  "order": 0
}
```

#### `PATCH /api/gallery` 🔒
Update a gallery item (Admin only).

**Request Body:**
```json
{
  "id": "item-id",
  "caption": "Updated Caption"
}
```

#### `DELETE /api/gallery` 🔒
Delete a gallery item (Admin only).

**Request Body:**
```json
{
  "id": "item-id"
}
```

### Media

#### `GET /api/media`
Retrieve all media items.

**Response:**
```json
[
  {
    "id": "media-id",
    "filename": "image.jpg",
    "fileType": "image/jpeg",
    "fileData": "base64-encoded-data",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### `POST /api/media` 🔒
Upload a new media file (Admin only).

**Request Body:**
```json
{
  "fileData": "base64-encoded-data",
  "filename": "image.jpg",
  "fileType": "image/jpeg"
}
```

#### `DELETE /api/media` 🔒
Delete a media file (Admin only).

**Request Body:**
```json
{
  "id": "media-id"
}
```

### Contact Messages

#### `POST /api/contact`
Submit a contact message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I would like to schedule an appointment."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact message sent successfully"
}
```

### Appointments

#### `POST /api/book`
Book a new appointment.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "service": "General Dentistry",
  "preferredDate": "2024-01-15",
  "preferredTime": "10:00",
  "notes": "Regular checkup"
}
```

**Response:**
```json
{
  "id": "appointment-id",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "service": "General Dentistry",
  "preferredDate": "2024-01-15",
  "preferredTime": "10:00",
  "notes": "Regular checkup",
  "status": "PENDING",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /api/appointments` 🔒
Retrieve appointments (Admin only).

**Query Parameters:**
- `status` (string): Filter by appointment status
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)

### Content Management

#### `POST /api/content` 🔒
Update content blocks (Admin only).

**Request Body:**
```json
{
  "key": "testimonials",
  "value": {
    "badge": "Patient Experience",
    "title": "Patient Stories",
    "items": [...]
  }
}
```

### System Logs

#### `GET /api/logs` 🔒
Retrieve system logs (Admin only).

**Query Parameters:**
- `type` (string): Filter by log type (ERROR, EVENT, INFO)
- `q` (string): Search query
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)

**Response:**
```json
{
  "logs": [
    {
      "id": "log-id",
      "type": "ERROR",
      "message": "Database connection failed",
      "route": "/api/blog",
      "stack": "Error stack trace",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50
}
```

#### `DELETE /api/logs` 🔒
Clear all system logs (Admin only).

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Admin privileges required"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Data Models

### Appointment
```typescript
interface Appointment {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  service: string;
  preferredDate: Date;
  preferredTime: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}
```

### BlogPost
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: {
    body: string;
  };
  published: boolean;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### GalleryItem
```typescript
interface GalleryItem {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  caption: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### ContactMessage
```typescript
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED';
  createdAt: Date;
  updatedAt: Date;
}
```

## Security Considerations

- All sensitive endpoints require authentication
- Rate limiting is enforced on all endpoints
- CSRF protection is enabled for form submissions
- Input validation is performed on all endpoints
- SQL injection protection through Prisma ORM
- XSS protection through content sanitization

## Caching

API responses are cached according to the following rules:
- Blog posts: 30 minutes (list), 1 hour (individual)
- Static content: 1 day
- Dynamic content: No caching

## Versioning

The current API version is v1. Future versions will be backward compatible when possible.

## Support

For API support and questions, please contact the development team at dev@zylo.com.
