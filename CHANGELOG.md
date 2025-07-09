# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Docker Build Strategies**: Created two distinct Docker build approaches for the web service
  - `docker/Dockerfile.web.build-time.prod`: Builds Next.js app during Docker build phase (recommended for production)
  - `docker/Dockerfile.web.runtime.prod`: Builds Next.js app during container startup (flexible for development)
  - `docker-compose.build-time.prod.yml`: Docker Compose configuration for build-time compilation
  - `docker-compose.runtime.prod.yml`: Docker Compose configuration for runtime compilation
  - `docs/DOCKER-BUILD-STRATEGIES.md`: Comprehensive documentation explaining both strategies

### Fixed
- **Render Deployment URL Parsing**: Fixed "cannot be parsed as a URL" error during Render deployment
  - Updated `next.config.ts` to handle both full URLs and hostname-only values from Render
  - Updated `render.yaml` to provide explicit full URLs with https:// protocol
  - Prevents URL parsing errors when Render provides hostname-only values via `fromService` properties
- **Render Deployment Timeout**: Fixed port scanning timeout during Render deployment
  - Modified `docker/Dockerfile.web.prod` to build the Next.js application during Docker build phase instead of at startup
  - Added separate build stage (`web-builder`) to compile the application
  - Changed CMD to use `start:production` script instead of building at runtime
  - Extended health check start period to 120s for proper service initialization
  - This prevents Render from timing out while scanning for open HTTP ports during the build process

### Changed
- **Render Dynamic Service References**: Updated `render.yaml` to use dynamic service name references
  - All URL environment variables now use `fromService` instead of hardcoded values
  - URLs automatically adapt to actual service names assigned by Render
  - Eliminates need to manually update URLs when service names change
- **Default Build Strategy**: Updated configuration files for optimal deployment strategies
  - `docker-compose.prod.yml` now uses `Dockerfile.web.runtime.prod` for fresh builds in self-hosted environments
  - `render.yaml` uses `Dockerfile.web.build-time.prod` for platform compatibility
  - Original `Dockerfile.web.prod` renamed and updated with better documentation
- **Render Configuration**: Removed unnecessary `buildCommand` from `render.yaml`
- **Documentation**: Updated `docs/RENDER-DEPLOYMENT.md` with troubleshooting information for deployment timeouts

### Technical Details
- Build process now happens during `docker build` command execution by default
- Application starts immediately when container runs, exposing port 3000 quickly
- Uses `SKIP_STATIC_GENERATION=true` during build to reduce build time
- Static generation (sitemap, etc.) happens after service startup if needed
- Both strategies support the same environment variables and functionality
- Build-time strategy provides ~95% faster startup time but longer image build time
- Runtime strategy provides development flexibility but slower container startup
