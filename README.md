# Next.js Directus Turborepo Template

A modern, full-stack monorepo template featuring Next.js, Directus CMS, Shadcn UI, and TypeScript with authentication and declarative routing.

## Features

- 🚀 **Full-Stack Setup**: Next.js frontend + Directus headless CMS backend
- 📦 **Monorepo Structure**: Organized with Turborepo for efficient development
- 🎨 **Modern UI**: Shadcn UI components with Tailwind CSS
- 🔐 **Authentication**: Integrated NextAuth.js with Directus
- 🛣️ **Routing**: Declarative routing system for better organization
- 📱 **Type Safety**: Full TypeScript support across all packages
- 🔧 **Development Tools**: ESLint, Prettier, and TypeScript configurations

## Prerequisites

- Node.js 18 or later
- npm (recommended) or yarn

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone [your-repo-url]
   cd nextjs-directus-turborepo-template
   ```

2. **Initialize the Project**
   ```bash
   npm run init 
   ```
   this will install dependencies and question you about your installation preference

3. **Start Development Servers**
   ```bash
   npm run dev
   ```
   This will start:
   - Next.js frontend at http://localhost:3000
   - Directus API at http://localhost:8055

## Project Structure

### Apps
- `web/`: Next.js frontend application
  - Features Shadcn UI components
  - NextAuth.js integration
  - Declarative routing system
  - API integration with Directus

- `api/`: Directus backend
  - Custom extensions
  - Seeder functionality
  - Database migrations
  - File upload handling

### Packages
- `ui/`: Shared React component library
- `directus-sdk/`: Custom Directus SDK wrapper
- `eslint-config/`: Shared ESLint configurations
- `prettier-config/`: Shared Prettier configurations
- `tailwind-config/`: Shared Tailwind CSS configuration
- `tsconfig/`: Shared TypeScript configurations
- `types/`: Shared TypeScript types

## Development Workflow

1. **Running the Development Environment**
   ```bash
   npm run dev # Starts all services
   ```

2. **Building for Production**
   ```bash
   npm run build # Builds all apps and packages
   ```

3. **Running Tests**
   ```bash
   npm run test # Runs tests across all packages
   ```

4. **Linting and Formatting**
   ```bash
   npm run lint # Run ESLint
   npm run format # Run Prettier
   ```

## Adding New Components

1. Use Shadcn UI CLI to add new components:
   ```bash
   npm run ui:add [component-name]
   ```

2. Components will be available in `packages/ui/components/`

## Deployment

### Frontend (Next.js)
- Optimized for Vercel deployment
- Supports other platforms (AWS, DigitalOcean, etc.)

### Backend (Directus)
- Can be deployed to any Node.js hosting platform
- Docker configuration available for containerized deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Turborepo](https://turbo.build/)
- [Next.js](https://nextjs.org/)
- [Directus](https://directus.io/)
- [Shadcn UI](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styles
- [Shadcn UI](https://ui.shadcn.com/) for ui components
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [next-auth](https://next-auth.js.org/) for authentication {linked with directus}
- [directus](https://directus.io/) for headless CMS
- [tsup](https://github.com/egoist/tsup) for bundling
- [declarative-routing](https://github.com/ProNextJS/declarative-routing/blob/main/docs/nextjs.md) for routing

## Deployment Options

This template supports multiple deployment strategies:

### 1. Combined Docker Compose (Development/Single Server)

Deploy both API and web app together:

```bash
# Development
npm run docker:dev
# or
docker-compose -f docker-compose.dev.yml up

# Production
npm run docker:prod
# or
docker-compose -f docker-compose.prod.yml up --build
```

### 2. Production Deployments (Separate Services)

For production, deploy API and web app separately for better scalability and security.

#### Deploy API in Production

```bash
# Copy production environment template
cp .env.api.prod.example .env
# Update variables for your production environment

# Start API services
npm run prod:api:build
# or
docker-compose -f docker-compose.api.prod.yml up --build
```

#### Deploy Web App in Production (requires running API)

```bash
# Copy production environment template
cp .env.web.prod.example .env
# Update NEXT_PUBLIC_API_URL to point to your production API server

# Start web app
npm run prod:web:build
# or
docker-compose -f docker-compose.web.prod.yml up --build
```

### 3. Available Scripts

```bash
# Combined Development
npm run docker:dev          # Start combined development environment

# Combined Production
npm run docker:prod         # Start combined production environment

# Production API Only
npm run prod:api            # Start API services
npm run prod:api:build      # Build and start API services
npm run prod:api:down       # Stop API services
npm run prod:logs:api       # View API logs

# Production Web Only
npm run prod:web            # Start web app
npm run prod:web:build      # Build and start web app
npm run prod:web:down       # Stop web app
npm run prod:logs:web       # View web app logs
```

### 4. Production Deployment Guide

For detailed production deployment instructions, see [PRODUCTION-DEPLOYMENT.md](./docs/PRODUCTION-DEPLOYMENT.md).

**Benefits of production deployment:**
- Scale API and web app independently
- Deploy to different servers/regions
- Better security isolation
- Easier maintenance and updates
- Optimized for production environments

## Documentation

For comprehensive documentation on this monorepo template, please refer to the `/docs` directory:

- [Architecture Overview](./docs/ARCHITECTURE.md) - High-level architecture and component interaction
- [Technology Stack](./docs/TECH-STACK.md) - Detailed explanation of technology choices
- [Getting Started](./docs/GETTING-STARTED.md) - Quick start guide
- [Development Workflow](./docs/DEVELOPMENT-WORKFLOW.md) - Day-to-day development practices

Additional documentation will be added to the `/docs` directory as the project evolves.

---

<!-- Legacy deployment info -->
### Legacy Single-Server Deployment

For simple single-server deployment, deploy the API first, then the web app:

```bash
docker-compose up -d --build api
docker-compose up -d --build web
```