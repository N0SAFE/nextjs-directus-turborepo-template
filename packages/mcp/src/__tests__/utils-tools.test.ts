import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createTool, createToolDefinition } from '../utils/tools';

describe('utils/tools', () => {
  it('createToolDefinition returns the definition object', () => {
    const def = createToolDefinition({
      name: 'myTool',
      description: 'desc',
      inputSchema: z.object({ foo: z.string() }),
      annotations: { title: 'My Tool' },
    });
    expect(def.name).toBe('myTool');
    expect(def.inputSchema.safeParse({ foo: 'bar' }).success).toBe(true);
    expect(def.annotations?.title).toBe('My Tool');
  });

  it('createToolDefinition supports overload with args', () => {
    const def = createToolDefinition(
      'myTool',
      'desc',
      z.object({ foo: z.string() }),
      { title: 'My Tool' }
    );
    expect(def.name).toBe('myTool');
    expect(def.inputSchema.safeParse({ foo: 'bar' }).success).toBe(true);
    expect(def.annotations?.title).toBe('My Tool');
  });

  it('createTool returns a ToolCapability', async () => {
    const def = createToolDefinition({
      name: 'myTool',
      description: 'desc',
      inputSchema: z.object({ foo: z.string() }),
    });
    const handler = async ({ foo }: { foo: string }) => ({
      content: [{ type: 'text', text: foo }],
    });
    const cap = createTool(def, handler);
    expect(cap.definition.name).toBe('myTool');
    const result = await cap.handler({ foo: 'bar' });
    expect(result.content[0].text).toBe('bar');
  });
});
