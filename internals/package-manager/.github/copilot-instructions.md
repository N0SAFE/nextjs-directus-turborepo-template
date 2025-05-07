<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This project is a Node.js CLI tool written in TypeScript for managing monorepo packages. It supports importing packages from GitHub, GitLab, local folders, or internet downloads, renaming packages, updating TypeScript import aliases, and managing shared dependencies via a configurable shared package.

**Testing instructions:**
Always create or update tests inside the `src/__tests__` folder. The test directory must mimic the structure of the code under `src/` (e.g., `src/__tests__/utils/PackageImporter.test.ts` for `src/utils/PackageImporter.ts`). Ensure all new features, bug fixes, and refactors are fully covered by tests. Strive for full coverage of all functionalities in this repository.
