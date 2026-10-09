// netlify/functions/mcp.mjs
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

export const handler = async (event) => {
  // MCP solo acepta POST, GET provoca 502
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

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
    "Obtiene el contenido mas reciente del CHANGELOG",
    {},
    async () => {
      return {
        content: [{ type: "text", text: "placeholder: CHANGELOG" }],
      };
    }
  );

  await server.connect(transport);

  const request = new Request(`https://${event.headers.host}${event.path}`, {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body,
  });

  const response = await transport.handleRequest(request);

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers),
    body: await response.text(),
  };
};
