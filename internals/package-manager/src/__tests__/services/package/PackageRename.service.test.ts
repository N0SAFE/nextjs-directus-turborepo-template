import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PackageRenameService } from '../../../services/package/PackageRename.service';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const tmpDir = path.join(os.tmpdir(), `pkg-rename-test-${Date.now()}`);
const pkgDir = path.join(tmpDir, 'my-pkg');

function writeJson(file: string, data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

describe('PackageRenameService', () => {
  beforeEach(() => {
    fs.mkdirSync(pkgDir, { recursive: true });
    writeJson(path.join(pkgDir, 'package.json'), { name: 'old-name', version: '1.0.0' });
    fs.writeFileSync(path.join(pkgDir, 'index.ts'), `import { something } from 'old-name';`);
  });
  afterEach(() => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should rename package and update imports', async () => {
    await PackageRenameService.renamePackage(pkgDir, 'repo');
    const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf-8'));
    expect(pkg.name).toBe('@repo/my-pkg');
    const content = fs.readFileSync(path.join(pkgDir, 'index.ts'), 'utf-8');
    expect(content).toContain("'@repo/my-pkg'");
  });

  it('should throw if package.json not found', async () => {
    const badDir = path.join(tmpDir, 'bad');
    fs.mkdirSync(badDir);
    await expect(PackageRenameService.renamePackage(badDir, 'repo')).rejects.toThrow('package.json not found');
  });
});
