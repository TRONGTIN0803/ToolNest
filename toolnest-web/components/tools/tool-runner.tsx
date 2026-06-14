"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clipboard, Copy, Download, Trash2, XCircle } from "lucide-react";
import { Tool } from "@/lib/tools";

type StatusTone = "ok" | "error" | "neutral";

type ActionMode<T extends string> = {
  label: string;
  value: T;
};

const sampleJson = '{"name":"ToolNest","version":2,"tools":["json","base64","uuid"],"free":true}';
const sampleText = "ToolNest helps developers format JSON, generate UUIDs, encode URLs, and clean text quickly.";

export function ToolRunner({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    case "json-formatter":
      return <JsonFormatter />;
    case "base64":
      return <TextTransformTool title="Base64 Encoder/Decoder" sample="ToolNest browser tools" modes={base64Modes} transform={transformBase64} />;
    case "url-encoder":
      return <TextTransformTool title="URL Encoder/Decoder" sample="https://toolnest.dev/search?q=json formatter&ref=tools" modes={urlModes} transform={transformUrl} />;
    case "uuid-generator":
      return <UuidGenerator />;
    case "hash-generator":
      return <HashGenerator />;
    case "regex-tester":
      return <RegexTester />;
    case "jwt-decoder":
      return <JwtDecoder />;
    case "word-counter":
      return <TextMetricsTool kind="word" />;
    case "character-counter":
      return <TextMetricsTool kind="character" />;
    case "case-converter":
      return <CaseConverter />;
    case "slug-generator":
      return <SlugGenerator />;
    case "color-picker":
      return <ColorPickerTool />;
    case "contrast-checker":
      return <ContrastChecker />;
    case "percentage-calculator":
      return <PercentageCalculator />;
    case "timezone-converter":
      return <TimezoneConverter />;
    case "timestamp-converter":
      return <TimestampConverter />;
    case "age-calculator":
      return <AgeCalculator />;
    case "meta-tag-preview":
      return <MetaTagPreview />;
    case "password-generator":
      return <PasswordGenerator />;
    default:
      return <GenericTool tool={tool} />;
  }
}

function JsonFormatter() {
  const [input, setInput] = useState(sampleJson);
  const [mode, setMode] = useState<"format" | "minify" | "validate">("format");

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return {
        ok: true,
        text: mode === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2),
        meta: `Valid JSON, ${Array.isArray(parsed) ? parsed.length : Object.keys(parsed ?? {}).length} top-level ${Array.isArray(parsed) ? "items" : "keys"}, ${byteSize(input)} bytes`,
      };
    } catch (error) {
      return {
        ok: false,
        text: "Fix the JSON syntax to see formatted output.",
        meta: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }, [input, mode]);

  return (
    <TextWorkbench
      input={input}
      onInputChange={setInput}
      output={result.text}
      status={result.meta}
      tone={result.ok ? "ok" : "error"}
      inputLanguage="json"
      modes={[
        { label: "Format", value: "format" },
        { label: "Minify", value: "minify" },
        { label: "Validate", value: "validate" },
      ]}
      activeMode={mode}
      onModeChange={setMode}
      downloadName="toolnest-formatted.json"
    />
  );
}

const base64Modes: ActionMode<"encode" | "decode">[] = [
  { label: "Encode", value: "encode" },
  { label: "Decode", value: "decode" },
];

function transformBase64(input: string, mode: "encode" | "decode") {
  if (!input.trim()) return { ok: true, text: "", meta: "Enter text to encode or decode." };

  try {
    if (mode === "encode") {
      return { ok: true, text: toBase64(input), meta: `Encoded ${input.length} characters to Base64.` };
    }

    return { ok: true, text: fromBase64(input), meta: "Decoded Base64 successfully." };
  } catch {
    return { ok: false, text: "", meta: "Invalid Base64 input." };
  }
}

const urlModes: ActionMode<"encode" | "decode">[] = [
  { label: "Encode", value: "encode" },
  { label: "Decode", value: "decode" },
];

function transformUrl(input: string, mode: "encode" | "decode") {
  if (!input.trim()) return { ok: true, text: "", meta: "Enter a URL or query value." };

  try {
    const text = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    return { ok: true, text, meta: mode === "encode" ? "URL component encoded." : "URL component decoded." };
  } catch {
    return { ok: false, text: "", meta: "This value cannot be decoded as a URL component." };
  }
}

function TextTransformTool<T extends string>({
  title,
  sample,
  modes,
  transform,
}: {
  title: string;
  sample: string;
  modes: ActionMode<T>[];
  transform: (input: string, mode: T) => { ok: boolean; text: string; meta: string };
}) {
  const [input, setInput] = useState(sample);
  const [mode, setMode] = useState<T>(modes[0].value);
  const result = useMemo(() => transform(input, mode), [input, mode, transform]);

  return (
    <TextWorkbench
      title={title}
      input={input}
      onInputChange={setInput}
      output={result.text}
      status={result.meta}
      tone={result.ok ? "ok" : "error"}
      modes={modes}
      activeMode={mode}
      onModeChange={setMode}
      downloadName={`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`}
    />
  );
}

function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => createUuids(5));

  function regenerate(nextCount = count) {
    setUuids(createUuids(nextCount));
  }

  const output = uuids.join("\n");

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          Count
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) => {
              const nextCount = clamp(Number(event.target.value), 1, 100);
              setCount(nextCount);
              regenerate(nextCount);
            }}
            className="tn-focus w-20 rounded-md border border-[var(--border-tertiary)] bg-white px-2 py-1.5 text-sm"
          />
        </label>
        <button onClick={() => regenerate()} className="tn-focus rounded-md border border-[var(--border-secondary)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
          Generate
        </button>
      </div>
      <OutputPanel output={output} status={`Generated ${uuids.length} UUID v4 values.`} tone="ok" downloadName="toolnest-uuids.txt" />
    </div>
  );
}

function HashGenerator() {
  const [input, setInput] = useState(sampleText);
  const [algorithm, setAlgorithm] = useState<"SHA-1" | "SHA-256" | "SHA-384" | "SHA-512">("SHA-256");
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("Hash will update as you type.");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!input) {
        setHash("");
        setStatus("Enter text to generate a hash.");
        return;
      }

      try {
        const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input));
        if (cancelled) return;
        setHash([...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join(""));
        setStatus(`${algorithm} hash generated for ${input.length} characters.`);
      } catch {
        if (!cancelled) {
          setHash("");
          setStatus("This browser does not support Web Crypto hashing here.");
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [algorithm, input]);

  return (
    <TextWorkbench
      input={input}
      onInputChange={setInput}
      output={hash}
      status={status}
      tone={hash ? "ok" : "neutral"}
      modes={[
        { label: "SHA-1", value: "SHA-1" },
        { label: "SHA-256", value: "SHA-256" },
        { label: "SHA-384", value: "SHA-384" },
        { label: "SHA-512", value: "SHA-512" },
      ]}
      activeMode={algorithm}
      onModeChange={setAlgorithm}
      downloadName="toolnest-hash.txt"
    />
  );
}

function RegexTester() {
  const [pattern, setPattern] = useState("\\btool\\w*\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("ToolNest includes JSON tools, text tools, and developer utilities.");

  const result = useMemo(() => {
    try {
      const effectiveFlags = flags.includes("g") ? flags : `${flags}g`;
      const regex = new RegExp(pattern, effectiveFlags);
      const matches = [...text.matchAll(regex)];
      return {
        ok: true,
        output: matches.map((match, index) => `${index + 1}. "${match[0]}" at index ${match.index}`).join("\n") || "No matches found.",
        meta: `${matches.length} match${matches.length === 1 ? "" : "es"} found.`,
      };
    } catch (error) {
      return {
        ok: false,
        output: "",
        meta: error instanceof Error ? error.message : "Invalid regular expression.",
      };
    }
  }, [flags, pattern, text]);

  return (
    <div>
      <div className="mb-3 grid gap-3 sm:grid-cols-[1fr_120px]">
        <label className="grid gap-1 text-xs font-medium text-[var(--text-secondary)]">
          Pattern
          <input value={pattern} onChange={(event) => setPattern(event.target.value)} className="tn-focus rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 font-mono text-sm" />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[var(--text-secondary)]">
          Flags
          <input value={flags} onChange={(event) => setFlags(cleanRegexFlags(event.target.value))} className="tn-focus rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 font-mono text-sm" />
        </label>
      </div>
      <TextWorkbench
        input={text}
        onInputChange={setText}
        output={result.output}
        status={result.meta}
        tone={result.ok ? "ok" : "error"}
        downloadName="toolnest-regex-matches.txt"
      />
    </div>
  );
}

function JwtDecoder() {
  const [input, setInput] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b29sbmVzdC11c2VyIiwibmFtZSI6IlRvb2xOZXN0IERlbW8iLCJpYXQiOjE3MTgyMDAwMDB9.signature");

  const result = useMemo(() => {
    const parts = input.trim().split(".");
    if (parts.length < 2) {
      return { ok: false, text: "", meta: "JWT must include at least header and payload sections." };
    }

    try {
      const header = JSON.parse(fromBase64Url(parts[0]));
      const payload = JSON.parse(fromBase64Url(parts[1]));
      return {
        ok: true,
        text: JSON.stringify({ header, payload }, null, 2),
        meta: "Decoded header and payload. Signature is not verified.",
      };
    } catch {
      return { ok: false, text: "", meta: "JWT header or payload is not valid Base64URL JSON." };
    }
  }, [input]);

  return (
    <TextWorkbench
      input={input}
      onInputChange={setInput}
      output={result.text}
      status={result.meta}
      tone={result.ok ? "ok" : "error"}
      inputLanguage="jwt"
      downloadName="toolnest-jwt-decoded.json"
    />
  );
}

function TextMetricsTool({ kind }: { kind: "word" | "character" }) {
  const [input, setInput] = useState(sampleText);
  const metrics = useMemo(() => getTextMetrics(input), [input]);
  const output = [
    `Words: ${metrics.words}`,
    `Characters: ${metrics.characters}`,
    `Characters without spaces: ${metrics.charactersNoSpaces}`,
    `Sentences: ${metrics.sentences}`,
    `Lines: ${metrics.lines}`,
    `Reading time: ${metrics.readingTime} min`,
    `Average word length: ${metrics.averageWordLength}`,
  ].join("\n");

  return (
    <TextWorkbench
      input={input}
      onInputChange={setInput}
      output={output}
      status={kind === "word" ? `${metrics.words} words, ${metrics.readingTime} min read.` : `${metrics.characters} characters, ${metrics.charactersNoSpaces} without spaces.`}
      tone="ok"
      downloadName={`toolnest-${kind}-count.txt`}
    />
  );
}

function CaseConverter() {
  const [input, setInput] = useState("ToolNest browser tools are fast");
  const [mode, setMode] = useState<"upper" | "lower" | "title" | "sentence" | "camel" | "snake" | "kebab">("title");
  const output = useMemo(() => convertCase(input, mode), [input, mode]);

  return (
    <TextWorkbench
      input={input}
      onInputChange={setInput}
      output={output}
      status={`Converted to ${mode} case.`}
      tone="ok"
      modes={[
        { label: "UPPER", value: "upper" },
        { label: "lower", value: "lower" },
        { label: "Title", value: "title" },
        { label: "Sentence", value: "sentence" },
        { label: "camel", value: "camel" },
        { label: "snake", value: "snake" },
        { label: "kebab", value: "kebab" },
      ]}
      activeMode={mode}
      onModeChange={setMode}
      downloadName="toolnest-case-converted.txt"
    />
  );
}

function SlugGenerator() {
  const [input, setInput] = useState("Free Online JSON Formatter for Developers");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const slug = useMemo(() => toSlug(input, separator), [input, separator]);

  return (
    <TextWorkbench
      input={input}
      onInputChange={setInput}
      output={slug}
      status={slug ? `Generated ${slug.length} character slug.` : "Enter a title to generate a slug."}
      tone={slug ? "ok" : "neutral"}
      modes={[
        { label: "Hyphen", value: "-" },
        { label: "Underscore", value: "_" },
      ]}
      activeMode={separator}
      onModeChange={setSeparator}
      downloadName="toolnest-slug.txt"
    />
  );
}

function ColorPickerTool() {
  const [color, setColor] = useState("#185fa5");
  const [drafts, setDrafts] = useState({ hex: "#185FA5", rgb: "rgb(24, 95, 165)", hsl: "hsl(208, 75%, 37%)" });
  const rgb = useMemo(() => hexToRgb(color), [color]);
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null), [rgb]);
  const output = rgb && hsl ? [`HEX: ${formatHex(color)}`, `RGB: ${formatRgb(rgb)}`, `HSL: ${formatHsl(hsl)}`].join("\n") : "";

  useEffect(() => {
    if (!rgb || !hsl) return;
    setDrafts({
      hex: formatHex(color),
      rgb: formatRgb(rgb),
      hsl: formatHsl(hsl),
    });
  }, [color, hsl, rgb]);

  function updateColor(nextColor: string) {
    setColor(formatHex(nextColor).toLowerCase());
  }

  function updateFromHex(value: string) {
    setDrafts((current) => ({ ...current, hex: value }));
    const parsed = parseHexColor(value);
    if (parsed) updateColor(parsed);
  }

  function updateFromRgb(value: string) {
    setDrafts((current) => ({ ...current, rgb: value }));
    const parsed = parseRgbColor(value);
    if (parsed) updateColor(rgbToHex(parsed.r, parsed.g, parsed.b));
  }

  function updateFromHsl(value: string) {
    setDrafts((current) => ({ ...current, hsl: value }));
    const parsed = parseHslColor(value);
    if (parsed) {
      const nextRgb = hslToRgb(parsed.h, parsed.s, parsed.l);
      updateColor(rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b));
    }
  }

  return (
    <div>
      <section className="tn-card overflow-hidden p-4">
        <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
          <input aria-label="Pick color" type="color" value={color} onChange={(event) => updateColor(event.target.value)} className="h-32 w-full cursor-pointer rounded-md border border-[var(--border-tertiary)] bg-white p-2" />
          <div className="rounded-md border border-[var(--border-tertiary)] p-4" style={{ backgroundColor: color }}>
            <div className="rounded-md bg-white/90 p-3 text-sm font-semibold text-[#0f172a]">{formatHex(color)}</div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <TextInput label="HEX" value={drafts.hex} onChange={updateFromHex} />
          <TextInput label="RGB" value={drafts.rgb} onChange={updateFromRgb} />
          <TextInput label="HSL" value={drafts.hsl} onChange={updateFromHsl} />
        </div>
      </section>
      <OutputPanel output={output} status="Color values converted for CSS use." tone="ok" downloadName="toolnest-color.txt" />
    </div>
  );
}

function ContrastChecker() {
  const [foreground, setForeground] = useState("#0f172a");
  const [background, setBackground] = useState("#ffffff");
  const result = useMemo(() => getContrastResult(foreground, background), [foreground, background]);
  const output = [
    `Contrast ratio: ${result.ratio}:1`,
    `Normal text AA: ${result.ratio >= 4.5 ? "Pass" : "Fail"}`,
    `Normal text AAA: ${result.ratio >= 7 ? "Pass" : "Fail"}`,
    `Large text AA: ${result.ratio >= 3 ? "Pass" : "Fail"}`,
    `Large text AAA: ${result.ratio >= 4.5 ? "Pass" : "Fail"}`,
  ].join("\n");

  return (
    <div>
      <section className="tn-card overflow-hidden p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorInput label="Text" value={foreground} onChange={setForeground} />
          <ColorInput label="Background" value={background} onChange={setBackground} />
        </div>
        <div className="mt-4 rounded-md border border-[var(--border-tertiary)] p-5 text-lg font-semibold" style={{ color: foreground, backgroundColor: background }}>
          Preview text for readability
        </div>
      </section>
      <OutputPanel output={output} status={`${result.ratio}:1 contrast ratio calculated.`} tone={result.ratio >= 4.5 ? "ok" : "error"} downloadName="toolnest-contrast.txt" />
    </div>
  );
}

function PercentageCalculator() {
  const [mode, setMode] = useState<"of" | "change" | "difference">("of");
  const [a, setA] = useState(15);
  const [b, setB] = useState(200);
  const result = useMemo(() => {
    if (mode === "of") return `${a}% of ${b} = ${formatNumber((a / 100) * b)}`;
    if (mode === "change") return `Change from ${a} to ${b} = ${formatNumber(((b - a) / a) * 100)}%`;
    return `Percent difference between ${a} and ${b} = ${formatNumber((Math.abs(a - b) / ((a + b) / 2)) * 100)}%`;
  }, [a, b, mode]);

  return (
    <div>
      <ModeButtons modes={[{ label: "% of", value: "of" }, { label: "Change", value: "change" }, { label: "Difference", value: "difference" }]} activeMode={mode} onModeChange={setMode} />
      <section className="tn-card grid gap-3 p-4 sm:grid-cols-2">
        <NumberInput label={mode === "of" ? "Percent" : "First value"} value={a} onChange={setA} />
        <NumberInput label={mode === "of" ? "Total value" : "Second value"} value={b} onChange={setB} />
      </section>
      <OutputPanel output={result} status="Percentage calculated." tone="ok" downloadName="toolnest-percentage.txt" />
    </div>
  );
}

function TimezoneConverter() {
  const localDateTime = toDateTimeLocalValue(new Date());
  const [dateTime, setDateTime] = useState(localDateTime);
  const [fromZone, setFromZone] = useState("UTC");
  const [toZone, setToZone] = useState("Asia/Ho_Chi_Minh");
  const result = useMemo(() => {
    const sourceDate = zonedDateTimeToDate(dateTime, fromZone);
    return [
      `From: ${formatInTimeZone(sourceDate, fromZone)}`,
      `To: ${formatInTimeZone(sourceDate, toZone)}`,
      `UTC: ${sourceDate.toISOString()}`,
    ].join("\n");
  }, [dateTime, fromZone, toZone]);

  return (
    <div>
      <section className="tn-card grid gap-3 p-4 sm:grid-cols-3">
        <label className="grid gap-1 text-xs font-medium text-[var(--text-secondary)]">
          Date and time
          <input type="datetime-local" value={dateTime} onChange={(event) => setDateTime(event.target.value)} className="tn-focus rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 text-sm" />
        </label>
        <SelectInput label="From zone" value={fromZone} onChange={setFromZone} options={timeZones} />
        <SelectInput label="To zone" value={toZone} onChange={setToZone} options={timeZones} />
      </section>
      <OutputPanel output={result} status="Timezone conversion complete." tone="ok" downloadName="toolnest-timezone.txt" />
    </div>
  );
}

function TimestampConverter() {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const [timestamp, setTimestamp] = useState(nowSeconds);
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");
  const date = useMemo(() => new Date(unit === "seconds" ? timestamp * 1000 : timestamp), [timestamp, unit]);
  const output = Number.isNaN(date.getTime())
    ? "Invalid timestamp."
    : [`Local: ${date.toLocaleString()}`, `UTC: ${date.toISOString()}`, `Unix seconds: ${Math.floor(date.getTime() / 1000)}`, `Unix milliseconds: ${date.getTime()}`].join("\n");

  return (
    <div>
      <ModeButtons modes={[{ label: "Seconds", value: "seconds" }, { label: "Milliseconds", value: "milliseconds" }]} activeMode={unit} onModeChange={setUnit} />
      <section className="tn-card p-4">
        <NumberInput label="Timestamp" value={timestamp} onChange={setTimestamp} />
      </section>
      <OutputPanel output={output} status={Number.isNaN(date.getTime()) ? "Enter a valid timestamp." : "Timestamp converted."} tone={Number.isNaN(date.getTime()) ? "error" : "ok"} downloadName="toolnest-timestamp.txt" />
    </div>
  );
}

function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("1995-01-01");
  const [compareDate, setCompareDate] = useState(() => new Date().toISOString().slice(0, 10));
  const age = useMemo(() => getAgeParts(birthDate, compareDate), [birthDate, compareDate]);
  const output = age.ok ? [`Years: ${age.years}`, `Months: ${age.months}`, `Days: ${age.days}`, `Total days: ${age.totalDays}`].join("\n") : "Birth date must be before comparison date.";

  return (
    <div>
      <section className="tn-card grid gap-3 p-4 sm:grid-cols-2">
        <DateInput label="Birth date" value={birthDate} onChange={setBirthDate} />
        <DateInput label="Compare date" value={compareDate} onChange={setCompareDate} />
      </section>
      <OutputPanel output={output} status={age.ok ? "Age calculated." : "Check the date order."} tone={age.ok ? "ok" : "error"} downloadName="toolnest-age.txt" />
    </div>
  );
}

function MetaTagPreview() {
  const [title, setTitle] = useState("ToolNest - Free online tools");
  const [description, setDescription] = useState("Fast browser-side tools for JSON, Base64, UUID, Regex, text, colors and dates.");
  const [url, setUrl] = useState("https://toolnest.dev/tools/json-formatter/");
  const output = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${url}">`,
  ].join("\n");

  return (
    <div>
      <section className="tn-card grid gap-3 p-4">
        <TextInput label="Title" value={title} onChange={setTitle} maxLength={70} />
        <TextInput label="Description" value={description} onChange={setDescription} maxLength={180} />
        <TextInput label="URL" value={url} onChange={setUrl} />
        <div className="rounded-md border border-[var(--border-tertiary)] bg-white p-4">
          <p className="truncate text-lg text-[#1a0dab]">{title}</p>
          <p className="truncate text-sm text-[#006621]">{url}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#545454]">{description}</p>
        </div>
      </section>
      <OutputPanel output={output} status={`Title ${title.length}/60, description ${description.length}/160.`} tone={title.length <= 60 && description.length <= 160 ? "ok" : "neutral"} downloadName="toolnest-meta-tags.html" />
    </div>
  );
}

function PasswordGenerator() {
  const [length, setLength] = useState(18);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState(() => generatePassword(18, true, true, true, true));
  const charsetReady = useUpper || useLower || useNumbers || useSymbols;

  function regenerate() {
    if (!charsetReady) {
      setPassword("");
      return;
    }
    setPassword(generatePassword(length, useUpper, useLower, useNumbers, useSymbols));
  }

  useEffect(() => {
    regenerate();
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  return (
    <div>
      <section className="tn-card grid gap-4 p-4">
        <label className="grid gap-2 text-xs font-medium text-[var(--text-secondary)]">
          Length: {length}
          <input type="range" min={8} max={64} value={length} onChange={(event) => setLength(Number(event.target.value))} />
        </label>
        <div className="grid gap-2 sm:grid-cols-4">
          <CheckboxInput label="Uppercase" checked={useUpper} onChange={setUseUpper} />
          <CheckboxInput label="Lowercase" checked={useLower} onChange={setUseLower} />
          <CheckboxInput label="Numbers" checked={useNumbers} onChange={setUseNumbers} />
          <CheckboxInput label="Symbols" checked={useSymbols} onChange={setUseSymbols} />
        </div>
        <button onClick={regenerate} className="tn-focus w-fit rounded-md border border-[var(--border-secondary)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
          Generate
        </button>
      </section>
      <OutputPanel output={password} status={charsetReady ? `Generated ${length} character password.` : "Choose at least one character set."} tone={charsetReady ? "ok" : "error"} downloadName="toolnest-password.txt" />
    </div>
  );
}

function TextWorkbench<T extends string>({
  title,
  input,
  onInputChange,
  output,
  status,
  tone,
  modes,
  activeMode,
  onModeChange,
  inputLanguage,
  downloadName,
}: {
  title?: string;
  input: string;
  onInputChange: (value: string) => void;
  output: string;
  status: string;
  tone: StatusTone;
  modes?: ActionMode<T>[];
  activeMode?: T;
  onModeChange?: (mode: T) => void;
  inputLanguage?: string;
  downloadName: string;
}) {
  return (
    <div>
      {title ? <h2 className="mb-3 text-sm font-semibold">{title}</h2> : null}
      {modes?.length ? (
        <ModeButtons modes={modes} activeMode={activeMode ?? modes[0].value} onModeChange={onModeChange ?? (() => undefined)} />
      ) : null}
      <InputPanel input={input} onInputChange={onInputChange} language={inputLanguage} />
      <OutputPanel output={output} status={status} tone={tone} downloadName={downloadName} />
    </div>
  );
}

function ModeButtons<T extends string>({ modes, activeMode, onModeChange }: { modes: ActionMode<T>[]; activeMode: T; onModeChange: (mode: T) => void }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {modes.map((item) => (
        <button
          key={item.value}
          onClick={() => onModeChange(item.value)}
          className={`tn-focus rounded-md border px-3 py-1.5 text-xs font-medium ${
            activeMode === item.value
              ? "border-[#b5d4f4] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border-[var(--border-secondary)] bg-white text-[var(--text-secondary)]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function InputPanel({ input, onInputChange, language }: { input: string; onInputChange: (value: string) => void; language?: string }) {
  return (
    <section className="tn-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border-tertiary)] px-3 py-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Clipboard size={15} strokeWidth={1.8} />
          Input
        </h2>
        <button onClick={() => onInputChange("")} className="flex items-center gap-1 rounded-md border border-[var(--border-tertiary)] px-2 py-1 text-xs text-[var(--text-secondary)]">
          <Trash2 size={13} strokeWidth={1.8} />
          Clear
        </button>
      </div>
      <textarea
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
        spellCheck={false}
        aria-label={language ? `${language} input` : "Tool input"}
        className="tn-focus min-h-44 w-full resize-y bg-[var(--background-secondary)] p-4 font-mono text-sm leading-6"
      />
    </section>
  );
}

function TextInput({ label, value, onChange, maxLength }: { label: string; value: string; onChange: (value: string) => void; maxLength?: number }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-[var(--text-secondary)]">
      <span className="flex items-center justify-between">
        {label}
        {maxLength ? <span className="font-normal text-[var(--text-tertiary)]">{value.length}/{maxLength}</span> : null}
      </span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="tn-focus rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 text-sm" />
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-[var(--text-secondary)]">
      {label}
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="tn-focus rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 text-sm" />
    </label>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-[var(--text-secondary)]">
      {label}
      <input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="tn-focus rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 text-sm" />
    </label>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-[var(--text-secondary)]">
      {label}
      <div className="flex gap-2">
        <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-14 rounded-md border border-[var(--border-tertiary)] bg-white p-1" />
        <input value={value} onChange={(event) => onChange(normalizeHexInput(event.target.value))} className="tn-focus min-w-0 flex-1 rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 font-mono text-sm" />
      </div>
    </label>
  );
}

function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-[var(--text-secondary)]">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="tn-focus rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 text-sm">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function CheckboxInput({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 text-sm text-[var(--text-secondary)]">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function OutputPanel({ output, status, tone, downloadName }: { output: string; status: string; tone: StatusTone; downloadName: string }) {
  const [copied, setCopied] = useState(false);
  const toneClass =
    tone === "ok"
      ? "border-[#c0dd97] bg-[#eaf3de] text-[#27500a]"
      : tone === "error"
        ? "border-[#f0c1c1] bg-[#fff0f0] text-[#8f1d1d]"
        : "border-[var(--border-tertiary)] bg-[var(--background-secondary)] text-[var(--text-secondary)]";
  const StatusIcon = tone === "error" ? XCircle : Check;

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function downloadOutput() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="tn-card mt-4 overflow-hidden">
      <div className={`flex items-center gap-2 border-b px-3 py-2 text-xs ${toneClass}`}>
        <StatusIcon size={15} strokeWidth={1.8} />
        {status}
      </div>
      <div className="flex items-center justify-between border-b border-[var(--border-tertiary)] px-3 py-2">
        <h2 className="text-sm font-semibold">Output</h2>
        <div className="flex gap-2">
          <button onClick={copyOutput} disabled={!output} className="flex items-center gap-1 rounded-md border border-[var(--border-tertiary)] px-2 py-1 text-xs text-[var(--text-secondary)] disabled:cursor-not-allowed disabled:opacity-50">
            <Copy size={13} strokeWidth={1.8} />
            {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={downloadOutput} disabled={!output} className="flex items-center gap-1 rounded-md border border-[var(--border-tertiary)] px-2 py-1 text-xs text-[var(--text-secondary)] disabled:cursor-not-allowed disabled:opacity-50">
            <Download size={13} strokeWidth={1.8} />
            Download
          </button>
        </div>
      </div>
      <pre className="min-h-44 whitespace-pre-wrap break-words overflow-auto bg-[var(--background-secondary)] p-4 font-mono text-sm leading-6 text-[var(--text-secondary)]">
        {output || "Output will appear here."}
      </pre>
    </section>
  );
}

function GenericTool({ tool }: { tool: Tool }) {
  return (
    <div className="tn-card p-4">
      <h2 className="text-sm font-semibold">Tool component placeholder</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {tool.componentKey} is registered for this page. The implementation will be added in the next tool build pass.
      </p>
      <div className="mt-4 rounded-md border border-dashed border-[var(--border-secondary)] bg-[var(--background-secondary)] p-6 text-sm text-[var(--text-tertiary)]">
        Client-side logic only. No private input is sent to the API.
      </div>
    </div>
  );
}

function toBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary);
}

function fromBase64(value: string) {
  const binary = atob(value.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return fromBase64(padded);
}

function createUuids(count: number) {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function byteSize(value: string) {
  return new Blob([value]).size;
}

function cleanRegexFlags(value: string) {
  return Array.from(new Set(value.replace(/[^dgimsuvy]/g, "").split(""))).join("");
}

function getTextMetrics(input: string) {
  const words = input.trim().match(/\b[\p{L}\p{N}'-]+\b/gu) ?? [];
  const sentences = input.trim() ? input.split(/[.!?]+/).filter((part) => part.trim()).length : 0;
  const lines = input ? input.split(/\r\n|\r|\n/).length : 0;
  const averageWordLength = words.length ? (words.join("").length / words.length).toFixed(1) : "0";

  return {
    words: words.length,
    characters: input.length,
    charactersNoSpaces: input.replace(/\s/g, "").length,
    sentences,
    lines,
    readingTime: Math.max(1, Math.ceil(words.length / 225)),
    averageWordLength,
  };
}

function convertCase(input: string, mode: "upper" | "lower" | "title" | "sentence" | "camel" | "snake" | "kebab") {
  const words = input.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

  switch (mode) {
    case "upper":
      return input.toUpperCase();
    case "lower":
      return input.toLowerCase();
    case "title":
      return words.map(capitalize).join(" ");
    case "sentence":
      return capitalize(input.toLowerCase().trim());
    case "camel":
      return words.map((word, index) => (index === 0 ? word : capitalize(word))).join("");
    case "snake":
      return words.join("_");
    case "kebab":
      return words.join("-");
  }
}

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function toSlug(input: string, separator: "-" | "_") {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`${escapeRegExp(separator)}+`, "g"), separator)
    .replace(new RegExp(`^${escapeRegExp(separator)}|${escapeRegExp(separator)}$`, "g"), "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeHexInput(value: string) {
  const normalized = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(normalized)) return normalized;
  if (/^[0-9a-fA-F]{6}$/.test(normalized)) return `#${normalized}`;
  return "#000000";
}

function parseHexColor(value: string) {
  const normalized = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(normalized)) return normalized;
  if (/^[0-9a-fA-F]{6}$/.test(normalized)) return `#${normalized}`;
  if (/^#[0-9a-fA-F]{3}$/.test(normalized)) return expandShortHex(normalized);
  if (/^[0-9a-fA-F]{3}$/.test(normalized)) return expandShortHex(`#${normalized}`);
  return null;
}

function expandShortHex(value: string) {
  return `#${value
    .slice(1)
    .split("")
    .map((char) => `${char}${char}`)
    .join("")}`;
}

function formatHex(value: string) {
  return (parseHexColor(value) ?? "#000000").toUpperCase();
}

function hexToRgb(hex: string) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return null;
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function formatRgb(rgb: { r: number; g: number; b: number }) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function parseRgbColor(value: string) {
  const numbers = value.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (numbers.length < 3) return null;
  const [r, g, b] = numbers;
  if ([r, g, b].some((channel) => !Number.isFinite(channel) || channel < 0 || channel > 255)) return null;
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === red) h = (green - blue) / delta + (green < blue ? 6 : 0);
    if (max === green) h = (blue - red) / delta + 2;
    if (max === blue) h = (red - green) / delta + 4;
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number) {
  const hue = (((h % 360) + 360) % 360) / 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;

  if (saturation === 0) {
    const channel = Math.round(lightness * 255);
    return { r: channel, g: channel, b: channel };
  }

  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  const toRgbChannel = (offset: number) => {
    let t = hue + offset;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  return {
    r: Math.round(toRgbChannel(1 / 3) * 255),
    g: Math.round(toRgbChannel(0) * 255),
    b: Math.round(toRgbChannel(-1 / 3) * 255),
  };
}

function formatHsl(hsl: { h: number; s: number; l: number }) {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function parseHslColor(value: string) {
  const numbers = value.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (numbers.length < 3) return null;
  const [h, s, l] = numbers;
  if (!Number.isFinite(h) || !Number.isFinite(s) || !Number.isFinite(l) || s < 0 || s > 100 || l < 0 || l > 100) return null;
  return { h, s, l };
}

function getContrastResult(foreground: string, background: string) {
  const fg = hexToRgb(foreground) ?? { r: 0, g: 0, b: 0 };
  const bg = hexToRgb(background) ?? { r: 255, g: 255, b: 255 };
  const lighter = Math.max(relativeLuminance(fg), relativeLuminance(bg));
  const darker = Math.min(relativeLuminance(fg), relativeLuminance(bg));
  return { ratio: Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2)) };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  return [r, g, b]
    .map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("en", { maximumFractionDigits: 4 }).format(value);
}

const timeZones = ["UTC", "Asia/Ho_Chi_Minh", "Asia/Bangkok", "Asia/Singapore", "Asia/Tokyo", "Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles", "Australia/Sydney"];

function toDateTimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function zonedDateTimeToDate(value: string, timeZone: string) {
  const base = new Date(`${value}:00Z`);
  const offset = getTimeZoneOffset(base, timeZone);
  return new Date(base.getTime() - offset);
}

function getTimeZoneOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute), Number(values.second));
  return asUtc - date.getTime();
}

function formatInTimeZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

function getAgeParts(birthDate: string, compareDate: string) {
  const birth = new Date(`${birthDate}T00:00:00`);
  const compare = new Date(`${compareDate}T00:00:00`);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(compare.getTime()) || birth > compare) {
    return { ok: false, years: 0, months: 0, days: 0, totalDays: 0 };
  }

  let years = compare.getFullYear() - birth.getFullYear();
  let months = compare.getMonth() - birth.getMonth();
  let days = compare.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(compare.getFullYear(), compare.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    ok: true,
    years,
    months,
    days,
    totalDays: Math.floor((compare.getTime() - birth.getTime()) / 86400000),
  };
}

function generatePassword(length: number, upper: boolean, lower: boolean, numbers: boolean, symbols: boolean) {
  const sets = [
    upper ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "",
    lower ? "abcdefghijkmnopqrstuvwxyz" : "",
    numbers ? "23456789" : "",
    symbols ? "!@#$%^&*_-+=" : "",
  ].filter(Boolean);
  const charset = sets.join("");
  if (!charset) return "";

  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => charset[byte % charset.length]).join("");
}
