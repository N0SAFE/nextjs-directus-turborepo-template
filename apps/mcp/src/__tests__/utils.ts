export const createCallToolRequest = (
  toolName: string,
  args: Record<string, unknown>
) =>
  ({
    method: "tools/call",
    params: {
      _meta: {},
      name: toolName,
      arguments: args,
    },
  } as const);

export const createCallToolOptions = () =>
  ({
    signal: new AbortController().signal,
    sessionId: "test_session",
    _meta: {},
    sendNotification: (type: string, payload: unknown) => void 0,
    sendRequest: async () => void 0,
    authInfo: {
      clientId: "test_client",
      extra: {},
      scopes: [] as unknown[],
      token: "test_token",
    },
    requestId: "test_request",
  } as const);

export const createListToolsRequest = () =>
  ({
    method: "tools/list",
    params: {
      _meta: {},
    },
  } as const);

export const createListToolsOptions = () =>
  ({
    signal: new AbortController().signal,
    sessionId: "test_session",
    _meta: {},
    sendNotification: (type: string, payload: unknown) => void 0,
    sendRequest: async () => void 0,
    authInfo: {
      clientId: "test_client",
      extra: {},
      scopes: [] as unknown[],
      token: "test_token",
    },
    requestId: "test_request",
  } as const);
