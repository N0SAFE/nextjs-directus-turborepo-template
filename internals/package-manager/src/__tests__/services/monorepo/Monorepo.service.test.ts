import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MonorepoService } from '../../../services/monorepo/Monorepo.service';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const tmpDir = path.join(os.tmpdir(), `monorepo-test-${Date.now()}`);
const packagesDir = path.join(tmpDir, 'packages');
const pkgA = path.join(packagesDir, 'pkg-a');
const pkgB = path.join(packagesDir, 'pkg-b');

function writeJson(file: string, data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

describe('MonorepoService', () => {
  beforeEach(() => {
    fs.mkdirSync(pkgA, { recursive: true });
    fs.mkdirSync(pkgB, { recursive: true });
    writeJson(path.join(tmpDir, 'package-manager.options.json'), {
      name: 'test-mono',
      packagesDir: 'packages',
      shared: { whitelist: ['lodash'] }
    });
    writeJson(path.join(pkgA, 'package.json'), { dependencies: { lodash: '1.0.0' } });
    writeJson(path.join(pkgB, 'package.json'), { devDependencies: { axios: '2.0.0' } });
  });
  afterEach(() => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should read turborepo config', () => {
    const config = MonorepoService.getTurborepoConfig(tmpDir);
    expect(config.name).toBe('test-mono');
    expect(config.packagesDir).toBe('packages');
    expect(config.shared.whitelist).toContain('lodash');
  });

  it('should list all packages', () => {
    const pkgs = MonorepoService.listPackages(tmpDir);
    expect(pkgs.length).toBe(2);
    expect(pkgs.some(p => p.endsWith('pkg-a'))).toBe(true);
    expect(pkgs.some(p => p.endsWith('pkg-b'))).toBe(true);
  });

  it('should get all dependencies', () => {
    const deps = MonorepoService.getAllDependencies(tmpDir);
    expect(deps.lodash).toBe('1.0.0');
    expect(deps.axios).toBe('2.0.0');
  });

  it('should return empty if no packages dir', () => {
    const emptyRoot = path.join(os.tmpdir(), `empty-mono-${Date.now()}`);
    fs.mkdirSync(emptyRoot);
    writeJson(path.join(emptyRoot, 'package-manager.options.json'), {
      name: 'empty',
      packagesDir: 'packages',
      shared: { whitelist: [] }
    });
    expect(MonorepoService.listPackages(emptyRoot)).toEqual([]);
    expect(MonorepoService.getAllDependencies(emptyRoot)).toEqual({});
    fs.rmSync(emptyRoot, { recursive: true, force: true });
  });
});
