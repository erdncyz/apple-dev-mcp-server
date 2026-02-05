/**
 * Fetch Apple Developer Documentation - LIVE
 * 
 * Uses Apple's official documentation JSON API to fetch
 * real-time documentation from developer.apple.com
 */

interface AppleDocResult {
  title: string;
  description: string;
  url: string;
  type: string;
  framework?: string;
  availability?: string[];
  codeExamples?: string[];
  declaration?: string;
  overview?: string;
}

interface AppleDocJSON {
  metadata?: {
    title?: string;
    roleHeading?: string;
    platforms?: Array<{ name: string; introducedAt: string }>;
    modules?: Array<{ name: string }>;
    fragments?: Array<{ text: string; kind: string }>;
  };
  abstract?: Array<{ text: string; type: string }>;
  primaryContentSections?: Array<{
    kind: string;
    content?: Array<any>;
    declarations?: Array<{
      tokens: Array<{ text: string; kind: string }>;
    }>;
  }>;
}

// Apple Documentation JSON API base
const APPLE_DOCS_API = "https://developer.apple.com/tutorials/data/documentation";

/**
 * Framework to documentation path mappings
 */
const FRAMEWORK_PATHS: Record<string, string[]> = {
  "swiftui": ["swiftui"],
  "uikit": ["uikit"],
  "foundation": ["foundation"],
  "observation": ["observation"],
  "swiftdata": ["swiftdata"],
  "combine": ["combine"],
  "realitykit": ["realitykit"],
  "arkit": ["arkit"],
  "coredata": ["coredata"],
  "coreml": ["coreml"],
  "mapkit": ["mapkit"],
  "cloudkit": ["cloudkit"],
  "healthkit": ["healthkit"],
  "storekit": ["storekit"],
  "avfoundation": ["avfoundation"],
  "swift": ["swift", "observation"]
};

/**
 * Common API name mappings
 */
const API_MAPPINGS: Record<string, { framework: string; path: string }> = {
  // SwiftUI
  "navigationstack": { framework: "swiftui", path: "swiftui/navigationstack" },
  "navigationlink": { framework: "swiftui", path: "swiftui/navigationlink" },
  "navigationpath": { framework: "swiftui", path: "swiftui/navigationpath" },
  "navigationsplitview": { framework: "swiftui", path: "swiftui/navigationsplitview" },
  "list": { framework: "swiftui", path: "swiftui/list" },
  "form": { framework: "swiftui", path: "swiftui/form" },
  "sheet": { framework: "swiftui", path: "swiftui/view/sheet(ispresented:ondismiss:content:)" },
  "state": { framework: "swiftui", path: "swiftui/state" },
  "binding": { framework: "swiftui", path: "swiftui/binding" },
  "environment": { framework: "swiftui", path: "swiftui/environment" },
  "environmentobject": { framework: "swiftui", path: "swiftui/environmentobject" },
  "stateobject": { framework: "swiftui", path: "swiftui/stateobject" },
  "observedobject": { framework: "swiftui", path: "swiftui/observedobject" },
  "view": { framework: "swiftui", path: "swiftui/view" },
  "text": { framework: "swiftui", path: "swiftui/text" },
  "button": { framework: "swiftui", path: "swiftui/button" },
  "image": { framework: "swiftui", path: "swiftui/image" },
  "asyncimage": { framework: "swiftui", path: "swiftui/asyncimage" },
  "lazyvgrid": { framework: "swiftui", path: "swiftui/lazyvgrid" },
  "lazyhgrid": { framework: "swiftui", path: "swiftui/lazyhgrid" },
  "scrollview": { framework: "swiftui", path: "swiftui/scrollview" },
  "tabview": { framework: "swiftui", path: "swiftui/tabview" },
  "alert": { framework: "swiftui", path: "swiftui/view/alert(ispresented:content:)" },
  "toolbar": { framework: "swiftui", path: "swiftui/view/toolbar(content:)-5w0tj" },
  "searchable": { framework: "swiftui", path: "swiftui/view/searchable(text:placement:prompt:)" },
  "task": { framework: "swiftui", path: "swiftui/view/task(priority:_:)" },
  "onappear": { framework: "swiftui", path: "swiftui/view/onappear(perform:)" },
  "ondisappear": { framework: "swiftui", path: "swiftui/view/ondisappear(perform:)" },
  
  // Observation Framework
  "observable": { framework: "observation", path: "observation/observable" },
  "@observable": { framework: "observation", path: "observation/observable()" },
  
  // SwiftData
  "@model": { framework: "swiftdata", path: "swiftdata/model()" },
  "modelcontainer": { framework: "swiftdata", path: "swiftdata/modelcontainer" },
  "modelcontext": { framework: "swiftdata", path: "swiftdata/modelcontext" },
  "@query": { framework: "swiftdata", path: "swiftdata/query" },
  
  // Combine
  "publisher": { framework: "combine", path: "combine/publisher" },
  "subject": { framework: "combine", path: "combine/subject" },
  "passthroughsubject": { framework: "combine", path: "combine/passthroughsubject" },
  "currentvaluesubject": { framework: "combine", path: "combine/currentvaluesubject" },
  
  // Foundation
  "url": { framework: "foundation", path: "foundation/url" },
  "urlsession": { framework: "foundation", path: "foundation/urlsession" },
  "data": { framework: "foundation", path: "foundation/data" },
  "date": { framework: "foundation", path: "foundation/date" },
  "userdefaults": { framework: "foundation", path: "foundation/userdefaults" },
  "notification": { framework: "foundation", path: "foundation/notification" },
  "notificationcenter": { framework: "foundation", path: "foundation/notificationcenter" },
  
  // UIKit
  "uiviewcontroller": { framework: "uikit", path: "uikit/uiviewcontroller" },
  "uitableview": { framework: "uikit", path: "uikit/uitableview" },
  "uicollectionview": { framework: "uikit", path: "uikit/uicollectionview" },
  "uinavigationcontroller": { framework: "uikit", path: "uikit/uinavigationcontroller" }
};

/**
 * Fetch live documentation from Apple
 */
export async function fetchAppleDocs(
  query: string,
  framework?: string,
  includeExamples: boolean = true
): Promise<string> {
  const normalizedQuery = query.toLowerCase().replace(/^@/, "");
  
  try {
    // Try direct API mapping first
    let docPath = getDocPath(normalizedQuery, framework);
    
    if (docPath) {
      const liveDoc = await fetchLiveDoc(docPath);
      if (liveDoc) {
        return formatLiveDoc(liveDoc, query, includeExamples);
      }
    }
    
    // Try framework-based search
    if (framework) {
      const frameworkPaths = FRAMEWORK_PATHS[framework.toLowerCase()];
      if (frameworkPaths) {
        for (const fwPath of frameworkPaths) {
          const tryPath = `${fwPath}/${normalizedQuery}`;
          const liveDoc = await fetchLiveDoc(tryPath);
          if (liveDoc) {
            return formatLiveDoc(liveDoc, query, includeExamples);
          }
        }
      }
    }
    
    // Try common frameworks
    const commonFrameworks = ["swiftui", "foundation", "uikit", "observation", "swiftdata", "combine"];
    for (const fw of commonFrameworks) {
      const tryPath = `${fw}/${normalizedQuery}`;
      const liveDoc = await fetchLiveDoc(tryPath);
      if (liveDoc) {
        return formatLiveDoc(liveDoc, query, includeExamples);
      }
    }
    
    // If no live doc found, return a message
    return formatNotFound(query, framework);
    
  } catch (error) {
    return formatError(query, framework, error);
  }
}

/**
 * Get documentation path for a query
 */
function getDocPath(query: string, framework?: string): string | null {
  const normalizedQuery = query.toLowerCase().replace(/^@/, "");
  
  // Check direct mapping
  if (API_MAPPINGS[normalizedQuery]) {
    return API_MAPPINGS[normalizedQuery].path;
  }
  
  // Check with @ prefix
  if (API_MAPPINGS[`@${normalizedQuery}`]) {
    return API_MAPPINGS[`@${normalizedQuery}`].path;
  }
  
  // Build path from framework
  if (framework) {
    return `${framework.toLowerCase()}/${normalizedQuery}`;
  }
  
  return null;
}

/**
 * Fetch live documentation from Apple's JSON API
 */
async function fetchLiveDoc(docPath: string): Promise<AppleDocJSON | null> {
  const url = `${APPLE_DOCS_API}/${docPath}.json`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json() as AppleDocJSON;
  } catch {
    return null;
  }
}

/**
 * Format live documentation response
 */
function formatLiveDoc(doc: AppleDocJSON, query: string, includeExamples: boolean): string {
  let output = "";
  
  const title = doc.metadata?.title || query;
  const roleHeading = doc.metadata?.roleHeading || "";
  const framework = doc.metadata?.modules?.[0]?.name || "";
  
  output += `# 📚 Apple Developer Documentation: ${title}\n\n`;
  output += `> ✅ **Live documentation from developer.apple.com**\n\n`;
  
  if (roleHeading) {
    output += `**Type:** ${roleHeading}\n`;
  }
  if (framework) {
    output += `**Framework:** ${framework}\n`;
  }
  
  // Platform availability
  const platforms = doc.metadata?.platforms;
  if (platforms && platforms.length > 0) {
    output += `**Availability:** `;
    output += platforms.map(p => `${p.name} ${p.introducedAt}+`).join(", ");
    output += `\n`;
  }
  
  output += `**Documentation URL:** https://developer.apple.com/documentation/${getDocPathFromTitle(title, framework)}\n\n`;
  
  // Declaration
  const declarations = doc.primaryContentSections?.find(s => s.kind === "declarations");
  if (declarations?.declarations?.[0]) {
    const tokens = declarations.declarations[0].tokens;
    const declarationText = tokens.map(t => t.text).join("");
    output += `## Declaration\n\n`;
    output += "```swift\n";
    output += declarationText;
    output += "\n```\n\n";
  }
  
  // Abstract
  if (doc.abstract && doc.abstract.length > 0) {
    output += `## Overview\n\n`;
    const abstractText = doc.abstract.map(a => a.text).join("");
    output += `${abstractText}\n\n`;
  }
  
  // Content sections
  const contentSection = doc.primaryContentSections?.find(s => s.kind === "content");
  if (contentSection?.content) {
    output += parseContentSection(contentSection.content);
  }
  
  // Code examples from content
  if (includeExamples) {
    const codeExamples = extractCodeExamples(doc);
    if (codeExamples.length > 0) {
      output += `## Code Examples\n\n`;
      for (const example of codeExamples) {
        output += "```swift\n";
        output += example;
        output += "\n```\n\n";
      }
    }
  }
  
  // Footer
  output += `---\n`;
  output += `*Documentation fetched live from Apple Developer on ${new Date().toISOString().split('T')[0]}*\n`;
  
  return output;
}

/**
 * Parse content section to markdown
 */
function parseContentSection(content: any[]): string {
  let output = "";
  
  for (const item of content) {
    if (item.type === "heading") {
      const level = item.level || 2;
      output += `${"#".repeat(level)} ${item.text}\n\n`;
    } else if (item.type === "paragraph") {
      const text = item.inlineContent?.map((c: any) => {
        if (c.type === "text") return c.text;
        if (c.type === "codeVoice") return `\`${c.code}\``;
        if (c.type === "reference") return `**${c.identifier?.split("/").pop() || ""}**`;
        return "";
      }).join("") || "";
      output += `${text}\n\n`;
    } else if (item.type === "codeListing") {
      output += "```" + (item.syntax || "swift") + "\n";
      output += (item.code || []).join("\n");
      output += "\n```\n\n";
    }
  }
  
  return output;
}

/**
 * Extract code examples from documentation
 */
function extractCodeExamples(doc: AppleDocJSON): string[] {
  const examples: string[] = [];
  
  const contentSection = doc.primaryContentSections?.find(s => s.kind === "content");
  if (contentSection?.content) {
    for (const item of contentSection.content) {
      if (item.type === "codeListing" && item.code) {
        examples.push(item.code.join("\n"));
      }
    }
  }
  
  return examples;
}

/**
 * Get documentation path from title
 */
function getDocPathFromTitle(title: string, framework: string): string {
  const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedFramework = framework.toLowerCase();
  return `${normalizedFramework}/${normalizedTitle}`;
}

/**
 * Format not found message
 */
function formatNotFound(query: string, framework?: string): string {
  let output = `# Apple Documentation: ${query}\n\n`;
  output += `> ⚠️ Could not find live documentation for "${query}"`;
  if (framework) {
    output += ` in ${framework}`;
  }
  output += `\n\n`;
  
  output += `## Suggestions\n\n`;
  output += `1. Check the spelling of the API name\n`;
  output += `2. Try specifying the framework (e.g., "SwiftUI")\n`;
  output += `3. Use the full API name (e.g., "NavigationStack" instead of "navigation")\n\n`;
  
  output += `## Quick Links\n\n`;
  output += `- [Apple Developer Documentation](https://developer.apple.com/documentation/)\n`;
  output += `- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui)\n`;
  output += `- [Swift Documentation](https://developer.apple.com/documentation/swift)\n`;
  output += `- [WWDC Videos](https://developer.apple.com/videos/)\n`;
  
  return output;
}

/**
 * Format error message
 */
function formatError(query: string, framework: string | undefined, error: unknown): string {
  let output = `# Apple Documentation: ${query}\n\n`;
  output += `> ❌ Error fetching documentation\n\n`;
  output += `An error occurred while fetching documentation. Please try again.\n\n`;
  output += `## Quick Links\n\n`;
  output += `- [Apple Developer Documentation](https://developer.apple.com/documentation/)\n`;
  
  return output;
}
