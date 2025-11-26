# Docker Compose Deployment Guide

## Quick Start

### 1. Create Environment File

Create a `.env` file in the same directory as `docker-compose.yml`:

```bash
# .env file
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-random-secret-key-min-32-chars
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

**Generate a secure JWT secret:**

```bash
openssl rand -base64 32
```

### 2. Create Data Directories

```bash
mkdir -p data/db data/uploads
```

### 3. Build and Run

```bash
# Build the image
docker-compose build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Verify Database

```bash
# Check if database was created
ls -la data/db/

# You should see:
# artist.db
# artist.db-shm
# artist.db-wal
```

### 5. Access the Application

- **Public Site:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/login

Use your `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the `.env` file.

## Volume Strategy

This deployment uses **named Docker volumes** for data persistence. Volumes are managed by Docker and provide better portability and isolation.

### Database Volume (`portfolio_db`)

**What it does:**

- Persists SQLite database across container restarts
- Automatically initialized on first run
- Includes WAL files for better performance
- Managed by Docker (not in local filesystem)

**Volume Name:** `portfolio_db`

**Accessing the database:**

```bash
# Inspect volume location
docker volume inspect portfolio_db

# Access database via temporary container
docker run --rm -v portfolio_db:/data -it alpine sh
# Then: sqlite3 /data/artist.db
```

**Backup:**

```bash
# Create backup using temporary container
docker run --rm -v portfolio_db:/data -v $(pwd)/backups:/backup \
  alpine sh -c "cp /data/artist.db /backup/artist-$(date +%Y%m%d).db"

# Restore from backup
docker-compose down
docker run --rm -v portfolio_db:/data -v $(pwd)/backups:/backup \
  alpine sh -c "cp /backup/artist-20231124.db /data/artist.db"
docker-compose up -d
```

### Uploads Volume (`portfolio_uploads`)

**What it does:**

- Stores user-uploaded files (images, audio, etc.)
- Persists across container updates
- Accessible via `/uploads/` URL path
- Managed by Docker (not in local filesystem)

**Volume Name:** `portfolio_uploads`

**Structure:**

```
uploads/
├── cover/        # Album/release cover images
├── audio/         # Audio files
├── gallery/      # Gallery images
├── blog/         # Blog post images
└── misc/         # Other files
```

**Accessing uploads:**

```bash
# List files in volume
docker run --rm -v portfolio_uploads:/data alpine ls -la /data

# Copy files from volume
docker run --rm -v portfolio_uploads:/data -v $(pwd)/backups:/backup \
  alpine sh -c "cp -r /data /backup/uploads-$(date +%Y%m%d)"
```

**Note:** Subdirectories are automatically created by the application when needed.

## File Upload Configuration

Since the admin forms currently use URL inputs, you have two options:

### Option A: Use External Storage (Recommended for Production)

Use a cloud storage service and paste URLs:

1. **Upload to cloud:** Cloudinary, AWS S3, or DigitalOcean Spaces
2. **Get public URL:** Copy the CDN URL
3. **Paste in admin:** Use URL in admin forms

**Benefits:**

- CDN performance
- No server storage concerns
- Better scalability

### Option B: Local Upload Implementation

For local file uploads, you would need to implement:

1. **Upload API route** (`app/api/upload/route.ts`)
2. **Update admin forms** to use file inputs
3. **Store files** in `/app/public/uploads`

**Example upload route:**

```typescript
// app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  // Save to /app/public/uploads
  // Return URL: /uploads/filename.jpg
}
```

## Production Deployment

### 1. Using Pre-built Image

If you have the image in a registry:

```yaml
services:
  app:
    image: registry.example.com/artist-portfolio:latest
    # ... rest of config
```

### 2. Update Strategy

```bash
# Pull new image
docker-compose pull

# Restart with new image (keeps data)
docker-compose up -d

# Check logs
docker-compose logs -f app
```

### 3. Environment Variables

**Required:**

- `JWT_SECRET` - For authentication (min 32 chars)
- `ADMIN_EMAIL` - Admin login email
- `ADMIN_PASSWORD` - Admin login password

**Optional:**

- `NEXT_PUBLIC_BASE_URL` - Your domain URL

### 4. Volume Management

**List volumes:**

```bash
docker volume ls | grep portfolio
```

**Inspect volume details:**

```bash
docker volume inspect portfolio_db
docker volume inspect portfolio_uploads
```

**Note:** With named volumes, Docker manages permissions automatically. The container runs as user 1001 and has proper access to the volumes.

## Common Operations

### View Logs

```bash
docker-compose logs -f app
```

### Restart Service

```bash
docker-compose restart app
```

### Stop Service

```bash
docker-compose down
```

### Rebuild After Code Changes

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Operations

**Access database:**

```bash
# Query database using temporary container
docker run --rm -v portfolio_db:/data alpine sh -c \
  "apk add sqlite3 && sqlite3 /data/artist.db 'SELECT * FROM users;'"

# Interactive mode
docker run --rm -it -v portfolio_db:/data alpine sh -c \
  "apk add sqlite3 && sqlite3 /data/artist.db"
```

**Reset database:**

```bash
# Remove the volume (this deletes all data!)
docker-compose down -v portfolio_db
docker-compose up -d
# Database will be re-initialized with default admin
```

### Check Container Health

```bash
docker-compose ps
# Look for "healthy" status

# Manual health check
curl http://localhost:3000/
```

## Troubleshooting

### Database Not Created

**Issue:** Database not initialized

**Solution:**

```bash
# Check logs
docker-compose logs app | grep -i database

# Check if volume exists
docker volume inspect portfolio_db

# Rebuild and restart
docker-compose down
docker-compose up --build
```

### Permission Denied

**Issue:** Container can't write to volumes

**Solution:**

```bash
# Check volume permissions
docker volume inspect portfolio_db

# Restart container (Docker manages permissions automatically)
docker-compose restart app

# If issues persist, recreate volumes
docker-compose down -v
docker-compose up -d
```

### Can't Login to Admin

**Issue:** Admin credentials not working

**Solution:**

```bash
# Check environment variables
docker-compose exec app printenv | grep ADMIN

# Verify database has user
docker run --rm -v portfolio_db:/data alpine sh -c \
  "apk add sqlite3 && sqlite3 /data/artist.db 'SELECT email FROM users;'"

# Reset admin password (recreate database volume)
docker-compose down -v portfolio_db
docker-compose up -d
```

### Uploads Not Persisting

**Issue:** Uploaded files disappear after restart

**Solution:**

```bash
# Check volume mount
docker-compose exec app ls -la /app/public/uploads

# Verify volume exists
docker volume inspect portfolio_uploads

# Check volume contents
docker run --rm -v portfolio_uploads:/data alpine ls -la /data

# Recreate volumes if needed
docker-compose down -v
docker-compose up -d
```

## Production Checklist

- [ ] Set strong `JWT_SECRET` (min 32 random characters)
- [ ] Change default admin password
- [ ] Set correct `NEXT_PUBLIC_BASE_URL`
- [ ] Set up volume backups (database + uploads)
- [ ] Configure reverse proxy (nginx/traefik) with SSL
- [ ] Set up monitoring/logging
- [ ] Configure firewall (only allow 80/443)
- [ ] Set up automated database backups
- [ ] Test restore from backup
- [ ] Document admin credentials securely

## SSL/HTTPS Setup

### Using Nginx + Let's Encrypt

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Uncomment nginx service in `docker-compose.yml` and add certbot for SSL.

## Monitoring

### Check Resource Usage

```bash
docker stats artist-portfolio-app-1
```

### View All Logs

```bash
docker-compose logs --tail=100 -f
```

### Database Size

```bash
# Check database size
docker run --rm -v portfolio_db:/data alpine sh -c \
  "du -h /data/artist.db"
```

### Upload Storage

```bash
# Check uploads directory size
docker run --rm -v portfolio_uploads:/data alpine sh -c \
  "du -sh /data"
```
