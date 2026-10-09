// netlify/functions/mcp.js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";

function buildServer() {
  const server = new McpServer({
    name: "nextrade-docs",
    version: "1.0.0",
  });

  // Tool 1: leer cualquier documento
  server.tool(
    "read_doc",
    "Lee el contenido de un documento en /docs-ia/ del proyecto Nextrade",
    { filename: z.string().describe("Nombre del archivo, ej: CHANGELOG.md") },
    async ({ filename }) => {
      return {
        content: [{ type: "text", text: `placeholder: ${filename}` }],
      };
    }
  );

  // Tool 2: obtener el Changelog
  server.tool(
    "get_changelog",
    "Obtiene el contenido más reciente del CHANGELOG",
    {},
    async () => {
      return {
        content: [{ type: "text", text: "placeholder: CHANGELOG" }],
      };
    }
  );

  return server;
}

export default async (req, _context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const server = buildServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  return transport.handleRequest(req);
};

export const config = { path: "/mcp" };
