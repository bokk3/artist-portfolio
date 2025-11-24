# GitHub Actions Docker Build Workflow

This workflow automatically builds and pushes multi-architecture Docker images to DockerHub.

## Setup Instructions

### 1. DockerHub Setup

1. Create a DockerHub account at https://hub.docker.com (if you don't have one)
2. Create an access token:
   - Go to Account Settings → Security
   - Click "New Access Token"
   - Give it a description (e.g., "GitHub Actions")
   - Copy the token (you won't see it again!)

### 2. GitHub Secrets Configuration

Add these secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

Required secrets:

- `DOCKERHUB_USERNAME`: Your DockerHub username
- `DOCKERHUB_TOKEN`: Your DockerHub access token (from step 1)

### 3. Workflow Triggers

The workflow runs **only** on:

- **Git tags** matching pattern `v*.*.*` (e.g., `v1.0.0`, `v1.5.2`): Builds and tags with version numbers

**Note**: The workflow does NOT run on pushes to branches. Only version tags trigger builds.

### 4. Multi-Architecture Support

Builds for:

- `linux/amd64` (Intel/AMD processors)
- `linux/arm64` (ARM processors, including Apple Silicon, Raspberry Pi)

### 5. Image Tags

The workflow automatically creates tags based on version tags:

**On version tag (e.g., v1.5.0):**

```
yourusername/artist-portfolio:1.5.0
yourusername/artist-portfolio:1.5
yourusername/artist-portfolio:1
yourusername/artist-portfolio:latest
```

### 6. Usage

**Pull and run the image:**

```bash
docker pull yourusername/artist-portfolio:latest
docker run -p 3000:3000 yourusername/artist-portfolio:latest
```

**Or use docker-compose:**

```yaml
services:
  web:
    image: yourusername/artist-portfolio:latest
    ports:
      - "3000:3000"
```

### 7. Creating a Release

To trigger a versioned build:

```bash
git tag v1.5.0
git push origin v1.5.0
```

This will build and push with version tags automatically.

### 8. Monitoring

- View build status in GitHub Actions tab
- Check DockerHub for published images: https://hub.docker.com/r/yourusername/artist-portfolio

## Workflow Features

✅ Multi-architecture builds (amd64 + arm64)
✅ Automatic tagging based on branches and versions
✅ Build caching for faster builds
✅ Build provenance attestation
✅ Secure credential management via GitHub secrets

## Troubleshooting

**Build fails with "unauthorized":**

- Check that `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets are set correctly
- Verify the access token hasn't expired

**Build is slow:**

- First build will be slow, subsequent builds use caching
- Multi-arch builds take longer than single-arch

**Can't pull image:**

- Verify the image name matches your DockerHub username
- Check that the workflow completed successfully
