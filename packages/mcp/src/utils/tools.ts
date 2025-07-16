import { AuthInfo, Promisable, ToolCapability, ToolDefinition, ToolHandler } from "types";
import * as z from "zod";

export function createTool<T extends ToolDefinition>(
  definition: T,
  handler: ToolHandler<T>,
  meta?: {
    canBeEnabled?: (authInfo: AuthInfo) => Promisable<boolean>;
  }
): ToolCapability {
    return {
        definition,
        handler,
        meta: {
            canBeEnabled: meta?.canBeEnabled,
        },
    } as unknown as ToolCapability;
}

export function createToolDefinition<T extends ToolDefinition>(
  definition: T,
): T
export function createToolDefinition<T extends ToolDefinition>(
  name: string,
  description: string,
  inputSchema: z.ZodType<any>,
  annotations: Partial<T['annotations']>,
): T
export function createToolDefinition<T extends ToolDefinition>(
  ...args: [
    T,
  ] | [
    string,
    string,
    z.ZodType<any>,
    Partial<T['annotations']>,
  ]
): T {
  if (args.length === 1) {
    return args[0] as T;
  }
  const [name, description, inputSchema, annotations] = args as [
    string,
    string,
    z.ZodType<any>,
    Partial<T['annotations']>
  ];
  return {
    name,
    description,
    inputSchema,
    annotations: {
      title: name,
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
      ...annotations,
    },
  } as T;
}