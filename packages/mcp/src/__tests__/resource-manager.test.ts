import { describe, it, expect, beforeEach } from 'vitest';
import { ResourceManager } from '../manager/resource-manager.js';

describe('ResourceManager', () => {
  let resourceManager: ResourceManager;
  beforeEach(() => {
    resourceManager = new ResourceManager({
      definitions: { foo: { description: 'foo resource' } },
      handlers: { foo: async () => ({ data: 'bar' }) },
    });
  });
  it('lists enabled resources', async () => {
    const result = await resourceManager.listResources();
    expect(result.resources.length).toBe(1);
    expect(result.resources[0].uri).toBe('foo');
  });
  it('reads enabled resource', async () => {
    const result = await resourceManager.readResource({ params: { uri: 'foo' } });
    expect(result.data).toBe('bar');
  });
  it('throws for disabled resource', async () => {
    resourceManager['enabledResources'].delete('foo');
    await expect(resourceManager.readResource({ params: { uri: 'foo' } })).rejects.toThrow();
  });
});
