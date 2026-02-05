# Apple Dev MCP Server

A Model Context Protocol (MCP) server for Apple development assistance. Provides tools for fetching Apple documentation, analyzing Xcode build errors, and checking Swift Evolution proposal status.

## Features

### 🔧 Tools

| Tool | Description |
|------|-------------|
| `fetch_latest_apple_docs` | Fetches official Apple Developer Documentation for any API, framework, or symbol |
| `xcode_diagnostic_analyzer` | Analyzes Xcode build logs and provides fix-it suggestions |
| `swift_evolution_check` | Checks Swift Evolution proposal status for language features |

## Installation

```bash
# Clone or navigate to the project
cd apple-dev-mcp-server

# Install dependencies
npm install

# Build
npm run build
```

## Configuration

### For Claude Desktop

Add to your `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "apple-dev": {
      "command": "node",
      "args": ["/Users/YOUR_USERNAME/Desktop/apple-dev-mcp-server/dist/index.js"]
    }
  }
}
```

### For VS Code with GitHub Copilot

Add to your VS Code settings (`.vscode/settings.json` or user settings):

```json
{
  "github.copilot.chat.mcpServers": {
    "apple-dev": {
      "command": "node",
      "args": ["${userHome}/Desktop/apple-dev-mcp-server/dist/index.js"]
    }
  }
}
```

### For Other MCP Clients

The server uses stdio transport and can be integrated with any MCP-compatible client:

```bash
node /path/to/apple-dev-mcp-server/dist/index.js
```

## Usage Examples

### Fetch Apple Documentation

```
Use the fetch_latest_apple_docs tool to get documentation for NavigationStack
```

### Analyze Build Errors

```
Use xcode_diagnostic_analyzer to analyze this error:
"cannot find type 'NavigationStack' in scope"
```

### Check Swift Evolution

```
Use swift_evolution_check to verify if 'nonisolated(unsafe)' is available in Swift 5.10
```

## Development

```bash
# Watch mode for development
npm run dev

# Build for production
npm run build

# Run the server
npm start
```

## Project Structure

```
apple-dev-mcp-server/
├── src/
│   ├── index.ts                 # Main server entry point
│   └── tools/
│       ├── fetch-apple-docs.ts  # Documentation fetcher
│       ├── xcode-diagnostic-analyzer.ts  # Build error analyzer
│       └── swift-evolution-check.ts      # Swift Evolution checker
├── package.json
├── tsconfig.json
└── README.md
```

## Requirements

- Node.js >= 18.0.0
- npm or yarn

## License

MIT

---

> **Note:** This is a community tool and is not affiliated with or endorsed by Apple Inc.
