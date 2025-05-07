import { describe, it, expect, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { handleInitConfig } from '../../../services/config/Config.service';

describe('handleInitConfig', () => {
  it('should write config file with user input', async () => {
    const output = path.join(__dirname, 'test-package-manager.options.json');
    // Mock readline
    const mockRl = {
      question: vi.fn()
        .mockImplementationOnce((q, cb) => cb('my-mono'))
        .mockImplementationOnce((q, cb) => cb('my-packages'))
        .mockImplementationOnce((q, cb) => cb('lodash,axios')),
      close: vi.fn()
    };
    vi.doMock('readline', () => ({
      createInterface: () => mockRl
    }));
    // Patch import
    const origImport = (globalThis as any)['import'];
    (globalThis as any)['import'] = async (mod: string) => require('readline');
    await handleInitConfig({ output });
    const config = JSON.parse(fs.readFileSync(output, 'utf-8'));
    expect(config.name).toBe('my-mono');
    expect(config.packagesDir).toBe('my-packages');
    expect(config.shared.whitelist).toEqual(['lodash', 'axios']);
    fs.rmSync(output);
    (globalThis as any)['import'] = origImport;
  });
});
