# Directus Type Generation from Docker

This document explains how to generate Directus TypeScript types from within the Docker development environment.

## Prerequisites

- Docker and Docker Compose installed
- Development environment running (`docker compose up`)

## Generating Types

To generate Directus types from inside the Docker container, run:

```bash
docker compose exec web bun run generate --workspace=@repo/directus-sdk
```

This command will:

1. Wait for the Directus API health endpoint to be available (`http://api:8055/server/health`)
2. Connect to the Directus instance running in the `api` container
3. Fetch the current schema from Directus
4. Generate TypeScript types and client code
5. Save the generated files to `packages/directus-sdk/indirectus/`

## Generated Files

The type generation creates several files in `packages/directus-sdk/indirectus/`:

- `client.ts` - Main TypeScript types and client interface
- `commands/` - Collection-specific command definitions
- `types/` - Type definitions
- `bindings/` - SDK bindings
- `utils/` - Utility functions

## Environment Variables

The type generation uses these environment variables:

- `API_URL=http://api:8055` - Internal Docker network URL for the Directus API
- `API_PING_PATH=/server/health` - Health check endpoint path
- `API_ADMIN_TOKEN` - Admin token for accessing Directus API

## Troubleshooting

### Health Check Failed
If you get connection errors, ensure:
1. The Directus container is running: `docker compose ps`
2. The API is healthy: `docker compose exec api curl http://localhost:8055/server/health`

### Permission Errors
If you get permission errors on generated files, run:
```bash
docker compose exec web chown -R node:node packages/directus-sdk/indirectus/
```

### Environment Variable Issues
Check that environment variables are correctly set:
```bash
docker compose exec web env | grep API_
```

## Integration

The generated types can be imported in your Next.js application:

```typescript
import { Types } from '@repo/directus-sdk/indirectus/client';
// Use Types.YourCollection for type safety
```

## Updating Types

Run the generation command whenever:
- You modify collections in Directus
- You add/remove fields
- You change field types
- You update Directus version

The types will automatically reflect your current Directus schema.
