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

### Database Volume (`./data/db`)

**What it does:**

- Persists SQLite database across container restarts
- Automatically initialized on first run
- Includes WAL files for better performance

**Location:** `./data/db/artist.db`

**Backup:**

```bash
# Create backup
cp data/db/artist.db backups/artist-$(date +%Y%m%d).db

# Restore from backup
docker-compose down
cp backups/artist-20231124.db data/db/artist.db
docker-compose up -d
```

### Uploads Volume (`./data/uploads`)

**What it does:**

- Stores user-uploaded files (images, audio, etc.)
- Persists across container updates
- Accessible via `/uploads/` URL path

**Structure:**

```
data/uploads/
├── covers/       # Album/release cover images
├── tracks/       # Audio files
├── gallery/      # Gallery images
├── blog/         # Blog post images
└── press/        # Press kit files
```

**Important:** Create subdirectories if needed:

```bash
mkdir -p data/uploads/{covers,tracks,gallery,blog,press}
chmod -R 755 data/uploads
```

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

### 4. Permissions

Ensure correct permissions for volumes:

```bash
# The container runs as user 1001
sudo chown -R 1001:1001 data/
```

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
# Install sqlite3
apt-get install sqlite3

# Query database
sqlite3 data/db/artist.db "SELECT * FROM users;"

# Interactive mode
sqlite3 data/db/artist.db
```

**Reset database:**

```bash
docker-compose down
rm data/db/artist.db*
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

**Issue:** No database file in `data/db/`

**Solution:**

```bash
# Check logs
docker-compose logs app | grep -i database

# Rebuild and restart
docker-compose down
docker-compose up --build
```

### Permission Denied

**Issue:** Container can't write to volumes

**Solution:**

```bash
sudo chown -R 1001:1001 data/
docker-compose restart app
```

### Can't Login to Admin

**Issue:** Admin credentials not working

**Solution:**

```bash
# Check environment variables
docker-compose exec app printenv | grep ADMIN

# Verify database has user
sqlite3 data/db/artist.db "SELECT email FROM users;"

# Reset admin password
docker-compose down
rm data/db/artist.db
docker-compose up -d
```

### Uploads Not Persisting

**Issue:** Uploaded files disappear after restart

**Solution:**

```bash
# Check volume mount
docker-compose exec app ls -la /app/public/uploads

# Verify volume in compose file
docker-compose config | grep uploads

# Recreate with volumes
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
du -h data/db/artist.db
```

### Upload Storage

```bash
du -sh data/uploads/
```
