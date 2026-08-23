import {spawnSync} from "node:child_process";
import {copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync} from "node:fs";
import {join, relative, sep} from "node:path";

const root = process.cwd();
const system = JSON.parse(readFileSync(join(root, "system.json"), "utf8"));
const outputDir = join(root, "dist");
const zipPath = join(outputDir, "trudvang-chronicles.zip");

const includedRoots = ["modules", "templates", "styles", "lang", "data", "assets", "packs"];
const includedFiles = ["system.json", "trudvang.mjs"];

const excluded = new Set(["lang/GLOSSARY.md"]);
// Reviewable JSON sources used by tools/build-packs.mjs: never shipped inside the zip,
// only the compiled LevelDB directories belong in the published archive.
const excludedPrefixes = ["packs/_source/"];

function collect(directory, output) {
  for (const entry of readdirSync(join(root, directory))) {
    const path = `${directory}/${entry}`;
    if (excluded.has(path)) continue;
    if (excludedPrefixes.some(prefix => path.startsWith(prefix))) continue;
    if (statSync(join(root, path)).isDirectory()) collect(path, output);
    else output.push(path);
  }
}

const files = [...includedFiles];
for (const directory of includedRoots) {
  try {
    collect(directory, files);
  } catch {
    if (directory === "packs") {
      console.error("packs/ manquant : lancez d'abord « npm run build:packs » pour compiler les compendiums embarqués.");
      process.exit(1);
    }
    console.error(`Répertoire attendu manquant: ${directory}/`);
    process.exit(1);
  }
}
// Guard against shipping a half-built tree: every pack declared in system.json must be a
// compiled LevelDB directory, not just its JSON sources.
for (const declaredPack of system.packs ?? []) {
  const marker = join(root, "packs", String(declaredPack.name), "CURRENT");
  if (!existsSync(marker)) {
    console.error(`Pack non compilé: packs/${declaredPack.name} (fichier ${marker} absent). Lancez « npm run build:packs ».`);
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
