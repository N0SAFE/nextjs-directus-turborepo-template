import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import {
  CliCommand,
  CliCommandResult,
  DirectoryListing,
  FileContent,
  SystemInfo,
  EnvironmentInfo,
  PackageInfo,
  BuildInfo,
  RoutesAnalysis,
  FileInfo,
} from '@repo/api-contracts';

const execAsync = promisify(exec);

@Injectable()
export class DevToolsService {
  private readonly projectRoot = process.cwd();

  /**
   * Execute a CLI command
   */
  async executeCommand(command: CliCommand): Promise<CliCommandResult> {
    const startTime = Date.now();
    const fullCommand = command.args 
      ? `${command.command} ${command.args.join(' ')}` 
      : command.command;

    try {
      const { stdout, stderr } = await execAsync(fullCommand, {
        cwd: command.cwd || this.projectRoot,
        env: { ...process.env, ...command.env },
        timeout: 30000, // 30 second timeout
      });

      return {
        success: true,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: 0,
        duration: Date.now() - startTime,
        command: fullCommand,
      };
    } catch (error: any) {
      return {
        success: false,
        stdout: error.stdout?.trim() || '',
        stderr: error.stderr?.trim() || error.message,
        exitCode: error.code || 1,
        duration: Date.now() - startTime,
        command: fullCommand,
      };
    }
  }

  /**
   * Get available npm scripts
   */
  async getScripts(): Promise<Record<string, string>> {
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      return packageJson.scripts || {};
    } catch (error) {
      return {};
    }
  }

  /**
   * Execute an npm script
   */
  async runScript(script: string, args?: string[]): Promise<CliCommandResult> {
    const command: CliCommand = {
      command: 'npm',
      args: ['run', script, ...(args || [])],
    };
    return this.executeCommand(command);
  }

  /**
   * List directory contents
   */
  async listDirectory(
    dirPath?: string,
    includeHidden?: boolean,
    maxDepth?: number
  ): Promise<DirectoryListing> {
    const targetPath = dirPath ? path.resolve(this.projectRoot, dirPath) : this.projectRoot;
    
    try {
      const entries = await fs.readdir(targetPath, { withFileTypes: true });
      const files: FileInfo[] = [];
      let totalFiles = 0;
      let totalDirectories = 0;

      for (const entry of entries) {
        if (!includeHidden && entry.name.startsWith('.')) {
          continue;
        }

        const fullPath = path.join(targetPath, entry.name);
        const stats = await fs.stat(fullPath);
        
        const fileInfo: FileInfo = {
          name: entry.name,
          path: path.relative(this.projectRoot, fullPath),
          size: stats.size,
          isDirectory: entry.isDirectory(),
          modifiedAt: stats.mtime.toISOString(),
          extension: entry.isFile() ? path.extname(entry.name) : undefined,
        };

        files.push(fileInfo);

        if (entry.isDirectory()) {
          totalDirectories++;
        } else {
          totalFiles++;
        }
      }

      return {
        path: path.relative(this.projectRoot, targetPath),
        files: files.sort((a, b) => {
          // Directories first, then files, both alphabetically
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        }),
        totalFiles,
        totalDirectories,
      };
    } catch (error) {
      throw new Error(`Failed to list directory: ${error.message}`);
    }
  }

  /**
   * Read file content
   */
  async readFile(filePath: string, encoding?: string): Promise<FileContent> {
    const targetPath = path.resolve(this.projectRoot, filePath);
    
    try {
      const stats = await fs.stat(targetPath);
      const content = await fs.readFile(targetPath, encoding as BufferEncoding || 'utf-8');
      
      return {
        path: path.relative(this.projectRoot, targetPath),
        content,
        encoding: encoding || 'utf-8',
        size: stats.size,
      };
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const targetPath = path.resolve(this.projectRoot, filePath);
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get system information
   */
  async getSystemInfo(): Promise<SystemInfo> {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();

    return {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      npmVersion: await this.getNpmVersion(),
      memory: {
        total: totalMem,
        free: freeMem,
        used: totalMem - freeMem,
      },
      cpu: {
        model: cpus[0]?.model || 'Unknown',
        cores: cpus.length,
      },
      uptime: os.uptime(),
    };
  }

  /**
   * Get environment information
   */
  async getEnvironmentInfo(): Promise<EnvironmentInfo> {
    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      variables: this.getSafeEnvironmentVariables(),
      processId: process.pid,
      workingDirectory: process.cwd(),
    };
  }

  /**
   * Get current working directory
   */
  async getCurrentWorkingDirectory(): Promise<string> {
    return process.cwd();
  }

  /**
   * Get package.json information
   */
  async getPackageInfo(packagePath?: string): Promise<PackageInfo> {
    const targetPath = packagePath 
      ? path.resolve(this.projectRoot, packagePath, 'package.json')
      : path.join(this.projectRoot, 'package.json');

    try {
      const packageJson = JSON.parse(await fs.readFile(targetPath, 'utf-8'));
      
      return {
        name: packageJson.name || 'Unknown',
        version: packageJson.version || '0.0.0',
        description: packageJson.description,
        scripts: packageJson.scripts || {},
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
        workspaces: packageJson.workspaces,
      };
    } catch (error) {
      throw new Error(`Failed to read package.json: ${error.message}`);
    }
  }

  /**
   * Get build information
   */
  async getBuildInfo(): Promise<BuildInfo> {
    // This is a basic implementation - can be enhanced based on build system
    try {
      const buildInfoPath = path.join(this.projectRoot, '.next', 'build-manifest.json');
      const buildExists = await this.fileExists('.next/build-manifest.json');
      
      if (buildExists) {
        const buildManifest = JSON.parse(await fs.readFile(buildInfoPath, 'utf-8'));
        return {
          buildTime: new Date().toISOString(),
          bundleSize: {
            total: 0, // Would need to calculate from actual build
            gzipped: 0,
            chunks: [],
          },
        };
      }

      return {
        buildTime: undefined,
        bundleSize: undefined,
      };
    } catch (error) {
      return {
        buildTime: undefined,
        bundleSize: undefined,
      };
    }
  }

  /**
   * Analyze project routes
   */
  async analyzeRoutes(): Promise<RoutesAnalysis> {
    // Basic route analysis - can be enhanced based on framework
    try {
      const appDir = path.join(this.projectRoot, 'apps', 'web', 'src', 'app');
      const routes = await this.scanForRoutes(appDir);

      return {
        routes,
        totalRoutes: routes.length,
        apiRoutes: routes.filter(r => r.path.includes('/api/')).length,
        pageRoutes: routes.filter(r => !r.path.includes('/api/')).length,
        protectedRoutes: routes.filter(r => r.isProtected).length,
      };
    } catch (error) {
      return {
        routes: [],
        totalRoutes: 0,
        apiRoutes: 0,
        pageRoutes: 0,
        protectedRoutes: 0,
      };
    }
  }

  /**
   * Get workspace information
   */
  async getWorkspaces(): Promise<Array<{ name: string; path: string; packageInfo: PackageInfo }>> {
    try {
      const rootPackage = await this.getPackageInfo();
      const workspaces: Array<{ name: string; path: string; packageInfo: PackageInfo }> = [];

      if (rootPackage.workspaces) {
        for (const workspace of rootPackage.workspaces) {
          try {
            const workspacePath = path.resolve(this.projectRoot, workspace);
            const packageInfo = await this.getPackageInfo(workspace);
            workspaces.push({
              name: packageInfo.name,
              path: workspace,
              packageInfo,
            });
          } catch (error) {
            // Skip invalid workspaces
          }
        }
      }

      return workspaces;
    } catch (error) {
      return [];
    }
  }

  /**
   * Clear cache
   */
  async clearCache(type?: 'npm' | 'next' | 'all'): Promise<{
    success: boolean;
    message: string;
    clearedPaths: string[];
  }> {
    const clearedPaths: string[] = [];
    
    try {
      if (type === 'npm' || type === 'all') {
        await this.executeCommand({ command: 'npm', args: ['cache', 'clean', '--force'] });
        clearedPaths.push('npm cache');
      }

      if (type === 'next' || type === 'all') {
        const nextCachePath = path.join(this.projectRoot, '.next');
        if (await this.fileExists('.next')) {
          await fs.rm(nextCachePath, { recursive: true, force: true });
          clearedPaths.push('.next directory');
        }
      }

      return {
        success: true,
        message: `Successfully cleared ${clearedPaths.join(', ')}`,
        clearedPaths,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to clear cache: ${error.message}`,
        clearedPaths,
      };
    }
  }

  /**
   * Get hot reload status
   */
  async getHotReloadStatus(): Promise<{
    enabled: boolean;
    mode: string;
    lastReload?: string;
  }> {
    return {
      enabled: process.env.NODE_ENV === 'development',
      mode: process.env.NODE_ENV || 'production',
      lastReload: undefined, // Would need to track actual reloads
    };
  }

  /**
   * Get error logs
   */
  async getLogs(
    level?: 'error' | 'warn' | 'info' | 'debug',
    limit?: number,
    since?: string
  ): Promise<Array<{
    level: string;
    message: string;
    timestamp: string;
    source?: string;
  }>> {
    // Basic implementation - would need proper logging system
    return [];
  }

  // Helper methods

  private async getNpmVersion(): Promise<string> {
    try {
      const result = await this.executeCommand({ command: 'npm', args: ['--version'] });
      return result.success ? result.stdout : 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  private getSafeEnvironmentVariables(): Record<string, string> {
    const safe: Record<string, string> = {};
    const sensitiveKeys = ['password', 'secret', 'key', 'token', 'auth'];
    
    for (const [key, value] of Object.entries(process.env)) {
      if (value && !sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        safe[key] = value;
      }
    }
    
    return safe;
  }

  private async scanForRoutes(dir: string, basePath = ''): Promise<Array<{
    path: string;
    method?: string;
    handler?: string;
    middlewares?: string[];
    params?: string[];
    isProtected?: boolean;
  }>> {
    const routes: Array<{
      path: string;
      method?: string;
      handler?: string;
      middlewares?: string[];
      params?: string[];
      isProtected?: boolean;
    }> = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subRoutes = await this.scanForRoutes(fullPath, path.join(basePath, entry.name));
          routes.push(...subRoutes);
        } else if (entry.name === 'page.tsx' || entry.name === 'route.ts') {
          const routePath = basePath || '/';
          routes.push({
            path: routePath,
            handler: entry.name,
            isProtected: await this.checkIfProtected(fullPath),
          });
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }

    return routes;
  }

  private async checkIfProtected(filePath: string): Promise<boolean> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      // Simple check for authentication patterns
      return content.includes('auth') || content.includes('protected') || content.includes('middleware');
    } catch {
      return false;
    }
  }
}