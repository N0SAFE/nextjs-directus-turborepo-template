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