import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

export class DevtoolsService {
  private readonly projectRoot: string;

  constructor() {
    // Get project root (assuming this service runs from the web app)
    this.projectRoot = process.cwd();
  }

  // CLI operations
  async executeCommand(input: { command: string; args?: string[]; cwd?: string; timeout?: number }) {
    const startTime = Date.now();
    
    try {
      const command = input.args ? `${input.command} ${input.args.join(' ')}` : input.command;
      const options = {
        cwd: input.cwd || this.projectRoot,
        timeout: input.timeout || 30000,
      };

      const { stdout, stderr } = await execAsync(command, options);
      
      return {
        success: true,
        output: stdout || '',
        error: stderr || undefined,
        exitCode: 0,
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || '',
        error: error.stderr || error.message,
        exitCode: error.code || 1,
        duration: Date.now() - startTime,
      };
    }
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

  // System information
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
    };
  }

  async getEnvironmentInfo() {
    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
      variables: process.env,
      paths: (process.env.PATH || '').split(path.delimiter),
    };
  }

  // Helper methods
  private async getNpmVersion(): Promise<string | undefined> {
    try {
      const { stdout } = await execAsync('npm --version');
      return stdout.trim();
    } catch {
      return undefined;
    }
  }
}