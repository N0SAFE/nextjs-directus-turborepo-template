import * as fs from 'fs';
import * as path from 'path';
import { MonorepoService } from '../monorepo/Monorepo.service';
import { ConfigManager, TurborepoConfig } from '../../config/ConfigManager';

export class SharedDependencyService {
  // Setup or update the shared package with whitelisted dependencies
  static async setupSharedPackage(monorepoRoot: string): Promise<void> {
    // Always use config from ConfigManager
    const config: TurborepoConfig = ConfigManager.loadConfig(monorepoRoot);
    const allDeps = MonorepoService.getAllDependencies(monorepoRoot);
    const sharedDir = path.join(monorepoRoot, config.packagesDir, 'shared');
    if (!fs.existsSync(sharedDir)) fs.mkdirSync(sharedDir, { recursive: true });
    const pkgJsonPath = path.join(sharedDir, 'package.json')
    const tsConfigPath = path.join(sharedDir, 'tsconfig.json');
    let pkg: any = { name: 'shared', version: '1.0.0', dependencies: {} };
    if (fs.existsSync(pkgJsonPath)) {
      pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      if (!pkg.dependencies) pkg.dependencies = {};
    }

    // Remove all old .ts files except index.ts (if any)
    fs.readdirSync(sharedDir)
      .filter(f => f.endsWith('.ts'))
      .forEach(f => fs.unlinkSync(path.join(sharedDir, f)));

    for (const dep of config.shared?.whitelist || []) {
      if (allDeps[dep]) {
        pkg.dependencies[dep] = allDeps[dep];
        // Write a file for each dependency
        const depFile = path.join(sharedDir, `${dep}.ts`);
        fs.writeFileSync(depFile, `export * from '${dep}';\n`);
      } else {
        throw new Error(`Dependency ${dep} not found in any package.json in the monorepo`);
      }
    }
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2));
    fs.writeFileSync(tsConfigPath, JSON.stringify(SharedDependencyService.tsConfig(pkg.dependencies), null, 2));
  }

  private static tsConfig(deps: Record<string, string>): any {
    return {
      compilerOptions: {
        paths: Object.keys(deps).reduce((acc, dep) => {
          acc[dep] = [`./${dep}`];
          return acc;
        }, {} as Record<string, string[]>),
      },
    };
  }
}
