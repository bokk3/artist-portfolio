# Database Initialization Guide

## Overview

The database is automatically initialized when the Docker container is built. For local development, you need to run the initialization script manually.

## Local Development

### First Time Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Initialize the database:**

```bash
npm run db:init
```

This will:

- Create the `db` directory if it doesn't exist
- Create `db/artist.db` SQLite database
- Create all necessary tables
- Create a default admin user

### Default Admin Credentials

- **Email:** `admin@artist.com`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change these credentials in production!

### Custom Admin Credentials

Set environment variables before running the init script:

```bash
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npm run db:init
```

## Docker Deployment

### Automatic Initialization

The database is automatically initialized when you build the Docker image:

```bash
docker build -t artist-portfolio .
```

The Dockerfile handles:

1. Creating the database directory
2. Running the init script
3. Setting proper permissions

### Using Environment Variables

Pass admin credentials when running the container:

```bash
docker run -p 3000:3000 \
  -e ADMIN_EMAIL=your@email.com \
  -e ADMIN_PASSWORD=yourpassword \
  artist-portfolio
```

### Persisting Data with Volumes

To persist database data across container restarts:

```bash
docker run -p 3000:3000 \
  -v $(pwd)/data:/app/db \
  artist-portfolio
```

## Docker Compose

Create a `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ADMIN_EMAIL=admin@artist.com
      - ADMIN_PASSWORD=changeme
      - JWT_SECRET=your-secret-key
      - NEXT_PUBLIC_BASE_URL=http://localhost:3000
    volumes:
      - ./data:/app/db
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
```

## Database Schema

The initialization creates the following tables:

- **users** - Admin authentication
- **releases** - Music albums/EPs
- **tracks** - Individual songs
- **posts** - Blog posts
- **events** - Tour dates
- **videos** - Video content
- **gallery** - Photo gallery
- **newsletter_subscribers** - Email list

## Re-initializing the Database

⚠️ **WARNING:** This will delete all existing data!

### Local Development

```bash
rm -rf db/artist.db
npm run db:init
```

### Docker

```bash
# Remove the volume
docker volume rm $(docker volume ls -q | grep artist-portfolio)

# Rebuild the container
docker-compose down
docker-compose up --build
```

## Troubleshooting

### Permission Issues (Docker)

If you get permission errors:

```bash
# Fix permissions on the data directory
sudo chown -R 1001:1001 ./data
```

### Database Locked

If you get "database is locked" errors:

1. Make sure only one instance is running
2. Check for stray processes: `ps aux | grep node`
3. Restart the application

### Missing Dependencies

If init script fails:

```bash
npm install better-sqlite3 bcryptjs
npm run db:init
```

## Health Check

To verify the database is working:

1. Start the application
2. Visit `http://localhost:3000/admin/login`
3. Log in with admin credentials
4. You should see the admin dashboard

## Backup

### Create Backup

```bash
# Local
cp db/artist.db db/artist.db.backup

# Docker
docker cp container_name:/app/db/artist.db ./backup.db
```

### Restore Backup

```bash
# Local
cp db/artist.db.backup db/artist.db

# Docker
docker cp ./backup.db container_name:/app/db/artist.db
docker restart container_name
```
