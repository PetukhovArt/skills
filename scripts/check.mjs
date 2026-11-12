#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROMOTED = ["measure", "cut", "prove", "teach"];
const BUCKETS = [...PROMOTED, "in-progress", "deprecated"];
const SKIP_DIRS = new Set([".git", "node_modules"]);
const PROSE = /\.(md|ya?ml|json|mjs)$/;

const errors = [];
const fail = (file, msg) => errors.push(`${relative(repo, file).split(sep).join("/")}: ${msg}`);
const read = (file) => readFileSync(file, "utf8").replace(/\r\n/g, "\n");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fields = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1");
  }
  return fields;
}

const files = walk(repo);
const skills = [];

for (const file of files.filter((f) => f.endsWith(`${sep}SKILL.md`))) {
  const dir = dirname(file);
  const parts = relative(repo, dir).split(sep);
  if (parts.length !== 3 || parts[0] !== "skills" || !BUCKETS.includes(parts[1])) {
    fail(file, `a skill lives at skills/<${BUCKETS.join("|")}>/<name>/SKILL.md`);
    continue;
  }
  const [, bucket, name] = parts;
  const fm = frontmatter(read(file));
  if (!fm) {
    fail(file, "no frontmatter");
    continue;
  }
  if (fm.name !== name) fail(file, `frontmatter name "${fm.name}" differs from folder "${name}"`);
  if (!fm.description) fail(file, "no description");

  const openai = join(dir, "agents", "openai.yaml");
  if (!existsSync(openai)) {
    fail(file, "missing agents/openai.yaml");
  } else {
    const yaml = read(openai);
    for (const key of ["display_name", "short_description"]) {
      if (!new RegExp(`^\\s+${key}:\\s*\\S`, "m").test(yaml)) fail(openai, `missing interface.${key}`);
    }
    const userInvoked = fm["disable-model-invocation"] === "true";
    const noImplicit = /^\s+allow_implicit_invocation:\s*false\s*$/m.test(yaml);
    if (userInvoked !== noImplicit) {
      fail(openai, "disable-model-invocation: true in SKILL.md and policy.allow_implicit_invocation: false here go together");
    }
  }
  skills.push({ bucket, name, path: `./skills/${bucket}/${name}` });
}

for (const bucket of readdirSync(join(repo, "skills"))) {
  const dir = join(repo, "skills", bucket);
  if (!statSync(dir).isDirectory()) continue;
  if (!BUCKETS.includes(bucket)) fail(dir, `unknown bucket, expected one of ${BUCKETS.join(", ")}`);
  else if (!skills.some((s) => s.bucket === bucket)) fail(dir, "empty bucket: remove it until its first skill");
}

const pluginFile = join(repo, ".claude-plugin", "plugin.json");
const plugin = JSON.parse(read(pluginFile));
const promoted = skills.filter((s) => PROMOTED.includes(s.bucket)).map((s) => s.path).sort();
const shipped = [...(plugin.skills ?? [])].sort();
for (const p of promoted.filter((p) => !shipped.includes(p))) fail(pluginFile, `skills is missing ${p}`);
for (const p of shipped.filter((p) => !promoted.includes(p))) fail(pluginFile, `skills lists ${p}, which is not a promoted skill`);

const readme = read(join(repo, "README.md"));
for (const s of skills) {
  const bucketReadme = join(repo, "skills", s.bucket, "README.md");
  const listed = existsSync(bucketReadme) && read(bucketReadme).includes(`(./${s.name}/SKILL.md)`);
  if (s.bucket !== "deprecated" && !listed) fail(bucketReadme, `does not link ${s.name}`);
  const inTop = readme.includes(`(${s.path}/SKILL.md)`);
  if (PROMOTED.includes(s.bucket) && !inTop) fail(join(repo, "README.md"), `does not link ${s.name}`);
  if (!PROMOTED.includes(s.bucket) && inTop) fail(join(repo, "README.md"), `links ${s.name}, which is not promoted`);
}

for (const file of files.filter((f) => PROSE.test(f) && !f.endsWith("package-lock.json"))) {
  read(file).split("\n").forEach((line, i) => {
    if (line.includes(String.fromCharCode(0x2014))) fail(file, `line ${i + 1}: em-dash`);
  });
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`check: ${skills.length} skill(s), all rules hold`);
