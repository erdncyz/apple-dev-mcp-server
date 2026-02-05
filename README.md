# Apple Dev MCP Server 🍎

[![npm version](https://badge.fury.io/js/apple-dev-mcp-server.svg)](https://www.npmjs.com/package/apple-dev-mcp-server)

A Model Context Protocol (MCP) server for Apple development assistance. Provides tools for fetching **live** Apple documentation directly from developer.apple.com, analyzing Xcode build errors, and checking Swift Evolution proposal status.

## ✨ Features

- **🔴 Live Documentation** - Fetches real-time documentation from Apple's official API
- **🔧 Xcode Error Analysis** - Intelligent parsing and fix suggestions for build errors
- **📋 Swift Evolution Tracking** - Check proposal status for Swift language features

### 🔧 Tools

| Tool | Description |
|------|-------------|
| `fetch_latest_apple_docs` | Fetches **live** Apple Developer Documentation from developer.apple.com |
| `xcode_diagnostic_analyzer` | Analyzes Xcode build logs and provides fix-it suggestions |
| `swift_evolution_check` | Checks Swift Evolution proposal status for language features |

## 📦 Installation

### Via npm (Recommended)

```bash
npm install -g apple-dev-mcp-server
```

### Via npx (No install required)

```bash
npx apple-dev-mcp-server
```

### From Source

```bash
git clone https://github.com/erdncyz/apple-dev-mcp-server.git
cd apple-dev-mcp-server
npm install
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

## 🔴 Live Documentation API

This MCP server uses Apple's undocumented JSON API to fetch **real-time documentation**:

```
https://developer.apple.com/tutorials/data/documentation/{framework}/{symbol}.json
```

### Supported Frameworks

SwiftUI, UIKit, Foundation, Observation, SwiftData, Combine, RealityKit, ARKit, CoreData, CoreML, MapKit, CloudKit, HealthKit, StoreKit, AVFoundation, and more.

### Example Response

```
# 📚 Apple Developer Documentation: NavigationStack

> ✅ Live documentation from developer.apple.com

**Type:** Structure
**Framework:** SwiftUI
**Availability:** iOS 16.0+, iPadOS 16.0+, macOS 13.0+, tvOS 16.0+, visionOS 1.0+, watchOS 9.0+

## Declaration
@MainActor struct NavigationStack<Data, Root> where Root : View

## Overview
A view that displays a root view and enables you to present additional views...
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
│   ├── index.ts                 # Main MCP server entry point
│   └── tools/
│       ├── fetch-apple-docs.ts  # Live documentation fetcher
│       ├── xcode-diagnostic-analyzer.ts  # Build error analyzer
│       └── swift-evolution-check.ts      # Swift Evolution checker
├── dist/                        # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Requirements

- Node.js >= 18.0.0
- npm or yarn

## 📄 License

MIT

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/apple-dev-mcp-server)
- [GitHub Repository](https://github.com/erdncyz/apple-dev-mcp-server)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)

---

> **Note:** This is a community tool and is not affiliated with or endorsed by Apple Inc.
