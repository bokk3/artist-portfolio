# Multi-stage Dockerfile for Artist Portfolio
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set build environment variable for standalone output
ENV DOCKER_BUILD=true
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install runtime dependencies for better-sqlite3
RUN apk add --no-cache libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/db ./db

# Install production dependencies (needed for bcryptjs and better-sqlite3)
RUN npm install --production --ignore-scripts && \
    npm install better-sqlite3 bcryptjs

# Create data directory for SQLite
RUN mkdir -p /app/db && chown -R nextjs:nodejs /app/db

# Create entrypoint script for database initialization and migration
RUN echo '#!/bin/sh' > /app/docker-entrypoint.sh && \
    echo 'if [ ! -f /app/db/artist.db ]; then' >> /app/docker-entrypoint.sh && \
    echo '  echo "🚀 First run detected - initializing database..."' >> /app/docker-entrypoint.sh && \
    echo '  node /app/scripts/init-db.js' >> /app/docker-entrypoint.sh && \
    echo 'else' >> /app/docker-entrypoint.sh && \
    echo '  echo "🔄 Running database migrations..."' >> /app/docker-entrypoint.sh && \
    echo '  node /app/scripts/migrate-db.js || echo "⚠️  Migration completed with warnings"' >> /app/docker-entrypoint.sh && \
    echo 'fi' >> /app/docker-entrypoint.sh && \
    echo 'exec node server.js' >> /app/docker-entrypoint.sh && \
    chmod +x /app/docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["/app/docker-entrypoint.sh"]
