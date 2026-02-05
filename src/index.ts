#!/usr/bin/env node

/**
 * Apple Development MCP Server
 * 
 * Provides tools for:
 * - Fetching Apple Developer Documentation
 * - Analyzing Xcode build logs
 * - Checking Swift Evolution proposals
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

import { fetchAppleDocs } from "./tools/fetch-apple-docs.js";
import { analyzeBuildLog } from "./tools/xcode-diagnostic-analyzer.js";
import { checkSwiftEvolution } from "./tools/swift-evolution-check.js";

// Tool definitions
const TOOLS: Tool[] = [
  {
    name: "fetch_latest_apple_docs",
    description: `Fetches the latest Apple Developer Documentation for a specific API, framework, or symbol.
    
Examples:
- "NavigationStack" - SwiftUI navigation
- "SwiftData" - Data persistence framework
- "RealityKit" - AR/VR framework
- "async/await" - Swift concurrency

Returns official documentation summary, code examples, and availability information.`,
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The API, framework, class, or symbol to search for (e.g., 'NavigationStack', 'SwiftData', '@Observable')"
        },
        framework: {
          type: "string",
          description: "Optional: Specific framework to search within (e.g., 'SwiftUI', 'Foundation', 'UIKit')"
        },
        includeExamples: {
          type: "boolean",
          description: "Whether to include code examples (default: true)"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "xcode_diagnostic_analyzer",
    description: `Analyzes Xcode build logs and error messages, providing:
- Error classification and explanation
- Fix-it suggestions matching Apple's recommendations
- Related documentation links
- Common solutions for the specific error

Supports Swift compiler errors, linker errors, and build system errors.`,
    inputSchema: {
      type: "object",
      properties: {
        buildLog: {
          type: "string",
          description: "The Xcode build log or error message to analyze"
        },
        errorCode: {
          type: "string",
          description: "Optional: Specific error code (e.g., 'cannot find type', 'ambiguous use of')"
        },
        context: {
          type: "string",
          description: "Optional: Additional context about the project (Swift version, target platform)"
        }
      },
      required: ["buildLog"]
    }
  },
  {
    name: "swift_evolution_check",
    description: `Checks the status of Swift language features against Swift Evolution proposals.

Use this to verify:
- If a feature is available in a specific Swift version
- The proposal number and status (implemented, in review, accepted)
- Required compiler flags or availability annotations
- Migration guidance from older syntax

Examples: 'nonisolated(unsafe)', 'typed throws', 'parameter packs', 'macros'`,
    inputSchema: {
      type: "object",
      properties: {
        feature: {
          type: "string",
          description: "The Swift feature or syntax to check (e.g., 'nonisolated(unsafe)', 'typed throws')"
        },
        swiftVersion: {
          type: "string",
          description: "Optional: Target Swift version to check compatibility (e.g., '5.9', '6.0')"
        }
      },
      required: ["feature"]
    }
  }
];

// Create server instance
const server = new Server(
  {
    name: "apple-dev-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "fetch_latest_apple_docs": {
        const result = await fetchAppleDocs(
          args?.query as string,
          args?.framework as string | undefined,
          args?.includeExamples as boolean | undefined
        );
        return {
          content: [{ type: "text", text: result }]
        };
      }

      case "xcode_diagnostic_analyzer": {
        const result = await analyzeBuildLog(
          args?.buildLog as string,
          args?.errorCode as string | undefined,
          args?.context as string | undefined
        );
        return {
          content: [{ type: "text", text: result }]
        };
      }

      case "swift_evolution_check": {
        const result = await checkSwiftEvolution(
          args?.feature as string,
          args?.swiftVersion as string | undefined
        );
        return {
          content: [{ type: "text", text: result }]
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error executing ${name}: ${errorMessage}` }],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Apple Dev MCP Server started successfully");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
