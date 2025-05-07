import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PackageImportService } from '../../../services/package/PackageImport.service';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const tmpDir = path.join(os.tmpdir(), `pkg-import-test-${Date.now()}`);
const srcDir = path.join(tmpDir, 'src');
const destDir = path.join(tmpDir, 'dest');

function writeFile(file: string, content: string) {
  fs.writeFileSync(file, content);
}

describe('PackageImportService', () => {
  beforeEach(() => {
    fs.mkdirSync(srcDir, { recursive: true });
    writeFile(path.join(srcDir, 'foo.txt'), 'hello');
  });
  afterEach(() => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should copy a local folder', async () => {
    await PackageImportService.importPackage(srcDir, destDir);
    expect(fs.existsSync(path.join(destDir, 'foo.txt'))).toBe(true);
    expect(fs.readFileSync(path.join(destDir, 'foo.txt'), 'utf-8')).toBe('hello');
  });

  it('should throw if source not found', async () => {
    await expect(PackageImportService.importPackage('/notfound', destDir)).rejects.toThrow('Source not found');
  });

  it('should throw on unsupported URL', async () => {
    await expect(PackageImportService.importPackage('http://example.com/file.txt', destDir)).rejects.toThrow('Unsupported URL format');
  });

  it('should throw on unsupported archive', async () => {
    // Create the destDir so existsSync returns true
    fs.mkdirSync(destDir, { recursive: true });
    await expect(PackageImportService.importPackage('http://example.com/file.rar', destDir)).rejects.toThrow('Unsupported URL format for import');
  });
});
