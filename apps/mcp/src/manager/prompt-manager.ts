// PromptManager handles prompt logic for McpServer
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export interface PromptDefinition {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface PromptMessage {
  role: "user" | "assistant" | "system";
  content: {
    type: "text" | "image" | "resource";
    text?: string;
    imageUrl?: string;
    resource?: {
      uri: string;
      mimeType?: string;
      text?: string;
      blob?: string;
    };
  };
}

export class PromptManager {
  private readonly prompts: { 
    definitions: Record<string, any>; 
    handlers: Record<string, (params: any) => Promise<any>>; 
  };
  private enabledPrompts: Set<string> = new Set();
  private listChangedCallbacks: Set<() => void> = new Set();
  private completionHandlers: Map<string, (argumentName: string, value: string, context?: any) => Promise<string[]>> = new Map();
  
  constructor(prompts: { 
    definitions: Record<string, any>; 
    handlers: Record<string, (params: any) => Promise<any>>; 
  }) {
    this.prompts = prompts;
    Object.keys(prompts.definitions).forEach((name) => this.enabledPrompts.add(name));
  }

  async listPrompts(request?: { params?: { cursor?: string } }) {
    const allPrompts = Object.entries(this.prompts.definitions)
      .filter(([name]) => this.enabledPrompts.has(name))
      .map(([name, def]) => ({ name, ...def }));
    
    // Simple pagination support
    const cursor = request?.params?.cursor;
    let startIndex = 0;
    let nextCursor: string | undefined;
    
    if (cursor) {
      try {
        startIndex = parseInt(cursor, 10);
      } catch {
        startIndex = 0;
      }
    }
    
    const pageSize = 100; // Default page size
    const endIndex = startIndex + pageSize;
    const paginatedPrompts = allPrompts.slice(startIndex, endIndex);
    
    if (endIndex < allPrompts.length) {
      nextCursor = endIndex.toString();
    }
    
    return {
      prompts: paginatedPrompts,
      ...(nextCursor && { nextCursor }),
    };
  }

  async getPrompt(request: any) {
    const handler = this.prompts.handlers[request.params.name];
    if (!handler) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown prompt: ${request.params.name}`);
    }
    if (!this.enabledPrompts.has(request.params.name)) {
      throw new McpError(ErrorCode.MethodNotFound, `Prompt not enabled: ${request.params.name}`);
    }
    return handler(request.params);
  }

  // Handle completion requests for prompt arguments
  async complete(request: {
    params: {
      ref: {
        type: "ref/prompt";
        name: string;
      };
      argument: {
        name: string;
        value: string;
      };
      context?: {
        arguments?: Record<string, any>;
      };
    };
  }) {
    const { ref, argument, context } = request.params;
    
    if (ref.type !== "ref/prompt") {
      throw new McpError(ErrorCode.InvalidParams, "Invalid ref type for prompt completion");
    }
    
    const completionHandler = this.completionHandlers.get(ref.name);
    if (!completionHandler) {
      return { completion: { values: [] } };
    }
    
    try {
      const values = await completionHandler(argument.name, argument.value, context);
      return {
        completion: {
          values: values.map(value => ({ value, label: value })),
        },
      };
    } catch (error) {
      console.error(`Completion error for prompt ${ref.name}:`, error);
      return { completion: { values: [] } };
    }
  }

  // Add a new prompt
  addPrompt(name: string, definition: any, handler: (params: any) => Promise<any>) {
    this.prompts.definitions[name] = definition;
    this.prompts.handlers[name] = handler;
    this.enabledPrompts.add(name);
    this.notifyListChanged();
  }

  // Remove a prompt
  removePrompt(name: string) {
    delete this.prompts.definitions[name];
    delete this.prompts.handlers[name];
    this.enabledPrompts.delete(name);
    this.completionHandlers.delete(name);
    this.notifyListChanged();
  }

  // Register completion handler for a prompt
  registerCompletionHandler(
    promptName: string, 
    handler: (argumentName: string, value: string, context?: any) => Promise<string[]>
  ) {
    this.completionHandlers.set(promptName, handler);
  }

  // Enable a prompt
  enablePrompt(name: string) {
    if (this.prompts.definitions[name]) {
      this.enabledPrompts.add(name);
      this.notifyListChanged();
    }
  }

  // Disable a prompt
  disablePrompt(name: string) {
    this.enabledPrompts.delete(name);
    this.notifyListChanged();
  }

  // Notify about prompt list changes
  private notifyListChanged() {
    this.listChangedCallbacks.forEach(callback => callback());
  }

  // Register callback for list changes
  onPromptListChanged(callback: () => void) {
    this.listChangedCallbacks.add(callback);
  }

  // Remove callback for list changes
  offPromptListChanged(callback: () => void) {
    this.listChangedCallbacks.delete(callback);
  }

  hasPrompts() {
    return Object.keys(this.prompts.definitions).length > 0;
  }
}
