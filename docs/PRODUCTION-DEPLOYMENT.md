# Production Docker Compose Deployments

This document describes how to deploy the API and Web applications separately in a production environment.

## Files

- `docker-compose.api.prod.yml` - Runs only the Directus API with database and cache
- `docker-compose.web.prod.yml` - Runs only the Next.js web application

## Production Deployment Usage

### 1. Deploy API in Production

```bash
# Copy the production environment template
cp .env.api.prod.example .env
# Edit the .env file to set secure passwords and proper URLs

# Start the API services
docker-compose -f docker-compose.api.prod.yml up -d

# The API will be available at your configured URL (default: http://localhost:8055)
# Admin panel: http://your-api-domain.com/admin
```

### 2. Deploy Web App in Production (requires running API)

```bash
# Copy the production environment template
cp .env.web.prod.example .env
# Edit the .env file to set your API URL and other production settings

# Start the web app
docker-compose -f docker-compose.web.prod.yml up -d

# The web app will be available at your configured URL
```

### 3. Deploy Both Separately in Production

```bash
# Terminal 1: Start API
docker-compose -f docker-compose.api.prod.yml up

# Terminal 2: Start Web App (after API is ready)
docker-compose -f docker-compose.web.prod.yml up
```

## Production Environment Variables

### API Production Deployment

Create a `.env` file with:

```env
# Database
DB_ROOT_PASSWORD=use-a-secure-password-in-production
DB_DATABASE=directus

# API Security
SECRET=generate-a-secure-random-value-for-production

# API
NEXT_PUBLIC_API_PORT=8055
API_ADMIN_TOKEN=your-secure-admin-token
NEXT_PUBLIC_API_URL=https://api.your-domain.com/

# Production Optimizations
LOG_LEVEL=warn
RATE_LIMITER_ENABLED=true
```

### Web Production Deployment

Create a `.env` file with:

```env
# API Connection (point to your production API)
NEXT_PUBLIC_API_URL=https://api.your-domain.com/
NEXT_PUBLIC_API_PORT=443
API_ADMIN_TOKEN=your-secure-admin-token

# Web App
NEXT_PUBLIC_APP_URL=https://www.your-domain.com
NEXT_PUBLIC_APP_PORT=3003
AUTH_SECRET=your-secure-auth-secret

# Production Mode Configuration
USE_LOCALHOST_CLIENT=false
NEXT_PUBLIC_USE_PROXY=false
DIRECTUS_SERVER_URL=https://api.your-domain.com/
```

## Key Production Configuration Features

### API Production Configuration
- Uses its own isolated network (`api_network`)
- Database and cache are included
- No dependencies on web services
- Enhanced security settings
- Rate limiting and other production optimizations

### Web Production Configuration
- Direct API connection (no proxy by default)
- Includes `wait-api` functionality to ensure API is ready
- Uses `USE_LOCALHOST_CLIENT=false` for production mode
- Can connect to API running anywhere (same server, different server, cloud service, etc.)
- Optimized production build with smaller Docker image

## Production Deployment

### API Server
```bash
# On your API server
docker-compose -f docker-compose.api-only.yml up -d
```

### Web Server
```bash
# On your web server, update .env to point to API server
NEXT_PUBLIC_API_URL=https://your-api-domain.com/
DIRECTUS_SERVER_URL=https://your-api-domain.com/

# Deploy web app
docker-compose -f docker-compose.web.prod.yml up -d
```

## Logs and Monitoring

```bash
# API logs
docker-compose -f docker-compose.api.prod.yml logs -f

# Web app logs
docker-compose -f docker-compose.web.prod.yml logs -f

# Specific service logs
docker-compose -f docker-compose.api.prod.yml logs -f api
```

## Stopping Production Services

```bash
# Stop API
docker-compose -f docker-compose.api.prod.yml down

# Stop Web App
docker-compose -f docker-compose.web.prod.yml down

# Stop and remove volumes (API)
docker-compose -f docker-compose.api.prod.yml down -v
```
