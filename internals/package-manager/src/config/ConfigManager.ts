import * as fs from 'fs';
import * as path from 'path';

export interface TurborepoConfig {
  packagesDir: string;
  shared: {
    whitelist: string[];
  };
}

export class ConfigManager {
  private static config: TurborepoConfig | null = null;
  private static configPath: string | null = null;

  static loadConfig(root: string, configFile = 'package-manager.options.json'): TurborepoConfig {
    const configPath = path.join(root, configFile);
    if (!fs.existsSync(configPath)) throw new Error(`${configFile} not found`);
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    this.config = config;
    this.configPath = configPath;
    return config;
  }

  static getConfig(): TurborepoConfig {
    if (!this.config) throw new Error('Config not loaded. Call ConfigManager.loadConfig(root) first.');
    return this.config;
  }

  static getConfigPath(): string {
    if (!this.configPath) throw new Error('Config path not set. Call ConfigManager.loadConfig(root) first.');
    return this.configPath;
  }

  static saveConfig(config: TurborepoConfig): void {
    if (!this.configPath) throw new Error('Config path not set. Call ConfigManager.loadConfig(root) first.');
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    this.config = config;
  }
}
