import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ConfigManager, TurborepoConfig } from '../../config/ConfigManager';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('ConfigManager', () => {
  const tmpDir = path.join(os.tmpdir(), `config-test-${Date.now()}`);
  const configPath = path.join(tmpDir, 'package-manager.options.json');
  const config: TurborepoConfig = {
    packagesDir: 'packages',
    shared: { whitelist: ['lodash'] }
  };

  beforeEach(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  });
  afterEach(() => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should load config', () => {
    const loaded = ConfigManager.loadConfig(tmpDir);
    expect(loaded.packagesDir).toBe('packages');
    expect(loaded.shared.whitelist).toContain('lodash');
  });

  it('should get config after load', () => {
    ConfigManager.loadConfig(tmpDir);
    const loaded = ConfigManager.getConfig();
  });

  it('should get config path after load', () => {
    ConfigManager.loadConfig(tmpDir);
    expect(ConfigManager.getConfigPath()).toBe(configPath);
  });

  it('should save config', () => {
    ConfigManager.loadConfig(tmpDir);
    const newConfig = { ...config, name: 'changed' };
    ConfigManager.saveConfig(newConfig);
    const loaded = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    expect(loaded.name).toBe('changed');
  });

  it('should throw if config not loaded', () => {
    ConfigManager['config'] = null;
    ConfigManager['configPath'] = null;
    expect(() => ConfigManager.getConfig()).toThrow();
    expect(() => ConfigManager.getConfigPath()).toThrow();
  });
});
