# Docker Build Strategies

This project provides two distinct Docker build strategies for the web service, each optimized for different deployment scenarios.

## Build-Time Compilation (Recommended for Production)

**Files:**
- `docker/Dockerfile.web.build-time.prod` 
- `docker-compose.build-time.prod.yml`
- Used by default in `docker-compose.prod.yml` and `render.yaml`

**How it works:**
- Next.js application is built during the `docker build` process
- The final image contains the pre-built application
- Container startup only runs the already-compiled application

**Advantages:**
- ✅ **Fast startup time** - container starts immediately
- ✅ **Platform compatibility** - works with Render, Vercel, and other platforms that scan for open ports
- ✅ **Consistent builds** - build environment is captured in the image
- ✅ **Better caching** - Docker layers cache the build artifacts
- ✅ **Smaller runtime footprint** - no dev dependencies in final image

**Disadvantages:**
- ❌ **Longer image build time** - takes more time to create the Docker image
- ❌ **Rebuild required for changes** - code changes require rebuilding the image
- ❌ **Larger image size** - build artifacts are stored in the image

**Use cases:**
- Production deployments
- CI/CD pipelines
- Platform-as-a-Service (Render, Railway, etc.)
- When fast startup is critical
- When you have automated image building

## Runtime Compilation (Flexible for Development)

**Files:**
- `docker/Dockerfile.web.runtime.prod`
- `docker-compose.runtime.prod.yml`

**How it works:**
- Source code is copied to the container
- Next.js application is built when the container starts
- Build happens fresh on every container restart

**Advantages:**
- ✅ **Fresh builds** - always uses the latest source code
- ✅ **Faster image creation** - Docker image builds quickly
- ✅ **Development friendly** - code changes don't require image rebuild
- ✅ **Smaller image layers** - build artifacts not cached in image

**Disadvantages:**
- ❌ **Slow startup time** - 2-5 minutes for build + start
- ❌ **Platform incompatibility** - may timeout on platforms that scan for ports
- ❌ **Resource intensive** - requires build resources at runtime
- ❌ **Build dependencies required** - dev dependencies needed in production

**Use cases:**
- Development environments
- Self-hosted deployments with flexible startup times
- When you want builds to always use fresh dependencies
- Docker Compose local development

## Quick Reference

### For Render/Vercel Deployment:
```bash
# Use build-time compilation (already configured)
docker build -f docker/Dockerfile.web.build-time.prod .
```

### For Local Development:
```bash
# Runtime compilation for fresh builds (default)
docker-compose -f docker-compose.prod.yml up
# OR use the explicit runtime file
docker-compose -f docker-compose.runtime.prod.yml up
```

### For Production Self-Hosted:
```bash
# Runtime compilation (default) - fresh builds but slower startup
docker-compose -f docker-compose.prod.yml up
# OR for faster startup (build-time compilation)
docker-compose -f docker-compose.build-time.prod.yml up
```

## Environment Variables

Both strategies support the same environment variables:

**Build-time arguments (for build-time compilation):**
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL` 
- `AUTH_SECRET`
- `API_ADMIN_TOKEN`
- `API_PING_PATH`

**Runtime environment variables (for both strategies):**
- All the above variables can be overridden at runtime
- Additional runtime-specific variables are set in docker-compose files

## Performance Comparison

| Metric | Build-Time | Runtime |
|--------|------------|---------|
| Image Build Time | 5-10 minutes | 1-2 minutes |
| Container Startup | 5-10 seconds | 2-5 minutes |
| Image Size | Larger (~500MB) | Smaller (~300MB) |
| Memory Usage | Lower | Higher (during build) |
| Platform Compatibility | High | Limited |

## Migration Between Strategies

### From Runtime to Build-Time:
1. Update `dockerfilePath` in your deployment config
2. Add build-time environment variables as build args
3. Expect longer image builds but faster startups

### From Build-Time to Runtime:
1. Update `dockerfilePath` in your deployment config  
2. Remove build args, rely on runtime environment variables
3. Expect faster image builds but slower startups

## Troubleshooting

**Build-Time Issues:**
- Build fails: Check environment variables are set as build args
- Large image: Normal, build artifacts are included
- Slow builds: Use Docker layer caching

**Runtime Issues:**
- Slow startup: Expected, build happens at startup  
- Platform timeouts: Use build-time compilation instead
- Out of memory: Increase container memory limits

## Recommendations

- **Production**: Use build-time compilation (`Dockerfile.web.build-time.prod`)
- **Development**: Use runtime compilation (`Dockerfile.web.runtime.prod`) 
- **CI/CD**: Use build-time compilation for consistent builds
- **Platform deployment**: Use build-time compilation to avoid timeouts
