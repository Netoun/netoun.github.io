import type { Practice } from "./skills-data.types";

/**
 * The stack, in reading order. Only tools that ship somewhere are listed: each one must be
 * found in a project, a job, a Lab or this site's package.json (the page's evidence test
 * enforces it). Domains come from the tag primitive's colour map, never from here.
 */
export const STACK_TOOLS = [
  "React",
  "TypeScript",
  "Next.js",
  "Vanilla Extract",
  "Tailwind CSS",
  "React Router",
  "React Aria",
  "anime.js",
  "NestJS",
  "Node.js",
  "PostgreSQL",
  "Drizzle",
  "MikroORM",
  "Bun",
  "Elysia",
  "Cloudflare",
  "Keycloak",
  "Zod",
  "Monorepos",
  "Queues",
  "Streaming",
  "Three.js",
  "Canvas 2D",
  "WebGL",
  "WebGPU",
  "Rust",
  "Python",
  "Vite",
  "Vitest",
];

/**
 * How the work gets done with agents and LLMs. Client work stays unnamed ("not listed", as in
 * the work log); tool names are evidence, never a headline.
 */
export const PRACTICES: Practice[] = [
  {
    id: "agents",
    title: "Agentic workflow",
    body: "Spec → plan → task → review → audit, one commit per task. Rules, skills and hooks shared by every agent, wired to MCP tools for browser and IDE checks.",
    withLabel: "works with",
    with: ["Claude Code", "Codex", "Cursor", "opencode"],
    receipt: {
      text: "this site's AGENTS.md",
      href: "https://github.com/netoun/netoun.github.io/blob/main/AGENTS.md",
    },
  },
  {
    id: "pipelines",
    title: "Tool-calling LLM pipelines",
    body: "Subagents call tools and return schema-validated output, turning PDFs up to 100+ pages into structured data. Every quoted piece of evidence is checked against the source text.",
    withLabel: "built with",
    with: ["AI SDK", "zod", "queues", "OCR"],
    receipt: { text: "client work · DigiLog" },
  },
  {
    id: "evals",
    title: "LLM evaluation",
    body: "Ground-truth datasets, field-level accuracy weighted by criticality, prompt and model comparison, replay of past runs.",
    withLabel: "built with",
    with: ["NestJS", "React", "Langfuse"],
    receipt: { text: "client work · DigiLog" },
  },
  {
    id: "llmops",
    title: "LLMOps",
    body: "Prompts versioned in git and promoted from development to production, every step traced.",
    withLabel: "built with",
    with: ["Langfuse", "OpenTelemetry", "Sentry"],
    receipt: { text: "client work · DigiLog" },
  },
];
