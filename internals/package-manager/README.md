# Package Manager CLI

This is a Node.js CLI tool written in TypeScript for managing packages in a monorepo. It supports:

- Importing packages from GitHub, GitLab, local folders, or internet downloads
- Renaming packages to the format `@repo/package`
- Updating TypeScript import aliases and internal imports
- Managing shared dependencies via a `shared` package with a configurable whitelist

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Build the project:
   ```sh
   npx tsc
   ```
3. Run the CLI:
   ```sh
   npx ts-node src/main.ts
   ```

## Project Structure
- `src/` - Source code for the CLI and utilities
- `.github/copilot-instructions.md` - Custom Copilot instructions
- `.vscode/tasks.json` - VS Code tasks

## Features
- Import packages from various sources
- Rename and re-alias packages for monorepo compatibility
- Centralize and manage shared dependencies

## Configuration
- The shared package uses a config file to whitelist dependencies to share.
