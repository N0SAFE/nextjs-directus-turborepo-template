import * as fs from 'fs';
import * as path from 'path';
import { ConfigManager, TurborepoConfig } from '../../config/ConfigManager';

export class MonorepoService {
  static getTurborepoConfig(root: string): TurborepoConfig {
    return ConfigManager.loadConfig(root);
  }

  static getPackagesRoot(root: string): string {
    const config = this.getTurborepoConfig(root);
    return path.join(root, config.packagesDir || 'packages');
  }

  static listPackages(root: string): string[] {
    const packagesRoot = this.getPackagesRoot(root);
    if (!fs.existsSync(packagesRoot)) return [];
    return fs.readdirSync(packagesRoot).filter(pkg =>
      fs.existsSync(path.join(packagesRoot, pkg, 'package.json'))
    ).map(pkg => path.join(packagesRoot, pkg));
  }

  static getAllDependencies(root: string): Record<string, string> {
    const packages = this.listPackages(root);
    const allDeps: Record<string, string> = {};
    for (const pkgPath of packages) {
      const pkgJsonPath = path.join(pkgPath, 'package.json');
      if (fs.existsSync(pkgJsonPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
        Object.assign(allDeps, pkgJson.dependencies || {}, pkgJson.devDependencies || {});
      }
    }
    return allDeps;
  }
}
