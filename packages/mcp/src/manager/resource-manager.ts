// ResourceManager handles resource logic for McpServer
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export interface ResourceDefinition {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ResourceTemplate {
  uriTemplate: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ResourceContent {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string; // base64 encoded
}

export class ResourceManager {
  private readonly resources: { 
    definitions: Record<string, any>; 
    handlers: Record<string, (params: any) => Promise<any>>; 
  };
  private readonly resourceTemplates: Map<string, ResourceTemplate> = new Map();
  private readonly subscriptions: Map<string, Set<string>> = new Map(); // sessionId -> Set of URIs
  private enabledResources: Set<string> = new Set();
  private listChangedCallbacks: Set<() => void> = new Set();
  
  constructor(resources: { 
    definitions: Record<string, any>; 
    handlers: Record<string, (params: any) => Promise<any>>; 
  }) {
    this.resources = resources;
    Object.keys(resources.definitions).forEach((uri) => this.enabledResources.add(uri));
  }

  async listResources(request?: { params?: { cursor?: string } }) {
    const allResources = Object.entries(this.resources.definitions)
      .filter(([uri]) => this.enabledResources.has(uri))
      .map(([uri, def]) => ({ uri, ...def }));
    
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
    const paginatedResources = allResources.slice(startIndex, endIndex);
    
    if (endIndex < allResources.length) {
      nextCursor = endIndex.toString();
    }
    
    return {
      resources: paginatedResources,
      ...(nextCursor && { nextCursor }),
    };
  }

  async readResource(request: any) {
    const handler = this.resources.handlers[request.params.uri];
    if (!handler) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown resource: ${request.params.uri}`);
    }
    if (!this.enabledResources.has(request.params.uri)) {
      throw new McpError(ErrorCode.MethodNotFound, `Resource not enabled: ${request.params.uri}`);
    }
    return handler(request.params);
  }

  async listResourceTemplates(request?: any) {
    return {
      resourceTemplates: Array.from(this.resourceTemplates.values()),
    };
  }

  async subscribeToResource(request: { 
    params: { uri: string }; 
    meta?: { sessionId?: string } 
  }) {
    const { uri } = request.params;
    const sessionId = request.meta?.sessionId || 'default';
    
    if (!this.subscriptions.has(sessionId)) {
      this.subscriptions.set(sessionId, new Set());
    }
    
    this.subscriptions.get(sessionId)!.add(uri);
    
    return {
      success: true,
    };
  }

  async unsubscribeFromResource(request: { 
    params: { uri: string }; 
    meta?: { sessionId?: string } 
  }) {
    const { uri } = request.params;
    const sessionId = request.meta?.sessionId || 'default';
    
    const sessionSubs = this.subscriptions.get(sessionId);
    if (sessionSubs) {
      sessionSubs.delete(uri);
      if (sessionSubs.size === 0) {
        this.subscriptions.delete(sessionId);
      }
    }
    
    return {
      success: true,
    };
  }

  // Add a new resource template
  addResourceTemplate(template: ResourceTemplate) {
    this.resourceTemplates.set(template.uriTemplate, template);
  }

  // Remove a resource template
  removeResourceTemplate(uriTemplate: string) {
    this.resourceTemplates.delete(uriTemplate);
  }

  // Add a resource dynamically
  addResource(uri: string, definition: any, handler: (params: any) => Promise<any>) {
    this.resources.definitions[uri] = definition;
    this.resources.handlers[uri] = handler;
    this.enabledResources.add(uri);
    this.notifyListChanged();
  }

  // Remove a resource
  removeResource(uri: string) {
    delete this.resources.definitions[uri];
    delete this.resources.handlers[uri];
    this.enabledResources.delete(uri);
    this.notifyListChanged();
  }

  // Notify about resource changes
  notifyResourceChanged(uri: string, content?: ResourceContent) {
    // Send notifications to subscribed sessions
    for (const [sessionId, uris] of this.subscriptions) {
      if (uris.has(uri)) {
        // Here you would send the notification to the specific session
        // This would be handled by the server transport layer
        console.log(`Resource ${uri} changed for session ${sessionId}`, content);
      }
    }
  }

  // Notify about resource list changes
  private notifyListChanged() {
    this.listChangedCallbacks.forEach(callback => callback());
  }

  // Register callback for list changes
  onResourceListChanged(callback: () => void) {
    this.listChangedCallbacks.add(callback);
  }

  // Remove callback for list changes
  offResourceListChanged(callback: () => void) {
    this.listChangedCallbacks.delete(callback);
  }

  hasResources() {
    return Object.keys(this.resources.definitions).length > 0 || this.resourceTemplates.size > 0;
  }
}
