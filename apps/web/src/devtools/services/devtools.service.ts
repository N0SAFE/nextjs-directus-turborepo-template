import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { globSync } from 'glob';

const execAsync = promisify(exec);

export class DevtoolsService {
  private readonly projectRoot: string;

  constructor() {
    // Get project root (assuming this service runs from the web app)
    this.projectRoot = process.cwd();
  }

  // Enhanced CLI operations
  async executeCommand(input: { command: string; args?: string[]; cwd?: string; timeout?: number }) {
    const startTime = Date.now();
    
    try {
      const command = input.args ? `${input.command} ${input.args.join(' ')}` : input.command;
      const options = {
        cwd: input.cwd || this.projectRoot,
        timeout: input.timeout || 30000,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      };

      const { stdout, stderr } = await execAsync(command, options);
      
      return {
        success: true,
        output: stdout || '',
        error: stderr || undefined,
        exitCode: 0,
        duration: Date.now() - startTime,
        command: command,
        cwd: options.cwd,
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || '',
        error: error.stderr || error.message,
        exitCode: error.code || 1,
        duration: Date.now() - startTime,
        command: input.command,
        cwd: input.cwd || this.projectRoot,
      };
    }
  }

  async executeCommandStream(input: { command: string; args?: string[]; cwd?: string }) {
    return new Promise((resolve, reject) => {
      const command = input.command;
      const args = input.args || [];
      const options = {
        cwd: input.cwd || this.projectRoot,
        stdio: 'pipe' as const,
      };

      const child = spawn(command, args, options);
      let stdout = '';
      let stderr = '';
      const startTime = Date.now();

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({
          success: code === 0,
          output: stdout,
          error: stderr || undefined,
          exitCode: code || 0,
          duration: Date.now() - startTime,
          command: `${command} ${args.join(' ')}`.trim(),
          cwd: options.cwd,
        });
      });

      child.on('error', (error) => {
        reject({
          success: false,
          output: stdout,
          error: error.message,
          exitCode: 1,
          duration: Date.now() - startTime,
          command: `${command} ${args.join(' ')}`.trim(),
          cwd: options.cwd,
        });
      });
    });
  }

  async getScripts() {
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      return packageJson.scripts || {};
    } catch (error) {
      return {};
    }
  }

  async runScript(script: string, args?: string[]) {
    const command = `npm run ${script}`;
    return this.executeCommand({ command, args });
  }

  async getAvailableCommands() {
    const commands = [];
    
    // Get npm scripts
    const scripts = await this.getScripts();
    for (const [name, script] of Object.entries(scripts)) {
      commands.push({
        name: `npm run ${name}`,
        description: script as string,
        type: 'npm-script',
      });
    }

    // Common CLI commands
    const commonCommands = [
      { name: 'ls', description: 'List directory contents', type: 'system' },
      { name: 'pwd', description: 'Print working directory', type: 'system' },
      { name: 'whoami', description: 'Print current user', type: 'system' },
      { name: 'node --version', description: 'Node.js version', type: 'system' },
      { name: 'npm --version', description: 'npm version', type: 'system' },
      { name: 'git status', description: 'Git repository status', type: 'git' },
      { name: 'git log --oneline -5', description: 'Recent git commits', type: 'git' },
      { name: 'git branch', description: 'Git branches', type: 'git' },
    ];

    commands.push(...commonCommands);
    
    return commands;
  }

  // Enhanced system information
  async getSystemInfo() {
    const cpus = os.cpus();
    
    return {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      npmVersion: await this.getNpmVersion(),
      hostname: os.hostname(),
      uptime: os.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
      },
      cpu: {
        cores: cpus.length,
        model: cpus[0]?.model || 'Unknown',
      },
      loadAverage: os.loadavg(),
    };
  }

  async getEnvironmentInfo() {
    const envVars = process.env;
    
    // Filter out sensitive environment variables
    const filteredEnv = Object.fromEntries(
      Object.entries(envVars).filter(([key]) => 
        !key.toLowerCase().includes('secret') &&
        !key.toLowerCase().includes('key') &&
        !key.toLowerCase().includes('token') &&
        !key.toLowerCase().includes('password')
      )
    );

    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
      variables: filteredEnv,
      paths: (process.env.PATH || '').split(path.delimiter),
      cwd: process.cwd(),
    };
  }

  // Routes analysis
  async getRoutes() {
    try {
      const routes = [];
      
      // Get Next.js routes from app directory
      const appDir = path.join(this.projectRoot, 'src', 'app');
      if (await this.pathExists(appDir)) {
        const appRoutes = await this.discoverAppRoutes(appDir);
        routes.push(...appRoutes);
      }

      // Get API routes
      const apiDir = path.join(this.projectRoot, 'src', 'app', 'api');
      if (await this.pathExists(apiDir)) {
        const apiRoutes = await this.discoverApiRoutes(apiDir);
        routes.push(...apiRoutes);
      }

      return routes;
    } catch (error) {
      console.error('Error discovering routes:', error);
      return [];
    }
  }

  private async discoverAppRoutes(appDir: string, basePath = ''): Promise<any[]> {
    const routes = [];
    
    try {
      const files = await fs.readdir(appDir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(appDir, file.name);
        const routePath = path.join(basePath, file.name);
        
        if (file.isDirectory()) {
          // Skip certain directories
          if (['api', '(groups)', 'globals.css'].includes(file.name)) {
            continue;
          }
          
          // Recursively check subdirectories
          const subRoutes = await this.discoverAppRoutes(fullPath, routePath);
          routes.push(...subRoutes);
        } else if (file.name === 'page.tsx' || file.name === 'page.ts') {
          // Found a page route
          const route = '/' + basePath.replace(/\\/g, '/');
          routes.push({
            path: route === '/' ? '/' : route,
            type: 'page',
            file: fullPath,
            dynamic: routePath.includes('['),
          });
        } else if (file.name === 'layout.tsx' || file.name === 'layout.ts') {
          // Found a layout
          const route = '/' + basePath.replace(/\\/g, '/');
          routes.push({
            path: route === '/' ? '/' : route,
            type: 'layout', 
            file: fullPath,
            dynamic: routePath.includes('['),
          });
        }
      }
    } catch (error) {
      console.error('Error reading app directory:', error);
    }
    
    return routes;
  }

  private async discoverApiRoutes(apiDir: string, basePath = ''): Promise<any[]> {
    const routes = [];
    
    try {
      const files = await fs.readdir(apiDir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(apiDir, file.name);
        const routePath = path.join(basePath, file.name);
        
        if (file.isDirectory()) {
          // Recursively check subdirectories
          const subRoutes = await this.discoverApiRoutes(fullPath, routePath);
          routes.push(...subRoutes);
        } else if (file.name === 'route.ts' || file.name === 'route.tsx') {
          // Found an API route
          const route = '/api/' + basePath.replace(/\\/g, '/');
          
          // Try to determine supported HTTP methods
          const methods = await this.getApiRouteMethods(fullPath);
          
          routes.push({
            path: route,
            type: 'api',
            file: fullPath,
            dynamic: routePath.includes('['),
            methods,
          });
        }
      }
    } catch (error) {
      console.error('Error reading API directory:', error);
    }
    
    return routes;
  }

  private async getApiRouteMethods(filePath: string): Promise<string[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const methods = [];
      
      // Look for exported functions that match HTTP methods
      const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
      for (const method of httpMethods) {
        if (content.includes(`export async function ${method}`) || 
            content.includes(`export function ${method}`)) {
          methods.push(method);
        }
      }
      
      return methods;
    } catch (error) {
      return [];
    }
  }

  // Bundle and dependencies analysis
  async getBundleInfo() {
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};
      const peerDependencies = packageJson.peerDependencies || {};
      
      // Get build files info if they exist
      const buildInfo = await this.getBuildFiles();
      
      return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        peerDependencies: Object.keys(peerDependencies).length,
        totalDependencies: Object.keys(dependencies).length + Object.keys(devDependencies).length,
        dependencyList: {
          runtime: dependencies,
          development: devDependencies,
          peer: peerDependencies,
        },
        buildInfo,
      };
    } catch (error) {
      console.error('Error getting bundle info:', error);
      return {
        dependencies: 0,
        devDependencies: 0,
        peerDependencies: 0,
        totalDependencies: 0,
        dependencyList: { runtime: {}, development: {}, peer: {} },
        buildInfo: null,
      };
    }
  }

  private async getBuildFiles() {
    try {
      const buildDir = path.join(this.projectRoot, '.next');
      if (!(await this.pathExists(buildDir))) {
        return null;
      }

      // Get build size info
      const { stdout } = await execAsync(`du -sh ${buildDir}`, { cwd: this.projectRoot });
      const buildSize = stdout.trim().split('\t')[0];
      
      return {
        buildDirectory: buildDir,
        buildSize,
        buildExists: true,
      };
    } catch (error) {
      return null;
    }
  }

  // Logs functionality
  async getLogs(options: { level?: string; limit?: number; since?: string } = {}) {
    const logs = [];
    
    // In a real implementation, you'd read from actual log files
    // For now, we'll return mock logs with current console history
    const levels = ['info', 'warn', 'error', 'debug'];
    const limit = options.limit || 100;
    
    for (let i = 0; i < limit; i++) {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const timestamp = new Date(Date.now() - i * 60000).toISOString();
      
      logs.push({
        id: `log-${i}`,
        timestamp,
        level,
        message: `Sample ${level} message ${i}`,
        source: 'devtools',
        context: {
          userId: 'user-123',
          route: '/dashboard',
        },
      });
    }
    
    return logs.reverse(); // Most recent first
  }

  async getProcessLogs() {
    // Get process information
    return {
      pid: process.pid,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      platform: process.platform,
      versions: process.versions,
    };
  }

  // Helper methods
  private async pathExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async getNpmVersion(): Promise<string | undefined> {
    try {
      const { stdout } = await execAsync('npm --version');
      return stdout.trim();
    } catch {
      return undefined;
    }
  }
}