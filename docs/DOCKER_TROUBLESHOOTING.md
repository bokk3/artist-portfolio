# Docker Troubleshooting Guide

## Not Seeing Latest Changes After Pulling Image

### 1. Force Pull Latest Image

```bash
# Pull the latest image (force refresh)
docker pull yourusername/artist-portfolio:latest

# Or pull specific version
docker pull yourusername/artist-portfolio:1.1.0
```

### 2. Stop and Remove Old Container

```bash
# Stop the container
docker-compose down

# Remove the old image (optional, forces fresh pull)
docker rmi yourusername/artist-portfolio:latest

# Pull fresh image
docker pull yourusername/artist-portfolio:latest
```

### 3. Recreate Container with Latest Image

```bash
# Pull latest and recreate
docker-compose pull
docker-compose up -d --force-recreate

# Or rebuild from scratch
docker-compose down
docker-compose pull
docker-compose up -d
```

### 4. Clear Browser Cache

- **Hard refresh**: `Ctrl+Shift+R` (Linux/Windows) or `Cmd+Shift+R` (Mac)
- **Clear cache**: Open DevTools → Application → Clear Storage → Clear site data
- **Incognito mode**: Test in a private/incognito window

### 5. Verify Image Version

```bash
# Check what image the container is using
docker-compose ps

# Inspect the image
docker inspect yourusername/artist-portfolio:latest | grep -i version

# Check container logs for version info
docker-compose logs app | grep -i version
```

### 6. Check Database Migration

The settings table should be created automatically. If you see "no such table: settings" errors:

```bash
# Check if migration ran
docker-compose logs app | grep -i "settings\|migration"

# Manually run migration (if needed)
docker-compose exec app node /app/scripts/migrate-db.js
```

### 7. Verify GitHub Actions Build

- Check GitHub Actions to ensure the build completed successfully
- Verify the Docker image was pushed to DockerHub
- Check the image tags on DockerHub match your expected version

### 8. Force Rebuild (If Using Local Build)

If you're building locally instead of pulling:

```bash
# Rebuild without cache
docker-compose build --no-cache

# Rebuild and restart
docker-compose up -d --build --force-recreate
```

## Common Issues

### Settings Table Missing

The app now automatically creates the settings table if it's missing. If you still see errors:

1. The safety check should create it automatically on first access
2. Check container logs: `docker-compose logs app`
3. Manually verify: `docker-compose exec app sqlite3 /app/db/artist.db ".tables"`

### Version Not Showing

The version is displayed in:
- **Navbar** (next to logo, desktop only)
- **Footer** (bottom of page)
- **Admin Panel** (sidebar header and footer)

If version shows "dev", the environment variable wasn't set during build. Rebuild the image.

### Database Not Migrating

The entrypoint script should run migrations automatically. Check logs:

```bash
docker-compose logs app | grep -i "migration\|database"
```

If migrations aren't running, the entrypoint might not be executing. Check:

```bash
docker-compose exec app ls -la /app/docker-entrypoint.sh
docker-compose exec app cat /app/docker-entrypoint.sh
```
