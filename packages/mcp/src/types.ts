import * as z from "zod";
import { ZodRawShape } from "zod";

// Shared types for McpServer and managers
export type ToolMode = "readOnly" | "readWrite";
export type ToolsetConfig = {
  mode: ToolMode;
};
export interface DynamicToolDiscoveryOptions {
  enabled: boolean;
  defaultEnabledToolsets?: string[];
}
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodObject<ZodRawShape>;
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
}

export type ToolHandler<T extends ToolDefinition> = (
  params: z.infer<T["inputSchema"]>,
  ...[req, opts]: [
    {
      method: "tools/call";
      params: {
        _meta: Record<string, unknown>;
        name: string;
        arguments: Record<string, unknown>;
      };
    },
    {
      signal: AbortSignal;
      sessionId: string;
      _meta: unknown;
      sendNotification: (type: string, payload: unknown) => void;
      sendRequest: () => Promise<unknown>;
      authInfo: AuthInfo;
      requestId: string;
    },
  ]
) => Promisable<{
  content: {
    type: string;
    text: string;
  }[];
}>;

export type ToolCapability<T extends ToolDefinition = ToolDefinition> = {
  definition: T;
  handler: ToolHandler<T>;
  meta?: {
    canBeEnabled?: (authInfo: AuthInfo) => Promisable<boolean>;
  };
};

export type Promisable<T> = T | Promise<T>;

export type McpConfig = {
  toolsetConfig: any;
  availableTools: string[];
  dynamicToolDiscovery:
    | {
        enabled: true;
        defaultEnabledToolsets: string[];
      }
    | {
        enabled: false;
      };
};

export type AuthInfo = {
  token: string;
  clientId: string;
  scopes: Array<unknown>;
  extra: Record<string, unknown>;
};

// Reverse Proxy Types
export type BackendServerTransportType = "stdio" | "http" | "sse";

export interface BackendServerConfig {
  id: string;
  name: string;
  description?: string;
  transportType: BackendServerTransportType;
  enabled: boolean;
  security?: {
    allowedTools?: string[];
    blockedTools?: string[];
    requireAuth?: boolean;
    allowedScopes?: string[];
  };
  // Transport-specific configurations
  stdio?: {
    command: string;
    args?: string[];
    env?: Record<string, string>;
  };
  http?: {
    url: string;
    headers?: Record<string, string>;
    timeout?: number;
  };
  sse?: {
    url: string;
    headers?: Record<string, string>;
    timeout?: number;
  };
}

export interface ProxyServerConfig {
  servers: BackendServerConfig[];
  security?: {
    globalAllowedTools?: string[];
    globalBlockedTools?: string[];
    defaultRequireAuth?: boolean;
    allowServerDiscovery?: boolean;
  };
  discovery?: {
    enabled: boolean;
    allowRuntimeServerAddition?: boolean;
    serverMetadataExposure?: "none" | "basic" | "full";
  };
}

export interface BackendServerStatus {
  id: string;
  connected: boolean;
  lastConnected?: Date;
  lastError?: string;
  toolsCount?: number;
  resourcesCount?: number;
  promptsCount?: number;
}

export interface ProxyToolDefinition extends ToolDefinition {
  serverId: string;
  originalName: string;
  proxyName: string;
}