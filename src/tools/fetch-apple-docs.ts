/**
 * Fetch Apple Developer Documentation
 * 
 * Uses Apple's developer documentation search API to fetch
 * official documentation for Swift APIs and frameworks.
 */

import * as cheerio from "cheerio";

interface AppleDocResult {
  title: string;
  description: string;
  url: string;
  type: string;
  framework?: string;
  availability?: string[];
  codeExample?: string;
}

// Apple Developer Documentation Search API endpoint
const APPLE_SEARCH_API = "https://developer.apple.com/search/api/search.php";
const APPLE_DOCS_BASE = "https://developer.apple.com/documentation";

/**
 * Common Swift/Apple frameworks for context
 */
const FRAMEWORKS = [
  "SwiftUI", "UIKit", "AppKit", "Foundation", "SwiftData",
  "RealityKit", "ARKit", "CoreData", "Combine", "CoreML",
  "Vision", "NaturalLanguage", "MapKit", "CloudKit", "HealthKit",
  "StoreKit", "GameKit", "SpriteKit", "SceneKit", "Metal",
  "AVFoundation", "CoreImage", "CoreGraphics", "CoreAnimation"
];

/**
 * Search Apple's documentation and return formatted results
 */
export async function fetchAppleDocs(
  query: string,
  framework?: string,
  includeExamples: boolean = true
): Promise<string> {
  try {
    // Build search query
    const searchQuery = framework ? `${framework} ${query}` : query;
    
    // Try to fetch from Apple's documentation
    const results = await searchAppleDocs(searchQuery);
    
    if (results.length === 0) {
      return formatNoResults(query, framework);
    }

    // Format the results
    return formatDocResults(results, query, framework, includeExamples);
  } catch (error) {
    // Fallback to curated documentation info
    return generateFallbackDocs(query, framework, includeExamples);
  }
}

/**
 * Search Apple documentation API
 */
async function searchAppleDocs(query: string): Promise<AppleDocResult[]> {
  const searchUrl = `${APPLE_SEARCH_API}?q=${encodeURIComponent(query)}&lang=en&type=documentation`;
  
  const response = await fetch(searchUrl, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data = await response.json() as any;
  const results: AppleDocResult[] = [];

  if (data.results) {
    for (const item of data.results.slice(0, 5)) {
      results.push({
        title: item.title || "",
        description: item.description || "",
        url: item.url ? `https://developer.apple.com${item.url}` : "",
        type: item.type || "documentation",
        framework: item.framework
      });
    }
  }

  return results;
}

/**
 * Format documentation results
 */
function formatDocResults(
  results: AppleDocResult[],
  query: string,
  framework?: string,
  includeExamples?: boolean
): string {
  let output = `# Apple Developer Documentation: ${query}\n\n`;
  
  if (framework) {
    output += `**Framework:** ${framework}\n\n`;
  }

  output += `## Search Results\n\n`;

  for (const result of results) {
    output += `### ${result.title}\n`;
    output += `**Type:** ${result.type}\n`;
    if (result.framework) {
      output += `**Framework:** ${result.framework}\n`;
    }
    output += `**URL:** ${result.url}\n\n`;
    if (result.description) {
      output += `${result.description}\n\n`;
    }
    output += `---\n\n`;
  }

  if (includeExamples) {
    output += generateCodeExamples(query, framework);
  }

  output += `\n## Quick Reference Links\n`;
  output += `- [Apple Developer Documentation](https://developer.apple.com/documentation/)\n`;
  output += `- [Swift Documentation](https://docs.swift.org/)\n`;
  output += `- [WWDC Videos](https://developer.apple.com/videos/)\n`;

  return output;
}

/**
 * Generate code examples based on query
 */
function generateCodeExamples(query: string, framework?: string): string {
  const lowerQuery = query.toLowerCase();
  let examples = `## Code Examples\n\n`;

  // SwiftUI Navigation examples
  if (lowerQuery.includes("navigationstack") || lowerQuery.includes("navigation")) {
    examples += `### NavigationStack Example (SwiftUI)\n\n`;
    examples += "```swift\n";
    examples += `import SwiftUI

struct ContentView: View {
    @State private var path = NavigationPath()
    
    var body: some View {
        NavigationStack(path: $path) {
            List {
                NavigationLink("Go to Detail", value: "detail")
            }
            .navigationDestination(for: String.self) { value in
                DetailView(item: value)
            }
            .navigationTitle("Home")
        }
    }
}

struct DetailView: View {
    let item: String
    
    var body: some View {
        Text("Detail: \\(item)")
            .navigationTitle("Detail")
    }
}
`;
    examples += "```\n\n";
  }

  // SwiftData examples
  if (lowerQuery.includes("swiftdata") || lowerQuery.includes("@model")) {
    examples += `### SwiftData Model Example\n\n`;
    examples += "```swift\n";
    examples += `import SwiftData

@Model
final class Item {
    var timestamp: Date
    var title: String
    var isCompleted: Bool
    
    @Relationship(deleteRule: .cascade)
    var tags: [Tag]?
    
    init(title: String, timestamp: Date = .now) {
        self.title = title
        self.timestamp = timestamp
        self.isCompleted = false
    }
}

@Model
final class Tag {
    var name: String
    
    init(name: String) {
        self.name = name
    }
}

// Usage in SwiftUI
struct ContentView: View {
    @Environment(\\.modelContext) private var modelContext
    @Query private var items: [Item]
    
    var body: some View {
        List(items) { item in
            Text(item.title)
        }
    }
}
`;
    examples += "```\n\n";
  }

  // Observable macro examples
  if (lowerQuery.includes("@observable") || lowerQuery.includes("observable")) {
    examples += `### @Observable Macro Example (Swift 5.9+)\n\n`;
    examples += "```swift\n";
    examples += `import SwiftUI

@Observable
final class AppState {
    var counter = 0
    var userName = ""
    var isLoggedIn = false
    
    func increment() {
        counter += 1
    }
}

struct ContentView: View {
    @State private var appState = AppState()
    
    var body: some View {
        VStack {
            Text("Count: \\(appState.counter)")
            Button("Increment") {
                appState.increment()
            }
        }
    }
}
`;
    examples += "```\n\n";
  }

  // RealityKit examples
  if (lowerQuery.includes("realitykit") || lowerQuery.includes("reality")) {
    examples += `### RealityKit Example\n\n`;
    examples += "```swift\n";
    examples += `import SwiftUI
import RealityKit

struct ImmersiveView: View {
    var body: some View {
        RealityView { content in
            // Add a simple 3D box
            let mesh = MeshResource.generateBox(size: 0.1)
            let material = SimpleMaterial(color: .blue, isMetallic: true)
            let entity = ModelEntity(mesh: mesh, materials: [material])
            
            entity.position = [0, 1, -1]
            content.add(entity)
        }
    }
}
`;
    examples += "```\n\n";
  }

  // Async/await examples
  if (lowerQuery.includes("async") || lowerQuery.includes("await") || lowerQuery.includes("concurrency")) {
    examples += `### Swift Concurrency Example\n\n`;
    examples += "```swift\n";
    examples += `import Foundation

// Async function
func fetchData() async throws -> Data {
    let url = URL(string: "https://api.example.com/data")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return data
}

// Actor for thread-safe state
actor DataManager {
    private var cache: [String: Data] = [:]
    
    func getData(for key: String) async throws -> Data {
        if let cached = cache[key] {
            return cached
        }
        let data = try await fetchData()
        cache[key] = data
        return data
    }
}

// Task group example
func fetchMultiple() async throws -> [Data] {
    try await withThrowingTaskGroup(of: Data.self) { group in
        for i in 0..<5 {
            group.addTask {
                try await fetchData()
            }
        }
        
        var results: [Data] = []
        for try await data in group {
            results.append(data)
        }
        return results
    }
}
`;
    examples += "```\n\n";
  }

  return examples;
}

/**
 * Format no results message
 */
function formatNoResults(query: string, framework?: string): string {
  let message = `# No Documentation Found for "${query}"\n\n`;
  
  if (framework) {
    message += `Searched in framework: ${framework}\n\n`;
  }

  message += `## Suggestions:\n`;
  message += `1. Check the spelling of the API name\n`;
  message += `2. Try searching for a broader term\n`;
  message += `3. Visit [Apple Developer Documentation](https://developer.apple.com/documentation/) directly\n\n`;
  message += `## Popular Frameworks:\n`;
  
  for (const fw of FRAMEWORKS.slice(0, 10)) {
    message += `- ${fw}\n`;
  }

  return message;
}

/**
 * Generate fallback documentation when API is unavailable
 */
function generateFallbackDocs(
  query: string,
  framework?: string,
  includeExamples?: boolean
): string {
  let output = `# Apple Documentation Reference: ${query}\n\n`;
  
  output += `> **Note:** Unable to fetch live documentation. Providing curated reference information.\n\n`;
  
  output += `## Official Resources\n\n`;
  output += `- **Documentation:** [developer.apple.com/documentation](https://developer.apple.com/documentation/)\n`;
  output += `- **Search:** [developer.apple.com/search/?q=${encodeURIComponent(query)}](https://developer.apple.com/search/?q=${encodeURIComponent(query)})\n`;
  
  if (framework) {
    output += `- **${framework} Docs:** [developer.apple.com/documentation/${framework.toLowerCase()}](https://developer.apple.com/documentation/${framework.toLowerCase()})\n`;
  }
  
  output += `\n## WWDC Sessions\n`;
  output += `Search for related sessions: [developer.apple.com/videos](https://developer.apple.com/videos/)\n\n`;

  if (includeExamples) {
    output += generateCodeExamples(query, framework);
  }

  return output;
}
