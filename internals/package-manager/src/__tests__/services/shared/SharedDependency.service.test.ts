import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SharedDependencyService } from '../../../services/shared/SharedDependency.service';
import { MonorepoService } from '../../../services/monorepo/Monorepo.service';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const tmpDir = path.join(os.tmpdir(), `shareddep-test-${Date.now()}`);
const packagesDir = path.join(tmpDir, 'packages');
const pkgA = path.join(packagesDir, 'pkg-a');
const pkgB = path.join(packagesDir, 'pkg-b');
const sharedDir = path.join(packagesDir, 'shared');
const configFile = 'package-manager.options.json';

function writeJson(file: string, data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

describe('SharedDependencyService', () => {
  beforeEach(() => {
    fs.mkdirSync(pkgA, { recursive: true });
    fs.mkdirSync(pkgB, { recursive: true });
    writeJson(path.join(tmpDir, configFile), {
      packagesDir: 'packages',
      shared: { whitelist: ['lodash', 'axios'] }
    });
    writeJson(path.join(pkgA, 'package.json'), { dependencies: { lodash: '1.0.0' } });
    writeJson(path.join(pkgB, 'package.json'), { devDependencies: { axios: '2.0.0' } });
  });
  afterEach(() => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should setup shared package with dependencies and per-dependency files', async () => {
    await SharedDependencyService.setupSharedPackage(tmpDir);
    const pkgJson = JSON.parse(fs.readFileSync(path.join(sharedDir, 'package.json'), 'utf-8'));
    expect(pkgJson.dependencies.lodash).toBe('1.0.0');
    expect(pkgJson.dependencies.axios).toBe('2.0.0');
    // Should not have peerDependencies
    expect(pkgJson.peerDependencies).toBeUndefined();
    // Should generate a file for each dependency
    expect(fs.existsSync(path.join(sharedDir, 'lodash.ts'))).toBe(true);
    expect(fs.existsSync(path.join(sharedDir, 'axios.ts'))).toBe(true);
    // Should not generate index.ts
    expect(fs.existsSync(path.join(sharedDir, 'index.ts'))).toBe(false);
    // Check file content
    const lodashContent = fs.readFileSync(path.join(sharedDir, 'lodash.ts'), 'utf-8');
    expect(lodashContent).toContain(`export * from 'lodash';`);
    const axiosContent = fs.readFileSync(path.join(sharedDir, 'axios.ts'), 'utf-8');
    expect(axiosContent).toContain(`export * from 'axios';`);
  });

  it('should throw if dependency not found', async () => {
    // Patch config to use a missing dependency
    const configPath = path.join(tmpDir, configFile);
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    config.shared.whitelist = ['notfound'];
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    await expect(SharedDependencyService.setupSharedPackage(tmpDir)).rejects.toThrow('Dependency notfound not found');
  });
});
