import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ImportAliasService } from '../../../services/package/ImportAlias.service';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const tmpDir = path.join(os.tmpdir(), `alias-test-${Date.now()}`);
const pkgDir = path.join(tmpDir, 'my-pkg');

function writeJson(file: string, data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

describe('ImportAliasService', () => {
  beforeEach(() => {
    fs.mkdirSync(pkgDir, { recursive: true });
    writeJson(path.join(pkgDir, 'tsconfig.json'), { compilerOptions: {} });
    fs.writeFileSync(path.join(pkgDir, 'index.ts'), `import x from './foo';\nimport y from '../bar';`);
  });
  afterEach(() => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should update tsconfig paths and imports', async () => {
    await ImportAliasService.updateAliases(pkgDir, 'repo');
    const tsconfig = JSON.parse(fs.readFileSync(path.join(pkgDir, 'tsconfig.json'), 'utf-8'));
    expect(tsconfig.compilerOptions.paths['@repo/my-pkg']).toEqual(['.']);
    const content = fs.readFileSync(path.join(pkgDir, 'index.ts'), 'utf-8');
    expect(content).toContain(`from '@repo/my-pkg/`);
  });

  it('should not fail if tsconfig does not exist', async () => {
    fs.rmSync(path.join(pkgDir, 'tsconfig.json'));
    await ImportAliasService.updateAliases(pkgDir, 'repo');
    // Should not throw
  });
});
