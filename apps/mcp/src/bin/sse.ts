#!/usr/bin/env node

import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { MainMcpServer } from "../index";
import { getConfigFromCommanderAndEnv } from "./config";

const app = express();
const server = new MainMcpServer(getConfigFromCommanderAndEnv());

let transport: SSEServerTransport | null = null;

app.get("/sse", (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  server.server.connect(transport);
  server.server.sendLoggingMessage({
    level: "info",
    data: "MCP server started",
  });
});

app.post("/messages", (req, res) => {
  if (transport) {
    transport.handlePostMessage(req, res);
  }
});

app.listen(3000);
