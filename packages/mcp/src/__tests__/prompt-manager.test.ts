import { describe, it, expect, beforeEach } from 'vitest';
import { PromptManager } from '../manager/prompt-manager.js';

describe('PromptManager', () => {
  let promptManager: PromptManager;
  beforeEach(() => {
    promptManager = new PromptManager({
      definitions: { foo: { description: 'foo prompt' } },
      handlers: { foo: async () => ({ data: 'bar' }) },
    });
  });
  it('lists enabled prompts', async () => {
    const result = await promptManager.listPrompts();
    expect(result.prompts.length).toBe(1);
    expect(result.prompts[0].name).toBe('foo');
  });
  it('gets enabled prompt', async () => {
    const result = await promptManager.getPrompt({ params: { name: 'foo' } });
    expect(result.data).toBe('bar');
  });
  it('throws for disabled prompt', async () => {
    promptManager['enabledPrompts'].delete('foo');
    await expect(promptManager.getPrompt({ params: { name: 'foo' } })).rejects.toThrow();
  });
});
