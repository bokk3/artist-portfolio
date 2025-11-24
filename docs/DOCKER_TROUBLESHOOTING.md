# Docker Deployment Troubleshooting & Setup Guide

This document covers common issues and required setup steps for deploying the Artist Portfolio application with Docker.

## Prerequisites

The application runs as a non-root user inside the container:

- **User:** `nextjs`
- **UID:** `1001`
- **GID:** `1001`

All volume-mounted directories must be accessible to this user.

---

## Initial Setup Checklist

### 1. Create Data Directories

```bash
# In your deployment directory (e.g., ~/Documents/Projects/compose)
mkdir -p ap-data/db
mkdir -p ap-data/uploads/{cover,audio,gallery,blog,press,misc}
```

### 2. Set Correct Permissions

```bash
# Set ownership to container user (UID 1001)
sudo chown -R 1001:1001 ap-data/

# Set proper permissions
chmod -R 755 ap-data/
```

### 3. Verify Directory Structure

```bash
ls -la ap-data/
# Should show:
# drwxr-xr-x  1001  1001  db/
# drwxr-xr-x  1001  1001  uploads/

ls -la ap-data/uploads/
# Should show subdirectories:
# drwxr-xr-x  1001  1001  cover/
# drwxr-xr-x  1001  1001  audio/
# drwxr-xr-x  1001  1001  gallery/
# drwxr-xr-x  1001  1001  blog/
# drwxr-xr-x  1001  1001  press/
# drwxr-xr-x  1001  1001  misc/
```

---

## Common Issues & Solutions

### Issue 1: Database Cannot Be Created

**Error:**

```
SqliteError: unable to open database file
code: 'SQLITE_CANTOPEN'
```

**Cause:** The `/app/db` directory in the container doesn't have write permissions.

**Solution:**

```bash
# Stop container
docker-compose -f docker-compose.prod.yml down

# Fix permissions on host
sudo chown -R 1001:1001 ap-data/db
chmod -R 755 ap-data/db

# Start container (database will auto-initialize)
docker-compose -f docker-compose.prod.yml up -d

# Verify initialization in logs
docker-compose -f docker-compose.prod.yml logs -f
```

**What to look for in logs:**

```
🚀 First run detected - initializing database...
📁 Checking database directory: /app/db
✅ Database directory is writable
🗄️  Initializing database...
✅ Tables created successfully
✅ Admin user created: admin@artist.com
🎉 Database initialization complete!
```

---

### Issue 2: Upload Directories Cannot Be Created

**Error:**

```
Error: EACCES: permission denied, mkdir '/app/public/uploads/gallery'
errno: -13
code: 'EACCES'
```

**Cause:** Upload subdirectories don't exist on the host or have wrong permissions.

**Solution:**

```bash
# Create all upload subdirectories
mkdir -p ap-data/uploads/{cover,audio,gallery,blog,press,misc}

# Fix permissions
sudo chown -R 1001:1001 ap-data/uploads
chmod -R 755 ap-data/uploads

# Restart container
docker-compose -f docker-compose.prod.yml restart
```

---

### Issue 3: Permission Denied on Existing Files

**Error:**

```
Permission denied
Operation not permitted
```

**Cause:** Files owned by wrong user or insufficient permissions.

**Solution:**

```bash
# Recursively fix all permissions
sudo chown -R 1001:1001 ap-data/
chmod -R 755 ap-data/

# For individual files
sudo chown 1001:1001 ap-data/db/artist.db
chmod 644 ap-data/db/artist.db
```

---

### Issue 4: Database Already Exists But Empty/Corrupted

**Solution - Fresh Start:**

```bash
# Stop container
docker-compose -f docker-compose.prod.yml down

# Backup old database (if needed)
cp ap-data/db/artist.db ap-data/db/artist.db.backup

# Remove database files
rm -f ap-data/db/artist.db*

# Fix permissions
sudo chown -R 1001:1001 ap-data/db

# Start container (will re-initialize)
docker-compose -f docker-compose.prod.yml up -d
```

**Solution - Add Missing Tables:**

```bash
# If you want to keep existing data but add missing tables
sqlite3 ap-data/db/artist.db

# At sqlite prompt, run:
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

# Exit with: .quit
```

---

## Docker Build Issues

### Issue: bcryptjs Error During Build

**Error:**

```
ERROR: process "node scripts/init-db.js" did not complete successfully: exit code: 1
```

**Cause:** Old Dockerfile initialized database during build instead of runtime.

**Solution:** Use the updated Dockerfile (v1.0.2+) which:

- Initializes database at **runtime** (container startup)
- Uses an entrypoint script to check if database exists
- Only runs initialization on first start

**Verify your Dockerfile has:**

```dockerfile
# Create entrypoint script for database initialization
RUN echo '#!/bin/sh' > /app/docker-entrypoint.sh && \
    # ... (entrypoint creation)

ENTRYPOINT ["/app/docker-entrypoint.sh"]
```

---

## Filesystem Compatibility Issues

### chmod: Operation Not Permitted

**Cause:** Some filesystems (like certain Docker volume types) don't support Unix permissions.

**Solution A - Use Different Filesystem:**

```bash
# Ensure you're using a Linux filesystem that supports permissions
# Avoid NTFS, FAT32, or network filesystems without proper support
```

**Solution B - Run as Root (Not Recommended):**

```bash
# In Dockerfile, remove USER nextjs line (not recommended for security)
```

**Solution C - Use Named Volumes:**

```yaml
# In docker-compose.yml
volumes:
  db_data:
  upload_data:

services:
  app:
    volumes:
      - db_data:/app/db
      - upload_data:/app/public/uploads
```

---

## Verification Steps

### 1. Check Container is Running

```bash
docker-compose -f docker-compose.prod.yml ps
# Should show: State = Up (healthy)
```

### 2. Check Database Exists

```bash
ls -la ap-data/db/
# Should see:
# artist.db
# artist.db-shm
# artist.db-wal
```

### 3. Check Database Tables

```bash
sqlite3 ap-data/db/artist.db ".tables"
# Should show:
# events    gallery   newsletter_subscribers   posts
# releases  tracks    users    videos
```

### 4. Check Upload Directories

```bash
ls -la ap-data/uploads/
# Should show all subdirectories with 1001:1001 ownership
```

### 5. Test Upload Functionality

```bash
# Create a test file
echo "test" > ap-data/uploads/gallery/test.txt

# Verify it's accessible in container
docker-compose -f docker-compose.prod.yml exec artist-portfolio ls -la /app/public/uploads/gallery/
```

### 6. Check Application Logs

```bash
docker-compose -f docker-compose.prod.yml logs -f
# Look for initialization messages and no permission errors
```

---

## Complete Fresh Deployment

If starting completely fresh, follow these steps in order:

```bash
# 1. Navigate to deployment directory
cd ~/Documents/Projects/compose

# 2. Create directory structure
mkdir -p ap-data/db
mkdir -p ap-data/uploads/{cover,audio,gallery,blog,press,misc}

# 3. Set permissions
sudo chown -R 1001:1001 ap-data
chmod -R 755 ap-data

# 4. Create .env file
cat > .env << EOF
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
EOF

# 5. Pull/build image
docker-compose -f docker-compose.prod.yml pull
# OR
docker build -t 3bok/artist-portfolio:latest /path/to/source

# 6. Start container
docker-compose -f docker-compose.prod.yml up -d

# 7. Monitor initialization
docker-compose -f docker-compose.prod.yml logs -f

# 8. Verify everything works
curl http://localhost:3000
curl http://localhost:3000/admin/login
```

---

## Security Considerations

### File Permissions

- **755** for directories: Owner can read/write/execute, others can read/execute
- **644** for files: Owner can read/write, others can read only

### Database Security

- Change default admin password immediately after first login
- Store `JWT_SECRET` securely (use environment variables)
- Never commit `.env` files to git

### Upload Security

- File validation is done by the upload API
- Max file size: 10MB
- Only allowed MIME types accepted
- Unique filenames prevent overwrites

---

## Backup & Restore

### Backup

```bash
# Database
cp ap-data/db/artist.db backups/db-$(date +%Y%m%d).db

# Uploads
tar -czf backups/uploads-$(date +%Y%m%d).tar.gz ap-data/uploads/

# Complete backup
tar -czf backups/complete-$(date +%Y%m%d).tar.gz ap-data/
```

### Restore

```bash
# Stop container
docker-compose -f docker-compose.prod.yml down

# Restore database
cp backups/db-20231124.db ap-data/db/artist.db

# Restore uploads
tar -xzf backups/uploads-20231124.tar.gz

# Fix permissions
sudo chown -R 1001:1001 ap-data/
chmod -R 755 ap-data/

# Start container
docker-compose -f docker-compose.prod.yml up -d
```

---

## Summary of Key Points

1. ✅ **Always use UID 1001** for volume permissions
2. ✅ **Create upload subdirectories** before first run
3. ✅ **Database auto-initializes** on first container start
4. ✅ **Check logs** for initialization confirmation
5. ✅ **Fix permissions** with `chown 1001:1001` if errors occur
6. ✅ **Use proper filesystem** that supports Unix permissions
7. ✅ **Never initialize database during Docker build**
8. ✅ **Test uploads** after deployment

For additional help, check the logs:

```bash
docker-compose -f docker-compose.prod.yml logs -f artist-portfolio
```
