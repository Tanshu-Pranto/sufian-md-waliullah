import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import path from "node:path";
const root = process.cwd();
const require = createRequire(path.join(root, "package.json"));
const React = require("react");

const names = {
  browser: "Browser",
  braces: "BracketsCurly",
  database: "Database",
  rocket: "RocketLaunch",
  search: "MagnifyingGlass",
  tree: "TreeStructure",
  terminal: "TerminalWindow",
  branch: "GitBranch",
  plane: "PaperPlaneTilt",
  bag: "ShoppingBag",
  kanban: "Kanban",
  chats: "ChatsCircle",
  stack: "Stack",
  lightning: "Lightning",
};

const collect = (el) => {
  const out = [];
  React.Children.forEach(el.props.children, (c) => {
    if (c && c.props && c.props.d) out.push({ d: c.props.d, opacity: c.props.opacity });
  });
  return out;
};

const result = {};
for (const [key, file] of Object.entries(names)) {
  const mod = await import(path.join(root, `node_modules/@phosphor-icons/react/dist/defs/${file}.es.js`));
  const map = Object.values(mod).find((v) => v instanceof Map);
  const line = collect(map.get("regular")).map((p) => p.d);
  const fill = collect(map.get("duotone")).filter((p) => p.opacity).map((p) => p.d);
  result[key] = { line, fill };
}

const body = Object.entries(result)
  .map(([k, v]) => `  ${k}: {\n    line: ${JSON.stringify(v.line)},\n    fill: ${JSON.stringify(v.fill)},\n  },`)
  .join("\n");

writeFileSync(
  path.join(root, "src/data/dot-icons.ts"),
  `// Path data from Phosphor Icons (MIT), regular weight for lines and the duotone
// background layer for fills. 256 x 256 viewBox. DotIcon rasterizes these
// into a dot grid. Regenerate with scripts/extract-icons.mjs.

export const dotIcons = {\n${body}\n} as const;\n\nexport type DotIconName = keyof typeof dotIcons;\n`
);
console.log(Object.keys(result).map((k) => `${k}: ${result[k].line.length} line, ${result[k].fill.length} fill`).join("\n"));
