import {spawnSync} from "node:child_process";
import {copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync} from "node:fs";
import {join, relative, sep} from "node:path";

const root = process.cwd();
const system = JSON.parse(readFileSync(join(root, "system.json"), "utf8"));
const outputDir = join(root, "dist");
const zipPath = join(outputDir, "trudvang-chronicles.zip");

const includedRoots = ["modules", "templates", "styles", "lang", "data", "assets"];
const includedFiles = ["system.json", "trudvang.mjs"];

const excluded = new Set(["lang/GLOSSARY.md"]);

function collect(directory, output) {
  for (const entry of readdirSync(join(root, directory))) {
    const path = `${directory}/${entry}`;
    if (excluded.has(path)) continue;
    if (statSync(join(root, path)).isDirectory()) collect(path, output);
    else output.push(path);
  }
}

const files = [...includedFiles];
for (const directory of includedRoots) {
  try {
    collect(directory, files);
  } catch {
    console.error(`Répertoire attendu manquant: ${directory}/`);
    process.exit(1);
  }
}
for (const file of files) {
  if (!statSync(join(root, file)).isFile()) throw new Error(`Introuvable: ${file}`);
}

rmSync(outputDir, {recursive: true, force: true});
mkdirSync(outputDir, {recursive: true});
const staging = join(outputDir, "staging");
for (const file of files) {
  const target = join(staging, file);
  mkdirSync(target.slice(0, target.lastIndexOf(sep)), {recursive: true});
  copyFileSync(join(root, file), target);
}

const result = spawnSync("powershell", [
  "-NoProfile", "-Command",
  `Compress-Archive -Path '${staging}\\*' -DestinationPath '${zipPath}' -Force`
], {encoding: "utf8"});
rmSync(staging, {recursive: true, force: true});
if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(1);
}

const size = statSync(zipPath).size;
console.log(`Package: ${relative(root, zipPath)} (${(size / 1024).toFixed(0)} Ko, ${files.length} fichiers)`);
