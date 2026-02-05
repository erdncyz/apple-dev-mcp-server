/**
 * Swift Evolution Checker
 * 
 * Checks the status of Swift language features against
 * Swift Evolution proposals to verify availability and usage.
 */

interface SwiftEvolutionProposal {
  id: string;
  title: string;
  status: "implemented" | "accepted" | "active-review" | "scheduled" | "returned" | "rejected" | "withdrawn";
  swiftVersion?: string;
  summary: string;
  link: string;
  keywords: string[];
}

// Curated list of important Swift Evolution proposals
const SWIFT_EVOLUTION_DB: SwiftEvolutionProposal[] = [
  // Swift 6.0 Features
  {
    id: "SE-0423",
    title: "Dynamic actor isolation enforcement from non-strict-concurrency contexts",
    status: "implemented",
    swiftVersion: "6.0",
    summary: "Enforces actor isolation dynamically when called from contexts without strict concurrency checking.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0423-dynamic-actor-isolation.md",
    keywords: ["actor", "isolation", "concurrency", "dynamic"]
  },
  {
    id: "SE-0420",
    title: "Inheritance of actor isolation",
    status: "implemented",
    swiftVersion: "6.0",
    summary: "Allows subclasses to inherit the actor isolation of their superclass methods.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0420-inheritance-of-actor-isolation.md",
    keywords: ["actor", "isolation", "inheritance", "class"]
  },
  {
    id: "SE-0414",
    title: "Region-based isolation",
    status: "implemented",
    swiftVersion: "6.0",
    summary: "Introduces region-based isolation to allow more flexible data sharing across concurrency domains.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0414-region-based-isolation.md",
    keywords: ["region", "isolation", "sendable", "concurrency"]
  },
  {
    id: "SE-0411",
    title: "Isolated default value expressions",
    status: "implemented",
    swiftVersion: "6.0",
    summary: "Allows default parameter values to be isolated to an actor.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0411-isolated-default-values.md",
    keywords: ["default", "parameter", "actor", "isolation"]
  },

  // Swift 5.10 Features
  {
    id: "SE-0412",
    title: "Strict concurrency for global variables",
    status: "implemented",
    swiftVersion: "5.10",
    summary: "Requires global and static variables to be isolated to a global actor or be Sendable.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0412-strict-concurrency-for-global-variables.md",
    keywords: ["global", "static", "concurrency", "sendable", "strict"]
  },
  {
    id: "SE-0401",
    title: "Remove Actor Isolation Inference caused by Property Wrappers",
    status: "implemented",
    swiftVersion: "5.10",
    summary: "Property wrappers no longer infer actor isolation on the enclosing type.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0401-remove-property-wrapper-isolation.md",
    keywords: ["property wrapper", "actor", "isolation", "inference"]
  },

  // Swift 5.9 Features
  {
    id: "SE-0395",
    title: "Observation",
    status: "implemented",
    swiftVersion: "5.9",
    summary: "Introduces the @Observable macro for automatic change tracking in classes.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0395-observability.md",
    keywords: ["@observable", "observable", "observation", "macro", "swiftui"]
  },
  {
    id: "SE-0394",
    title: "Package Manager Support for Custom Macros",
    status: "implemented",
    swiftVersion: "5.9",
    summary: "Allows Swift packages to define and distribute custom macros.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0394-swiftpm-expression-macros.md",
    keywords: ["macro", "package", "spm", "swiftpm"]
  },
  {
    id: "SE-0392",
    title: "Custom Actor Executors",
    status: "implemented",
    swiftVersion: "5.9",
    summary: "Allows actors to customize their execution context.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0392-custom-actor-executors.md",
    keywords: ["actor", "executor", "custom", "concurrency"]
  },
  {
    id: "SE-0389",
    title: "Attached Macros",
    status: "implemented",
    swiftVersion: "5.9",
    summary: "Macros that can be attached to declarations to generate additional code.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0389-attached-macros.md",
    keywords: ["macro", "attached", "declaration", "codegen"]
  },
  {
    id: "SE-0382",
    title: "Expression Macros",
    status: "implemented",
    swiftVersion: "5.9",
    summary: "Macros that can be used in expression contexts (#stringify, etc.).",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0382-expression-macros.md",
    keywords: ["macro", "expression", "#", "freestanding"]
  },
  {
    id: "SE-0380",
    title: "if and switch expressions",
    status: "implemented",
    swiftVersion: "5.9",
    summary: "Allows if and switch to be used as expressions that return values.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0380-if-switch-expressions.md",
    keywords: ["if", "switch", "expression", "return"]
  },
  {
    id: "SE-0393",
    title: "Value and Type Parameter Packs",
    status: "implemented",
    swiftVersion: "5.9",
    summary: "Introduces variadic generics via parameter packs.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0393-parameter-packs.md",
    keywords: ["parameter pack", "variadic", "generic", "each", "repeat"]
  },
  {
    id: "SE-0390",
    title: "Noncopyable structs and enums",
    status: "implemented",
    swiftVersion: "5.9",
    summary: "Introduces ~Copyable types that cannot be implicitly copied.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0390-noncopyable-structs-and-enums.md",
    keywords: ["noncopyable", "~copyable", "move", "consume", "ownership"]
  },

  // Swift 5.7/5.8 Features
  {
    id: "SE-0352",
    title: "Implicitly Opened Existentials",
    status: "implemented",
    swiftVersion: "5.7",
    summary: "Existential types (any Protocol) can be implicitly opened when passed to generic functions.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0352-implicit-open-existentials.md",
    keywords: ["existential", "any", "protocol", "generic", "open"]
  },
  {
    id: "SE-0309",
    title: "Unlock existential types for all protocols",
    status: "implemented",
    swiftVersion: "5.7",
    summary: "Any protocol can now be used as an existential type with 'any'.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0309-unlock-existential-types-for-all-protocols.md",
    keywords: ["existential", "any", "protocol", "self", "associated type"]
  },
  {
    id: "SE-0345",
    title: "if let shorthand for shadowing optionals",
    status: "implemented",
    swiftVersion: "5.7",
    summary: "Allows 'if let x' as shorthand for 'if let x = x'.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0345-if-let-shorthand.md",
    keywords: ["if let", "optional", "unwrap", "shorthand", "shadow"]
  },
  {
    id: "SE-0326",
    title: "Enable multi-statement closure parameter/result type inference",
    status: "implemented",
    swiftVersion: "5.7",
    summary: "Closures with multiple statements can now have their parameter/result types inferred.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0326-extending-multi-statement-closure-type-inference.md",
    keywords: ["closure", "inference", "multi-statement", "type"]
  },

  // nonisolated(unsafe) - Swift 5.10+
  {
    id: "SE-0412",
    title: "nonisolated(unsafe)",
    status: "implemented",
    swiftVersion: "5.10",
    summary: "Allows opting out of actor isolation checking for specific declarations when the programmer ensures thread safety manually.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0412-strict-concurrency-for-global-variables.md",
    keywords: ["nonisolated", "unsafe", "actor", "isolation", "concurrency", "global"]
  },

  // Typed throws - Swift 6.0
  {
    id: "SE-0413",
    title: "Typed throws",
    status: "implemented",
    swiftVersion: "6.0",
    summary: "Allows functions to specify the exact error type they throw using 'throws(ErrorType)'.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0413-typed-throws.md",
    keywords: ["throws", "typed throws", "error", "throwing", "typed"]
  },

  // Borrowing/Consuming
  {
    id: "SE-0377",
    title: "borrowing and consuming parameter ownership modifiers",
    status: "implemented",
    swiftVersion: "5.9",
    summary: "Allows explicit control over parameter ownership with borrowing and consuming modifiers.",
    link: "https://github.com/swiftlang/swift-evolution/blob/main/proposals/0377-parameter-ownership-modifiers.md",
    keywords: ["borrowing", "consuming", "ownership", "parameter", "move"]
  }
];

/**
 * Check Swift Evolution status for a feature
 */
export async function checkSwiftEvolution(
  feature: string,
  swiftVersion?: string
): Promise<string> {
  const normalizedFeature = feature.toLowerCase();
  
  // Search for matching proposals
  const matches = SWIFT_EVOLUTION_DB.filter(proposal => {
    // Check keywords
    const keywordMatch = proposal.keywords.some(kw => 
      normalizedFeature.includes(kw.toLowerCase()) ||
      kw.toLowerCase().includes(normalizedFeature)
    );
    
    // Check title
    const titleMatch = proposal.title.toLowerCase().includes(normalizedFeature);
    
    // Check proposal ID
    const idMatch = proposal.id.toLowerCase() === normalizedFeature;
    
    return keywordMatch || titleMatch || idMatch;
  });

  if (matches.length === 0) {
    return formatNoMatch(feature, swiftVersion);
  }

  return formatMatches(matches, feature, swiftVersion);
}

/**
 * Format matching proposals
 */
function formatMatches(
  matches: SwiftEvolutionProposal[],
  feature: string,
  swiftVersion?: string
): string {
  let output = `# Swift Evolution: "${feature}"\n\n`;

  if (swiftVersion) {
    output += `**Target Swift Version:** ${swiftVersion}\n\n`;
  }

  output += `## Found ${matches.length} Related Proposal(s)\n\n`;

  for (const proposal of matches) {
    const statusEmoji = getStatusEmoji(proposal.status);
    
    output += `### ${statusEmoji} ${proposal.id}: ${proposal.title}\n\n`;
    output += `| Property | Value |\n`;
    output += `|----------|-------|\n`;
    output += `| **Status** | ${proposal.status} |\n`;
    output += `| **Swift Version** | ${proposal.swiftVersion || "N/A"} |\n`;
    output += `| **Proposal** | [${proposal.id}](${proposal.link}) |\n\n`;
    
    output += `**Summary:**\n${proposal.summary}\n\n`;

    // Check version compatibility
    if (swiftVersion && proposal.swiftVersion) {
      const isCompatible = compareVersions(swiftVersion, proposal.swiftVersion);
      if (isCompatible) {
        output += `✅ **Available in Swift ${swiftVersion}**\n\n`;
      } else {
        output += `⚠️ **Requires Swift ${proposal.swiftVersion}** (you specified ${swiftVersion})\n\n`;
      }
    }

    // Add usage example if available
    output += generateUsageExample(proposal);
    
    output += `---\n\n`;
  }

  output += `## Resources\n\n`;
  output += `- [Swift Evolution Dashboard](https://apple.github.io/swift-evolution/)\n`;
  output += `- [Swift Evolution Proposals](https://github.com/swiftlang/swift-evolution/tree/main/proposals)\n`;
  output += `- [Swift.org](https://www.swift.org/)\n`;

  return output;
}

/**
 * Generate usage examples for proposals
 */
function generateUsageExample(proposal: SwiftEvolutionProposal): string {
  const id = proposal.id;
  let example = `**Usage Example:**\n\n`;

  if (proposal.keywords.includes("@observable")) {
    example += "```swift\n";
    example += `import Observation

@Observable
class CounterModel {
    var count = 0
    
    func increment() {
        count += 1
    }
}

// SwiftUI automatically tracks changes
struct CounterView: View {
    var model: CounterModel
    
    var body: some View {
        Text("Count: \\(model.count)")
        Button("Increment") {
            model.increment()
        }
    }
}
`;
    example += "```\n\n";
  } else if (proposal.keywords.includes("nonisolated")) {
    example += "```swift\n";
    example += `// nonisolated(unsafe) allows opting out of isolation checking
// Use only when you manually ensure thread safety

nonisolated(unsafe) var globalCache: [String: Data] = [:]

// Or on a property
actor DataManager {
    // This property is accessible without await
    // but YOU must ensure thread safety
    nonisolated(unsafe) var unsafeCache: [String: Data] = [:]
}
`;
    example += "```\n\n";
  } else if (proposal.keywords.includes("typed throws")) {
    example += "```swift\n";
    example += `// Swift 6.0 Typed Throws
enum ValidationError: Error {
    case tooShort
    case invalidFormat
}

// Specify exact error type
func validate(_ input: String) throws(ValidationError) {
    guard input.count >= 3 else {
        throw .tooShort
    }
}

// Caller knows exactly what errors to handle
do {
    try validate("ab")
} catch .tooShort {
    print("Input is too short")
} catch .invalidFormat {
    print("Invalid format")
}
`;
    example += "```\n\n";
  } else if (proposal.keywords.includes("parameter pack")) {
    example += "```swift\n";
    example += `// Parameter Packs (Variadic Generics)
func all<each T>(_ value: repeat each T) -> (repeat each T) {
    return (repeat each value)
}

// Works with any number of arguments
let result = all(1, "hello", 3.14)
// result is (Int, String, Double)

// Example: Type-safe zip
func zip<each T, each U>(
    _ first: repeat each T,
    _ second: repeat each U
) -> (repeat (each T, each U)) {
    return (repeat (each first, each second))
}
`;
    example += "```\n\n";
  } else if (proposal.keywords.includes("if") && proposal.keywords.includes("expression")) {
    example += "```swift\n";
    example += `// if/switch expressions (Swift 5.9+)
let value = if condition {
    "yes"
} else {
    "no"
}

// Works with switch too
let description = switch score {
    case 90...100: "Excellent"
    case 70..<90: "Good"
    case 50..<70: "Fair"
    default: "Needs improvement"
}
`;
    example += "```\n\n";
  } else if (proposal.keywords.includes("noncopyable")) {
    example += "```swift\n";
    example += `// Noncopyable types (~Copyable)
struct FileHandle: ~Copyable {
    private var fd: Int32
    
    init(path: String) {
        self.fd = open(path, O_RDONLY)
    }
    
    deinit {
        close(fd)
    }
    
    consuming func close() {
        close(fd)
        // self is consumed, cannot be used after
    }
}

// Cannot copy, only move
var handle = FileHandle(path: "/tmp/test")
let handle2 = consume handle  // handle is no longer valid
`;
    example += "```\n\n";
  } else {
    example = ""; // No example available
  }

  return example;
}

/**
 * Get emoji for proposal status
 */
function getStatusEmoji(status: string): string {
  switch (status) {
    case "implemented": return "✅";
    case "accepted": return "🟢";
    case "active-review": return "🔵";
    case "scheduled": return "📅";
    case "returned": return "🔙";
    case "rejected": return "❌";
    case "withdrawn": return "⬅️";
    default: return "❓";
  }
}

/**
 * Compare Swift versions
 */
function compareVersions(target: string, required: string): boolean {
  const parseVersion = (v: string) => v.split(".").map(Number);
  const [targetMajor, targetMinor = 0] = parseVersion(target);
  const [reqMajor, reqMinor = 0] = parseVersion(required);
  
  if (targetMajor > reqMajor) return true;
  if (targetMajor < reqMajor) return false;
  return targetMinor >= reqMinor;
}

/**
 * Format no match found message
 */
function formatNoMatch(feature: string, swiftVersion?: string): string {
  let output = `# Swift Evolution: "${feature}"\n\n`;
  output += `## ❓ No Exact Match Found\n\n`;
  output += `The feature "${feature}" wasn't found in the local Swift Evolution database.\n\n`;

  output += `## Suggestions\n\n`;
  output += `1. **Search Swift Evolution directly:**\n`;
  output += `   [apple.github.io/swift-evolution](https://apple.github.io/swift-evolution/?search=${encodeURIComponent(feature)})\n\n`;
  output += `2. **Check the GitHub proposals:**\n`;
  output += `   [github.com/swiftlang/swift-evolution](https://github.com/swiftlang/swift-evolution/tree/main/proposals)\n\n`;
  output += `3. **Search Swift Forums:**\n`;
  output += `   [forums.swift.org](https://forums.swift.org/search?q=${encodeURIComponent(feature)})\n\n`;

  output += `## Available Features in Database\n\n`;
  output += `Some features I can check:\n`;
  output += `- \`@Observable\` macro\n`;
  output += `- \`nonisolated(unsafe)\`\n`;
  output += `- Typed throws\n`;
  output += `- Parameter packs\n`;
  output += `- if/switch expressions\n`;
  output += `- Noncopyable types\n`;
  output += `- Actor isolation\n`;
  output += `- Macros\n`;

  return output;
}
