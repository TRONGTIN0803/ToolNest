import {
  Braces,
  Calculator,
  CaseSensitive,
  Clock,
  Code2,
  FileJson,
  Fingerprint,
  Globe,
  Hash,
  KeyRound,
  Link2,
  LockKeyhole,
  Palette,
  Percent,
  Regex,
  Text,
  Timer,
  Type,
} from "lucide-react";

export type ToolCategorySlug =
  | "text-tools"
  | "developer-tools"
  | "color-design"
  | "math-numbers"
  | "time-date"
  | "seo-web";

export interface Category {
  name: string;
  slug: ToolCategorySlug;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
}

export interface ToolFaq {
  q: string;
  a: string;
}

export interface Tool {
  name: string;
  slug: string;
  categorySlug: ToolCategorySlug;
  tagline: string;
  description: string;
  componentKey: string;
  icon: keyof typeof toolIcons;
  priority: 1 | 2 | 3;
  usageCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  features: string[];
  howToUse: string[];
  faq: ToolFaq[];
  relatedTools: string[];
}

export const categories: Category[] = [
  {
    name: "Text tools",
    slug: "text-tools",
    description: "Counters, converters, slugs, and writing helpers.",
    icon: "type",
    color: "#185FA5",
    sortOrder: 1,
  },
  {
    name: "Developer tools",
    slug: "developer-tools",
    description: "JSON, encoding, hashes, regex, tokens, and code utilities.",
    icon: "code",
    color: "#534AB7",
    sortOrder: 2,
  },
  {
    name: "Color & design",
    slug: "color-design",
    description: "Color conversion, contrast, gradients, palettes, and CSS helpers.",
    icon: "palette",
    color: "#993556",
    sortOrder: 3,
  },
  {
    name: "Math & numbers",
    slug: "math-numbers",
    description: "Calculators and converters for everyday numeric tasks.",
    icon: "calculator",
    color: "#854F0B",
    sortOrder: 4,
  },
  {
    name: "Time & date",
    slug: "time-date",
    description: "Timezone, timestamp, age, and date difference tools.",
    icon: "clock",
    color: "#3B6D11",
    sortOrder: 5,
  },
  {
    name: "SEO & web",
    slug: "seo-web",
    description: "Preview metadata, inspect OG cards, and generate safe web assets.",
    icon: "globe",
    color: "#185FA5",
    sortOrder: 6,
  },
];

const defaultFaq: ToolFaq[] = [
  {
    q: "Is my data sent to a server?",
    a: "No. Tool processing is designed to run in your browser, and private input is not stored.",
  },
  {
    q: "Do I need an account?",
    a: "No. ToolNest tools are free to use without signup.",
  },
];

const defaultHowTo = (toolName: string) => [
  `Open the ${toolName} and paste or enter your input.`,
  "Choose the mode or options you need.",
  "Copy, download, or reuse the result directly from your browser.",
];

export const tools: Tool[] = [
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    categorySlug: "developer-tools",
    tagline: "Format, validate and minify JSON instantly.",
    description: "Beautify, validate, and minify JSON for API responses, config files, and structured data.",
    componentKey: "JsonFormatter",
    icon: "json",
    priority: 3,
    usageCount: 24120,
    isFeatured: true,
    features: ["Format JSON", "Minify JSON", "Validate syntax"],
    howToUse: [
      "Paste or type your JSON data into the input box.",
      "Click Format to beautify, Minify to compress, or Validate to check for errors.",
      "Copy the output or download it as a JSON file.",
    ],
    faq: [
      ...defaultFaq,
      { q: "Can I validate API responses?", a: "Yes. Paste the response and the validator will show syntax errors when JSON cannot be parsed." },
    ],
    relatedTools: ["url-encoder", "base64", "hash-generator", "jwt-decoder"],
  },
  {
    name: "Word Counter",
    slug: "word-counter",
    categorySlug: "text-tools",
    tagline: "Count words, characters, sentences and reading time.",
    description: "Check writing length for articles, essays, social posts, and metadata.",
    componentKey: "WordCounter",
    icon: "text",
    priority: 3,
    usageCount: 13500,
    isFeatured: true,
    features: ["Word count", "Character count", "Reading time"],
    howToUse: defaultHowTo("Word Counter"),
    faq: defaultFaq,
    relatedTools: ["character-counter", "case-converter", "slug-generator"],
  },
  {
    name: "Character Counter",
    slug: "character-counter",
    categorySlug: "text-tools",
    tagline: "Count characters with and without spaces.",
    description: "Measure text for bios, titles, descriptions, ads, and short-form copy.",
    componentKey: "CharacterCounter",
    icon: "type",
    priority: 3,
    usageCount: 10200,
    features: ["Total characters", "Characters without spaces", "Line count"],
    howToUse: defaultHowTo("Character Counter"),
    faq: defaultFaq,
    relatedTools: ["word-counter", "case-converter"],
  },
  {
    name: "Case Converter",
    slug: "case-converter",
    categorySlug: "text-tools",
    tagline: "Convert text to upper, lower, title, camel, snake and kebab case.",
    description: "Clean pasted text and create consistent labels, names, and slugs.",
    componentKey: "CaseConverter",
    icon: "case",
    priority: 3,
    usageCount: 12300,
    isFeatured: true,
    features: ["UPPERCASE", "camelCase", "snake_case", "kebab-case"],
    howToUse: defaultHowTo("Case Converter"),
    faq: defaultFaq,
    relatedTools: ["word-counter", "slug-generator"],
  },
  {
    name: "Slug Generator",
    slug: "slug-generator",
    categorySlug: "text-tools",
    tagline: "Convert titles into clean URL slugs.",
    description: "Generate lowercase, hyphen-separated slugs for pages, posts, and files.",
    componentKey: "SlugGenerator",
    icon: "link",
    priority: 3,
    usageCount: 8900,
    features: ["URL safe", "Lowercase", "Separator options"],
    howToUse: defaultHowTo("Slug Generator"),
    faq: defaultFaq,
    relatedTools: ["case-converter", "word-counter"],
  },
  {
    name: "Base64 Encoder/Decoder",
    slug: "base64",
    categorySlug: "developer-tools",
    tagline: "Encode and decode Base64 strings.",
    description: "Convert plain text to Base64 or decode Base64 payloads back to readable text.",
    componentKey: "Base64Tool",
    icon: "lock",
    priority: 3,
    usageCount: 14300,
    isFeatured: true,
    features: ["Encode", "Decode", "Unicode-safe text"],
    howToUse: defaultHowTo("Base64 Encoder/Decoder"),
    faq: defaultFaq,
    relatedTools: ["url-encoder", "json-formatter"],
  },
  {
    name: "URL Encoder/Decoder",
    slug: "url-encoder",
    categorySlug: "developer-tools",
    tagline: "Encode and decode URL components.",
    description: "Prepare query parameters, decode copied URLs, and inspect tracking links.",
    componentKey: "UrlEncoder",
    icon: "link",
    priority: 3,
    usageCount: 12800,
    features: ["Encode URI", "Decode URI", "Query-safe output"],
    howToUse: defaultHowTo("URL Encoder/Decoder"),
    faq: defaultFaq,
    relatedTools: ["base64", "json-formatter"],
  },
  {
    name: "UUID Generator",
    slug: "uuid-generator",
    categorySlug: "developer-tools",
    tagline: "Generate UUID v4 values instantly.",
    description: "Create unique IDs for apps, databases, tests, and fixtures.",
    componentKey: "UuidGenerator",
    icon: "key",
    priority: 3,
    usageCount: 18700,
    isFeatured: true,
    features: ["UUID v4", "Bulk generation", "Copy all"],
    howToUse: defaultHowTo("UUID Generator"),
    faq: defaultFaq,
    relatedTools: ["hash-generator", "json-formatter"],
  },
  {
    name: "Hash Generator",
    slug: "hash-generator",
    categorySlug: "developer-tools",
    tagline: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes.",
    description: "Create hashes for text values using browser crypto APIs where available.",
    componentKey: "HashGenerator",
    icon: "hash",
    priority: 3,
    usageCount: 9400,
    features: ["SHA-256", "SHA-512", "Copy hash"],
    howToUse: defaultHowTo("Hash Generator"),
    faq: defaultFaq,
    relatedTools: ["uuid-generator", "base64"],
  },
  {
    name: "Regex Tester",
    slug: "regex-tester",
    categorySlug: "developer-tools",
    tagline: "Test regular expressions with live match highlighting.",
    description: "Debug patterns against sample text and inspect matches in the browser.",
    componentKey: "RegexTester",
    icon: "regex",
    priority: 3,
    usageCount: 10900,
    isNew: true,
    features: ["Live matches", "Flags", "Match count"],
    howToUse: defaultHowTo("Regex Tester"),
    faq: defaultFaq,
    relatedTools: ["json-formatter", "url-encoder"],
  },
  {
    name: "JWT Decoder",
    slug: "jwt-decoder",
    categorySlug: "developer-tools",
    tagline: "Decode JWT header and payload without verification.",
    description: "Inspect token payloads locally without sending secrets to a server.",
    componentKey: "JwtDecoder",
    icon: "fingerprint",
    priority: 3,
    usageCount: 8100,
    isNew: true,
    features: ["Header", "Payload", "Expiry preview"],
    howToUse: defaultHowTo("JWT Decoder"),
    faq: defaultFaq,
    relatedTools: ["base64", "json-formatter"],
  },
  {
    name: "Color Picker",
    slug: "color-picker",
    categorySlug: "color-design",
    tagline: "Pick colors and convert HEX, RGB and HSL.",
    description: "Explore color values for UI work and CSS handoff.",
    componentKey: "ColorPicker",
    icon: "palette",
    priority: 3,
    usageCount: 14800,
    isFeatured: true,
    features: ["HEX", "RGB", "HSL"],
    howToUse: defaultHowTo("Color Picker"),
    faq: defaultFaq,
    relatedTools: ["color-converter", "contrast-checker"],
  },
  {
    name: "Contrast Checker",
    slug: "contrast-checker",
    categorySlug: "color-design",
    tagline: "Check WCAG contrast between foreground and background colors.",
    description: "Test readability and accessibility for UI color pairs.",
    componentKey: "ContrastChecker",
    icon: "palette",
    priority: 3,
    usageCount: 7600,
    features: ["WCAG ratio", "AA/AAA checks", "Color preview"],
    howToUse: defaultHowTo("Contrast Checker"),
    faq: defaultFaq,
    relatedTools: ["color-picker", "color-converter"],
  },
  {
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    categorySlug: "math-numbers",
    tagline: "Calculate percentages, changes and differences.",
    description: "Solve common percentage calculations for planning and reporting.",
    componentKey: "PercentageCalc",
    icon: "percent",
    priority: 3,
    usageCount: 6900,
    features: ["X percent of Y", "Percent change", "Percent difference"],
    howToUse: defaultHowTo("Percentage Calculator"),
    faq: defaultFaq,
    relatedTools: ["unit-converter", "aspect-ratio"],
  },
  {
    name: "Timezone Converter",
    slug: "timezone-converter",
    categorySlug: "time-date",
    tagline: "Convert time between world timezones.",
    description: "Plan calls, launches, and deadlines across regions.",
    componentKey: "TimezoneConverter",
    icon: "clock",
    priority: 3,
    usageCount: 11500,
    isFeatured: true,
    features: ["World zones", "Local preview", "Copy result"],
    howToUse: defaultHowTo("Timezone Converter"),
    faq: defaultFaq,
    relatedTools: ["timestamp-converter", "date-difference"],
  },
  {
    name: "Timestamp Converter",
    slug: "timestamp-converter",
    categorySlug: "time-date",
    tagline: "Convert Unix timestamps to human-readable dates.",
    description: "Read and create timestamps for logs, APIs, and database values.",
    componentKey: "TimestampConverter",
    icon: "timer",
    priority: 3,
    usageCount: 8400,
    features: ["Unix seconds", "Unix milliseconds", "Local date"],
    howToUse: defaultHowTo("Timestamp Converter"),
    faq: defaultFaq,
    relatedTools: ["timezone-converter", "date-difference"],
  },
  {
    name: "Age Calculator",
    slug: "age-calculator",
    categorySlug: "time-date",
    tagline: "Calculate exact age from a birth date.",
    description: "Find age in years, months and days for any comparison date.",
    componentKey: "AgeCalculator",
    icon: "calculator",
    priority: 3,
    usageCount: 7200,
    features: ["Years", "Months", "Days"],
    howToUse: defaultHowTo("Age Calculator"),
    faq: defaultFaq,
    relatedTools: ["date-difference", "timestamp-converter"],
  },
  {
    name: "Meta Tag Preview",
    slug: "meta-tag-preview",
    categorySlug: "seo-web",
    tagline: "Preview Google, Facebook and Twitter metadata.",
    description: "Check titles, descriptions and social sharing cards before publishing.",
    componentKey: "MetaTagPreview",
    icon: "globe",
    priority: 3,
    usageCount: 9700,
    isNew: true,
    isFeatured: true,
    features: ["Google preview", "Open Graph", "Twitter card"],
    howToUse: defaultHowTo("Meta Tag Preview"),
    faq: defaultFaq,
    relatedTools: ["og-checker", "slug-generator"],
  },
  {
    name: "Password Generator",
    slug: "password-generator",
    categorySlug: "seo-web",
    tagline: "Generate strong random passwords with options.",
    description: "Create browser-side passwords with length and character controls.",
    componentKey: "PasswordGenerator",
    icon: "password",
    priority: 3,
    usageCount: 16200,
    isFeatured: true,
    features: ["Length control", "Symbols", "Numbers", "Copy"],
    howToUse: defaultHowTo("Password Generator"),
    faq: defaultFaq,
    relatedTools: ["hash-generator", "uuid-generator"],
  },
];

export const plannedTools: Array<Pick<Tool, "name" | "slug" | "categorySlug" | "tagline" | "componentKey" | "icon" | "priority">> = [
  { name: "Lorem Ipsum Generator", slug: "lorem-ipsum", categorySlug: "text-tools", tagline: "Generate placeholder text.", componentKey: "LoremIpsum", icon: "text", priority: 3 },
  { name: "Text Diff Checker", slug: "text-diff", categorySlug: "text-tools", tagline: "Compare two texts.", componentKey: "TextDiff", icon: "text", priority: 2 },
  { name: "Duplicate Line Remover", slug: "remove-duplicate-lines", categorySlug: "text-tools", tagline: "Remove duplicate lines.", componentKey: "DuplicateLineRemover", icon: "text", priority: 2 },
  { name: "HTML Encoder/Decoder", slug: "html-encoder", categorySlug: "developer-tools", tagline: "Encode and decode HTML entities.", componentKey: "HtmlEncoder", icon: "code", priority: 2 },
  { name: "Gradient Generator", slug: "gradient-generator", categorySlug: "color-design", tagline: "Build CSS gradients visually.", componentKey: "GradientGenerator", icon: "palette", priority: 3 },
  { name: "Unit Converter", slug: "unit-converter", categorySlug: "math-numbers", tagline: "Convert common units.", componentKey: "UnitConverter", icon: "calculator", priority: 3 },
  { name: "Aspect Ratio Calculator", slug: "aspect-ratio", categorySlug: "math-numbers", tagline: "Scale dimensions by aspect ratio.", componentKey: "AspectRatio", icon: "calculator", priority: 3 },
  { name: "Date Difference Calculator", slug: "date-difference", categorySlug: "time-date", tagline: "Count days between dates.", componentKey: "DateDifference", icon: "clock", priority: 3 },
];

export const toolIcons = {
  calculator: Calculator,
  case: CaseSensitive,
  clock: Clock,
  code: Code2,
  fingerprint: Fingerprint,
  globe: Globe,
  hash: Hash,
  json: FileJson,
  key: KeyRound,
  link: Link2,
  lock: LockKeyhole,
  palette: Palette,
  password: KeyRound,
  percent: Percent,
  regex: Regex,
  text: Text,
  timer: Timer,
  type: Type,
  braces: Braces,
};

export function getCategory(slug: ToolCategorySlug) {
  return categories.find((category) => category.slug === slug);
}

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getRelatedTools(tool: Tool) {
  return tool.relatedTools.map(getTool).filter(Boolean) as Tool[];
}

export function getToolsByCategory(slug: ToolCategorySlug) {
  return tools.filter((tool) => tool.categorySlug === slug);
}

export function getCategoryCount(slug: ToolCategorySlug) {
  return getToolsByCategory(slug).length;
}
