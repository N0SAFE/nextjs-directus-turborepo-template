import { ORPCController, ORPCRoute } from '@orpc/nest';
import { devtoolsContract } from '@repo/api-contracts';
import { DevToolsService } from './devtools.service';

@ORPCController(devtoolsContract)
export class DevToolsController {
  constructor(private readonly devToolsService: DevToolsService) {}

  // CLI operations
  @ORPCRoute(devtoolsContract.cli.execute)
  async executeCommand(input: any) {
    return this.devToolsService.executeCommand(input);
  }

  @ORPCRoute(devtoolsContract.cli.getScripts)
  async getScripts() {
    return this.devToolsService.getScripts();
  }

  @ORPCRoute(devtoolsContract.cli.runScript)
  async runScript(input: { script: string; args?: string[] }) {
    return this.devToolsService.runScript(input.script, input.args);
  }

  // File system operations
  @ORPCRoute(devtoolsContract.files.list)
  async listDirectory(input: { path?: string; includeHidden?: boolean; maxDepth?: number }) {
    return this.devToolsService.listDirectory(input.path, input.includeHidden, input.maxDepth);
  }

  @ORPCRoute(devtoolsContract.files.read)
  async readFile(input: { path: string; encoding?: string }) {
    return this.devToolsService.readFile(input.path, input.encoding);
  }

  @ORPCRoute(devtoolsContract.files.exists)
  async fileExists(input: { path: string }) {
    return this.devToolsService.fileExists(input.path);
  }

  // System information
  @ORPCRoute(devtoolsContract.system.info)
  async getSystemInfo() {
    return this.devToolsService.getSystemInfo();
  }

  @ORPCRoute(devtoolsContract.system.environment)
  async getEnvironmentInfo() {
    return this.devToolsService.getEnvironmentInfo();
  }

  @ORPCRoute(devtoolsContract.system.cwd)
  async getCurrentWorkingDirectory() {
    return this.devToolsService.getCurrentWorkingDirectory();
  }

  // Project analysis
  @ORPCRoute(devtoolsContract.project.packageInfo)
  async getPackageInfo(input: { path?: string }) {
    return this.devToolsService.getPackageInfo(input.path);
  }

  @ORPCRoute(devtoolsContract.project.buildInfo)
  async getBuildInfo() {
    return this.devToolsService.getBuildInfo();
  }

  @ORPCRoute(devtoolsContract.project.routes)
  async analyzeRoutes() {
    return this.devToolsService.analyzeRoutes();
  }

  @ORPCRoute(devtoolsContract.project.workspaces)
  async getWorkspaces() {
    return this.devToolsService.getWorkspaces();
  }

  // Development tools
  @ORPCRoute(devtoolsContract.dev.clearCache)
  async clearCache(input: { type?: 'npm' | 'next' | 'all' }) {
    return this.devToolsService.clearCache(input.type);
  }

  @ORPCRoute(devtoolsContract.dev.hotReload)
  async getHotReloadStatus() {
    return this.devToolsService.getHotReloadStatus();
  }

  @ORPCRoute(devtoolsContract.dev.logs)
  async getLogs(input: { level?: 'error' | 'warn' | 'info' | 'debug'; limit?: number; since?: string }) {
    return this.devToolsService.getLogs(input.level, input.limit, input.since);
  }
}