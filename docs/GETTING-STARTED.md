# Getting Started

This guide will help you get up and running with the NextJS-Directus-Turborepo template quickly. Follow these steps to set up your development environment and start building your application.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js**: Version 22 or higher
- **npm**: Version 10.8.1 or higher (comes with Node.js)
- **Docker**: Latest version
- **Docker Compose**: Latest version
- **Git**: Latest version

## Quick Start

### 1. Clone the Repository

Start by forking this template repository or cloning it directly:

```bash
# Option 1: Fork the repository on GitHub and then clone it
git clone https://github.com/your-username/nextjs-directus-turborepo-template.git

# Option 2: Clone directly
git clone https://github.com/original-author/nextjs-directus-turborepo-template.git

# Navigate to the project directory
cd nextjs-directus-turborepo-template
```

### 2. Project Initialization

Run the interactive initialization script to configure your project:

```bash
# Run the initialization wizard
bun run init
```

This interactive script will:
- Guide you through configuring all environment variables
- Validate your inputs based on the requirements
- Generate a properly formatted `.env` file
- Support different input types (strings, numbers, URLs, booleans, etc.)
- Provide smart defaults and validation rules

The initialization wizard supports various field types:
- **String fields**: Text input with optional validation
- **Number fields**: Numeric input with min/max constraints  
- **URL fields**: URL validation with protocol restrictions
- **Boolean fields**: Yes/no choices with custom labels
- **Select fields**: Single choice from predefined options
- **Multi-select fields**: Multiple choices with custom separators
- **Date fields**: Date input with format validation
- **Secure fields**: Password-style input for sensitive data

### 3. Install Dependencies

After initialization, install all project dependencies:

```bash
# Install dependencies
bun install
```

### 4. Start Development Environment

After initialization and dependency installation, start the development environment:

```bash
# Start the development server
bun run dev
```

This command:
- Starts the Directus API on the configured port (default: `8055`)
- Starts the Next.js development server on the configured port (default: `3003`)
- Sets up hot reloading for both applications
- Runs database migrations and seeds initial data

### 5. Access the Applications

After the development servers are running:

- **Next.js Web App**: http://localhost:3003
- **Directus Admin**: http://localhost:8055/admin
  - Default admin email: `admin@example.com`
  - Default admin password: `password` (change this immediately in production!)

## Environment Configuration

The template uses several environment files for different services and environments:

- `.env`: Main environment variables
- `.env.api.prod.example`: Example production API environment
- `.env.web.prod.example`: Example production web environment

### Key Environment Variables

#### API (Directus):
- `DB_ROOT_PASSWORD`: Database root password
- `DB_DATABASE`: Database name
- `NEXT_PUBLIC_API_URL`: URL where the API is accessible
- `API_ADMIN_TOKEN`: Admin token for API access

#### Web (Next.js):
- `NEXT_PUBLIC_API_URL`: URL to the Directus API
- `NEXT_PUBLIC_APP_URL`: URL where the web app is accessible
- `AUTH_SECRET`: Secret key for NextAuth

## Project Structure Overview

```
nextjs-directus-turborepo-template/
├── apps/
│   ├── api/              # Directus API instance
│   └── web/              # NextJS frontend application
├── packages/             # Shared packages
│   ├── ui/               # Shared UI components
│   └── ...               # Other shared packages
└── docs/                 # Documentation
```

For a more detailed understanding of the project structure, refer to [Architecture Overview](./ARCHITECTURE.md).

## Development Mode Options

### 1. Standard Docker Development

The default development setup runs everything in Docker containers:

```bash
bun run dev
```

### 2. Local Development

Run components directly on your local machine (not in Docker):

```bash
bun run dev:local
```

### 3. Partial Local Development

Run only specific components locally:

```bash
# Start just the API
bun run api -- dev

# Start just the web app
bun run web -- dev
```

## Initial Customization Steps

After setup, you may want to:

1. **Update Project Information**:
   - Change the name in the root `package.json`
   - Update the README.md with your project details

2. **Configure Authentication**:
   - Update NextAuth configuration in `apps/web/src/lib/auth.ts`
   - Set up custom user roles in Directus

3. **Set Up Data Models**:
   - Create content collections in Directus
   - Generate or update types for your models

4. **Customize UI**:
   - Update theme settings in `packages/ui/components/theme-provider.tsx`
   - Modify default layout in `apps/web/src/app/layout.tsx`

## Next Steps

Once you have your environment set up, check out these guides:

- [Development Workflow](./DEVELOPMENT-WORKFLOW.md): Day-to-day development practices
- [Web App Structure](./WEB-APP.md): Details on the Next.js application structure
- [API Service Configuration](./API-SERVICE.md): Working with the Directus API
- [Authentication](./AUTHENTICATION.md): Understanding the authentication flow

## Troubleshooting

If you encounter issues during setup:

- Ensure Docker is running correctly
- Check that ports 3003 and 8055 are not used by other applications
- Verify that environment variables are correctly set up
- See [Troubleshooting Guide](./TROUBLESHOOTING.md) for common issues

---

For more advanced setup options and configurations, refer to the specific documentation for each component.
