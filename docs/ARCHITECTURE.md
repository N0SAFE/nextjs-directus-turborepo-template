# Architecture Overview

This document provides a high-level overview of the NextJS-Directus-Turborepo template architecture, explaining how the various components interact with each other.

## Monorepo Structure

This project uses a Turborepo-based monorepo architecture, which organizes code into apps and packages:

```
nextjs-directus-turborepo-template/
├── apps/                      # Applications
│   ├── api/                   # Directus API instance
│   └── web/                   # NextJS frontend application
├── packages/                  # Shared packages
│   ├── bin/                   # CLI tools and scripts
│   ├── directus-sdk/          # Directus SDK wrapper
│   ├── eslint-config/         # Shared ESLint configurations
│   ├── prettier-config/       # Shared Prettier configurations  
│   ├── tailwind-config/       # Shared Tailwind CSS configurations
│   ├── tsconfig/              # Shared TypeScript configurations
│   ├── types/                 # Shared TypeScript type definitions
│   └── ui/                    # Shared UI component library with Shadcn UI
└── docs/                      # Documentation
```

## Component Architecture

### API Layer (`apps/api`)

The API layer is built on Directus, a headless CMS and API platform. It provides:

- **RESTful API**: For data access and manipulation
- **GraphQL API**: Alternative query interface for complex data needs
- **Authentication**: User management and authentication endpoints
- **Authorization**: Role-based access control
- **Content Management**: Admin interface for content creation and management
- **Extensions**: Custom extensions for business logic and data seeding

### Web Layer (`apps/web`)

The web application is built with Next.js and provides:

- **Server Components**: Modern React application using Next.js App Router
- **Authentication**: Integration with NextAuth tied to Directus users
- **Data Fetching**: Uses React Query to efficiently fetch and cache data
- **UI Components**: Utilizes Shadcn UI and Tailwind for responsive design
- **Routing**: Uses declarative-routing for API route documentation

### Shared Packages

- **UI Library**: Reusable React components with Tailwind and Shadcn UI
- **Directus SDK**: Typed client for API communication
- **Configuration Packages**: Shared configs for consistent development experience

## Data Flow

1. **Client Request Flow**:
   - User interacts with the Next.js web application
   - Client-side code may use React Query to request data
   - Server components may make direct API calls to Directus

2. **Authentication Flow**:
   - NextAuth integration with Directus for user authentication
   - JWT tokens used for session management
   - Role-based permissions enforced by Directus

3. **API Communication**:
   - Directus SDK package provides typed access to API
   - Fetch operations wrapped in React Query for efficient caching
   - Environment configuration determines API endpoints

## Docker Architecture

The system is containerized using Docker, with separate containers for:

- **Next.js Web**: The frontend application
- **Directus API**: The backend API and admin interface
- **MySQL**: Database for persistent storage
- **Redis**: Cache for performance optimization

## Development and Production Environments

The architecture supports multiple deployment strategies:

1. **Combined Development**: All services running together for development
2. **Separate Production Services**: Independent scaling of API and web services
3. **Customizable Deployment**: Options for various hosting environments

For details on deployment options, see [Production Deployment](./PRODUCTION-DEPLOYMENT.md) and [Deployment Strategies](./DEPLOYMENT-STRATEGIES.md).

## Infrastructure Dependencies

- **Node.js**: Runtime environment for JavaScript code
- **Docker/Docker Compose**: Container management for local and production
- **MySQL**: Relational database for Directus
- **Redis**: Optional caching layer for performance
- **Turbo**: Build system and task runner for the monorepo

## Performance Considerations

- **Edge-ready**: Next.js application can be deployed to edge locations
- **Caching**: React Query provides efficient client-side caching
- **Build Optimization**: Turborepo enables efficient builds with caching
- **API Efficiency**: Directus provides optimized data access
