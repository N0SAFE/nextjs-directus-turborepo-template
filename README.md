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
- MySQL/MariaDB for Directus
- pnpm (recommended) or yarn/npm

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone [your-repo-url]
   cd nextjs-directus-turborepo-template
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**
   - Copy `.env.example` to `.env` in both `apps/web` and `apps/api` directories
   - Configure your environment variables:
     - Database connection details for Directus
     - Authentication settings
     - API endpoints

4. **Initialize the Database**
   ```bash
   cd apps/api
   pnpm run db:init
   pnpm run seed # Optional: Run seeder for sample data
   ```

5. **Start Development Servers**
   ```bash
   pnpm run dev
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
   pnpm run dev # Starts all services
   ```

2. **Building for Production**
   ```bash
   pnpm run build # Builds all apps and packages
   ```

3. **Running Tests**
   ```bash
   pnpm run test # Runs tests across all packages
   ```

4. **Linting and Formatting**
   ```bash
   pnpm run lint # Run ESLint
   pnpm run format # Run Prettier
   ```

## Adding New Components

1. Use Shadcn UI CLI to add new components:
   ```bash
   cd packages/ui
   pnpm dlx shadcn-ui@latest add [component-name]
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