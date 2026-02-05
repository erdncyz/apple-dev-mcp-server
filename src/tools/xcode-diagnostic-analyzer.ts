/**
 * Xcode Diagnostic Analyzer
 * 
 * Analyzes Xcode build logs and error messages,
 * providing explanations and fix-it suggestions.
 */

interface DiagnosticResult {
  errorType: string;
  severity: "error" | "warning" | "note";
  message: string;
  explanation: string;
  fixItSuggestions: string[];
  relatedDocs: string[];
  codeExample?: string;
}

// Common Swift/Xcode error patterns
const ERROR_PATTERNS: Array<{
  pattern: RegExp;
  type: string;
  explanation: string;
  fixIts: string[];
  docs: string[];
}> = [
  {
    pattern: /cannot find type '(\w+)' in scope/i,
    type: "Type Not Found",
    explanation: "The compiler cannot find a type with this name. This usually means the type isn't imported, doesn't exist, or is misspelled.",
    fixIts: [
      "Import the module containing this type",
      "Check for typos in the type name",
      "Ensure the type is declared as public if it's from another module",
      "Add the framework to your target's dependencies"
    ],
    docs: ["https://developer.apple.com/documentation/swift/importing_modules"]
  },
  {
    pattern: /cannot find '(\w+)' in scope/i,
    type: "Symbol Not Found",
    explanation: "The compiler cannot find a variable, function, or other symbol with this name.",
    fixIts: [
      "Check spelling of the identifier",
      "Ensure the symbol is declared before use",
      "Import the required module",
      "Check access control (private/internal/public)"
    ],
    docs: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/"]
  },
  {
    pattern: /value of type '(.+)' has no member '(\w+)'/i,
    type: "Member Not Found",
    explanation: "You're trying to access a property or method that doesn't exist on this type.",
    fixIts: [
      "Check the API documentation for available members",
      "Ensure you're using the correct type",
      "The API might have been renamed or deprecated",
      "Check if you need to cast to a different type"
    ],
    docs: ["https://developer.apple.com/documentation/"]
  },
  {
    pattern: /cannot convert value of type '(.+)' to expected argument type '(.+)'/i,
    type: "Type Mismatch",
    explanation: "The types don't match - you're passing a value of one type where another type is expected.",
    fixIts: [
      "Use explicit type conversion if appropriate",
      "Check if the API expects an optional type",
      "Use a different initializer or method",
      "Ensure generic type parameters match"
    ],
    docs: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/typecasting/"]
  },
  {
    pattern: /ambiguous use of '(\w+)'/i,
    type: "Ambiguous Reference",
    explanation: "Multiple declarations match this name and the compiler can't determine which one to use.",
    fixIts: [
      "Add explicit type annotations",
      "Use fully qualified names (Module.Type)",
      "Provide more context to help type inference",
      "Check for conflicting imports"
    ],
    docs: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/"]
  },
  {
    pattern: /missing argument for parameter '(\w+)'/i,
    type: "Missing Argument",
    explanation: "A required parameter wasn't provided when calling a function or initializer.",
    fixIts: [
      "Add the missing argument",
      "Check if there's an overload that doesn't require this parameter",
      "Provide a default value if creating your own function"
    ],
    docs: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/functions/"]
  },
  {
    pattern: /use of unresolved identifier '(\w+)'/i,
    type: "Unresolved Identifier",
    explanation: "The compiler doesn't recognize this identifier in the current scope.",
    fixIts: [
      "Declare the variable/constant before using it",
      "Check for typos",
      "Ensure proper scope (the declaration might be in a different scope)",
      "Import required modules"
    ],
    docs: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/declarations/"]
  },
  {
    pattern: /type '(.+)' does not conform to protocol '(.+)'/i,
    type: "Protocol Conformance Error",
    explanation: "Your type declares conformance to a protocol but doesn't implement all required members.",
    fixIts: [
      "Implement all required protocol methods and properties",
      "Check for method signature mismatches",
      "Add missing associated types",
      "Use protocol extension default implementations where available"
    ],
    docs: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/"]
  },
  {
    pattern: /call can throw, but it is not marked with 'try'/i,
    type: "Missing Try Keyword",
    explanation: "You're calling a throwing function without the 'try' keyword.",
    fixIts: [
      "Add 'try' before the throwing call",
      "Use 'try?' for optional result (returns nil on error)",
      "Use 'try!' if you're certain it won't throw (crashes on error)",
      "Wrap in do-catch block"
    ],
    docs: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/"]
  },
  {
    pattern: /cannot use mutating member on immutable value/i,
    type: "Mutability Error",
    explanation: "You're trying to modify a value that is immutable (declared with 'let' or accessed through a non-mutating context).",
    fixIts: [
      "Change 'let' to 'var' if the value should be mutable",
      "Mark the method as 'mutating' if in a struct",
      "Check if you're in a computed property or closure that captures self",
      "Use a class instead of struct if reference semantics are needed"
    ],
    docs: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/"]
  },
  {
    pattern: /actor-isolated property '(\w+)' can not be (mutated|referenced) from/i,
    type: "Actor Isolation Error",
    explanation: "You're trying to access actor-isolated state from outside the actor's context.",
    fixIts: [
      "Use 'await' to access actor-isolated members",
      "Mark the calling function as 'async'",
      "Use 'nonisolated' for members that don't need isolation",
      "Consider if the member should be on a different actor"
    ],
    docs: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/"]
  },
  {
    pattern: /linker command failed|Undefined symbols? for architecture/i,
    type: "Linker Error",
    explanation: "The linker couldn't find implementations for referenced symbols. This is typically a configuration issue.",
    fixIts: [
      "Ensure all required frameworks are linked in Build Phases",
      "Check that source files are added to the correct target",
      "Verify library search paths in Build Settings",
      "Clean build folder (Cmd+Shift+K) and rebuild"
    ],
    docs: ["https://developer.apple.com/documentation/xcode/configuring-a-new-target-in-your-project"]
  },
  {
    pattern: /main actor-isolated|@MainActor/i,
    type: "Main Actor Isolation",
    explanation: "Code must run on the main actor (main thread) for UI updates or accessing main-actor-isolated properties.",
    fixIts: [
      "Add @MainActor to the enclosing type or function",
      "Use MainActor.run { } for isolated blocks",
      "Use 'await MainActor.run { }' from async context",
      "Check if the property needs main actor isolation"
    ],
    docs: ["https://developer.apple.com/documentation/swift/mainactor"]
  },
  {
    pattern: /'@Sendable' closure|capture of '(.+)' with non-sendable type/i,
    type: "Sendable Conformance Error",
    explanation: "A closure or type crossing concurrency boundaries must be Sendable to ensure thread safety.",
    fixIts: [
      "Make the captured type conform to Sendable",
      "Use 'sending' parameter modifier (Swift 6)",
      "Capture only Sendable values in the closure",
      "Consider using an actor instead"
    ],
    docs: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/"]
  }
];

/**
 * Analyze Xcode build log and provide diagnostics
 */
export async function analyzeBuildLog(
  buildLog: string,
  errorCode?: string,
  context?: string
): Promise<string> {
  const diagnostics: DiagnosticResult[] = [];
  
  // Split log into lines for analysis
  const lines = buildLog.split("\n");
  
  // Find matching error patterns
  for (const errorDef of ERROR_PATTERNS) {
    const match = buildLog.match(errorDef.pattern);
    if (match) {
      diagnostics.push({
        errorType: errorDef.type,
        severity: buildLog.toLowerCase().includes("warning") ? "warning" : "error",
        message: match[0],
        explanation: errorDef.explanation,
        fixItSuggestions: errorDef.fixIts,
        relatedDocs: errorDef.docs
      });
    }
  }

  // If no patterns matched, provide general analysis
  if (diagnostics.length === 0) {
    return analyzeUnknownError(buildLog, context);
  }

  return formatDiagnostics(diagnostics, buildLog, context);
}

/**
 * Format diagnostics into readable output
 */
function formatDiagnostics(
  diagnostics: DiagnosticResult[],
  originalLog: string,
  context?: string
): string {
  let output = `# Xcode Build Diagnostic Analysis\n\n`;
  
  if (context) {
    output += `**Context:** ${context}\n\n`;
  }

  output += `## Found ${diagnostics.length} Issue(s)\n\n`;

  for (let i = 0; i < diagnostics.length; i++) {
    const diag = diagnostics[i];
    const emoji = diag.severity === "error" ? "🔴" : diag.severity === "warning" ? "🟡" : "🔵";
    
    output += `### ${emoji} ${i + 1}. ${diag.errorType}\n\n`;
    output += `**Message:**\n\`\`\`\n${diag.message}\n\`\`\`\n\n`;
    output += `**Explanation:**\n${diag.explanation}\n\n`;
    
    output += `**Fix-it Suggestions:**\n`;
    for (const fix of diag.fixItSuggestions) {
      output += `- ${fix}\n`;
    }
    output += `\n`;

    if (diag.relatedDocs.length > 0) {
      output += `**Related Documentation:**\n`;
      for (const doc of diag.relatedDocs) {
        output += `- [${doc}](${doc})\n`;
      }
      output += `\n`;
    }

    output += `---\n\n`;
  }

  // Add general troubleshooting tips
  output += `## General Troubleshooting\n\n`;
  output += `1. **Clean Build:** Press \`Cmd+Shift+K\` to clean the build folder\n`;
  output += `2. **Derived Data:** Delete \`~/Library/Developer/Xcode/DerivedData\`\n`;
  output += `3. **SPM Cache:** Reset package caches via \`File > Packages > Reset Package Caches\`\n`;
  output += `4. **Restart Xcode:** Sometimes a fresh start helps\n`;
  output += `5. **Check Swift Version:** Ensure your Swift version matches the code requirements\n`;

  return output;
}

/**
 * Analyze unknown/unmatched errors
 */
function analyzeUnknownError(buildLog: string, context?: string): string {
  let output = `# Build Log Analysis\n\n`;
  
  // Extract key information from the log
  const hasError = /error:/i.test(buildLog);
  const hasWarning = /warning:/i.test(buildLog);
  
  if (!hasError && !hasWarning) {
    output += `## ✅ No Clear Errors Detected\n\n`;
    output += `The build log doesn't contain obvious error or warning markers.\n\n`;
  } else {
    output += `## ⚠️ Build Issues Detected\n\n`;
    output += `**Raw Log:**\n\`\`\`\n${buildLog.slice(0, 2000)}${buildLog.length > 2000 ? '\n...(truncated)' : ''}\n\`\`\`\n\n`;
  }

  output += `## Suggestions\n\n`;
  output += `1. **Check the full error message** in Xcode's Issue Navigator (Cmd+5)\n`;
  output += `2. **Click on the error** to navigate to the problematic code\n`;
  output += `3. **Read Xcode's Fix-it suggestions** (click the red/yellow indicator)\n`;
  output += `4. **Search the error message** on developer.apple.com or forums\n\n`;

  output += `## Common Build Failure Causes\n\n`;
  output += `- Missing import statements\n`;
  output += `- Syntax errors in Swift code\n`;
  output += `- Type mismatches\n`;
  output += `- Missing required frameworks\n`;
  output += `- Incorrect deployment target\n`;
  output += `- Code signing issues\n`;
  output += `- Swift version incompatibilities\n`;

  return output;
}
