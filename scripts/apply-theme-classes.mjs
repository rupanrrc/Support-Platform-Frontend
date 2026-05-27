import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "src");
const repls = [
  ["bg-slate-50/80", "bg-muted/80"],
  ["bg-slate-50", "bg-background"],
  ["bg-white", "bg-card"],
  ["border-slate-300", "border-input"],
  ["border-slate-200", "border-border"],
  ["text-slate-900", "text-foreground"],
  ["text-slate-800", "text-foreground"],
  ["text-slate-700", "text-foreground"],
  ["text-slate-600", "text-muted-foreground"],
  ["text-slate-500", "text-muted-foreground"],
  ["text-slate-400", "text-muted-foreground"],
  ["hover:bg-slate-100", "hover:bg-muted"],
  ["hover:bg-slate-50", "hover:bg-muted"],
  ["divide-slate-200", "divide-border"],
  ["divide-slate-100", "divide-border"],
  ["border-slate-100", "border-border"],
  ["ring-slate-900/5", "ring-black/10 dark:ring-white/10"]
];

function walk(dir) {
  let n = 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) n += walk(p);
    else if (ent.name.endsWith(".tsx")) {
      let c = fs.readFileSync(p, "utf8");
      const orig = c;
      for (const [a, b] of repls) c = c.split(a).join(b);
      if (c !== orig) {
        fs.writeFileSync(p, c);
        n++;
      }
    }
  }
  return n;
}

console.log("updated", walk(root), "files");
