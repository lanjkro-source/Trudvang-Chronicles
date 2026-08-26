// Atomic release pipeline: bump -> validate -> commit -> tag -> push both remotes -> verify.
// Usage: npm run release <x.y.z|patch|minor> ["commit subject"] [--dry-run]
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2).filter((arg) => arg !== "--dry-run");
const dryRun = args.length !== process.argv.slice(2).length;
const [versionArg, ...subjectParts] = args;
const subject = subjectParts.join(" ").trim();

function git(args, {allowFailure = false} = {}) {
  const result = spawnSync("git", args, {encoding: "utf8"});
  if (result.status !== 0 && !allowFailure) {
    console.error(`git ${args.join(" ")} failed:\n${result.stderr || result.stdout}`);
    process.exit(1);
  }
  return `${result.stdout}${result.stderr}`.trim();
}

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function githubRepository() {
  const remote = git(["remote", "get-url", "origin"]);
  const match = remote.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) fail(`The origin remote is not a GitHub repository: ${remote}`);
  return `${match[1]}/${match[2]}`;
}

function githubToken() {
  const credential = spawnSync("git", ["credential", "fill"], {
    input: "protocol=https\nhost=github.com\n\n",
    encoding: "utf8"
  });
  const password = `${credential.stdout}`.split(/\r?\n/).find(line => line.startsWith("password="));
  if (!password) fail("No GitHub credential is available to dispatch the release workflow.");
  return password.slice("password=".length);
}

async function dispatchReleaseWorkflow({repository, token, ref}) {
  const response = await fetch(`https://api.github.com/repos/${repository}/actions/workflows/release.yml/dispatches`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Trudvang-release-script"
    },
    body: JSON.stringify({ref})
  });
  if (!response.ok) fail(`Could not dispatch the GitHub release workflow (${response.status}): ${await response.text()}`);
}

async function waitForReleaseAsset({repository, token, tag, headHash}) {
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Trudvang-release-script"
  };
  const deadline = Date.now() + (5 * 60 * 1000);
  while (Date.now() < deadline) {
    const releaseResponse = await fetch(`https://api.github.com/repos/${repository}/releases/tags/${tag}`, {headers});
    if (releaseResponse.ok) {
      const release = await releaseResponse.json();
      const asset = release.assets.find(candidate => candidate.name === "trudvang-chronicles.zip");
      if (asset) return asset.browser_download_url;
    } else if (releaseResponse.status !== 404) {
      fail(`Could not verify GitHub release ${tag} (${releaseResponse.status}): ${await releaseResponse.text()}`);
    }

    const runsResponse = await fetch(`https://api.github.com/repos/${repository}/actions/workflows/release.yml/runs?event=workflow_dispatch&per_page=20`, {headers});
    if (runsResponse.ok) {
      const {workflow_runs: runs} = await runsResponse.json();
      const run = runs.find(candidate => candidate.head_sha === headHash);
      if (run?.status === "completed" && run.conclusion !== "success") {
        fail(`GitHub release workflow failed: ${run.html_url}`);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  fail(`Timed out waiting for GitHub to attach trudvang-chronicles.zip to ${tag}.`);
}

const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch !== "main") fail(`Releases happen from main (current: ${branch}).`);
const head = git(["rev-parse", "HEAD"]);
const dirty = git(["status", "--porcelain"]);

const system = JSON.parse(readFileSync("system.json", "utf8"));
let version = versionArg;
if (!version) fail("Usage: npm run release <x.y.z|patch|minor> [\"subject\"] [--dry-run]");
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  const match = system.version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) fail(`Cannot parse current version "${system.version}".`);
  let [, major, minor, patch] = match.map(Number);
  if (version === "minor") { minor += 1; patch = 0; }
  else if (version === "patch") patch += 1;
  else fail(`Unknown version "${version}" (expected x.y.z, patch or minor).`);
  version = `${major}.${minor}.${patch}`;
}
if (version === system.version) fail(`Version ${version} equals the current one.`);
const tag = `v${version}`;

if (git(["tag", "-l", tag])) fail(`Local tag ${tag} already exists.`);
if (git(["ls-remote", "origin", `refs/tags/${tag}`])) fail(`Remote tag ${tag} already exists on origin.`);

const steps = [];
steps.push({label: `system.json version -> ${version}`, run: () => {
  let raw = readFileSync("system.json", "utf8");
  raw = raw.replace(/"version":\s*"[^"]+"/, `"version": "${version}"`);
  raw = raw.replace(/"download":\s*"[^"]+"/, `"download": "https://github.com/lanjkro-source/Trudvang-Chronicles/releases/download/v${version}/trudvang-chronicles.zip"`);
  writeFileSync("system.json", raw, "utf8");
}});
steps.push({label: "npm run check", run: () => {
  const runner = process.platform === "win32"
    ? spawnSync("cmd", ["/d", "/s", "/c", "npm run check"], {encoding: "utf8"})
    : spawnSync("npm", ["run", "check"], {encoding: "utf8"});
  if (runner.status !== 0) fail(`Validation failed:\n${runner.stdout}\n${runner.stderr}`);
}});
steps.push({label: `commit (${dirty ? `${dirty.split("\n").length} changed paths` : "no changes besides bump"})`, run: () => {
  git(["add", "-A"]);
  const line = subject ? `${subject}; v${version}` : `Release v${version}`;
  git(["commit", "-m", line]);
}});
steps.push({label: `tag ${tag}`, run: () => git(["tag", tag])});
steps.push({label: "push origin main", run: () => git(["push", "origin", "main"])});
steps.push({label: "push backup main", run: () => git(["push", "backup", "main"])});
steps.push({label: `push origin ${tag}`, run: () => git(["push", "origin", tag])});
steps.push({label: "verify remote state", run: () => {
  const headHash = git(["rev-parse", "HEAD"]);
  const check = (remote, ref) => git(["ls-remote", remote, ref], {allowFailure: true}).split(/\r?\n/)[0]?.split(/\t/)[0] ?? "";
  const checks = [
    ["origin main", check("origin", "refs/heads/main")],
    ["backup main", check("backup", "refs/heads/main")],
    [`origin ${tag}`, check("origin", `refs/tags/${tag}`)]
  ];
  for (const [name, hash] of checks) {
    if (hash !== headHash) fail(`Post-push verification failed for ${name}: "${hash || "missing"}" != ${headHash}. Push manually: git push origin main ${tag} && git push backup main`);
  }
}});
steps.push({label: "dispatch GitHub release workflow", run: async () => {
  const repository = githubRepository();
  const token = githubToken();
  const headHash = git(["rev-parse", "HEAD"]);
  await dispatchReleaseWorkflow({repository, token, ref: tag});
  const assetUrl = await waitForReleaseAsset({repository, token, tag, headHash});
  console.log(`GitHub release asset: ${assetUrl}`);
}});

console.log(`Release plan for v${version}${dryRun ? " (dry-run)" : ""}:`);
for (const step of steps) console.log(`  - ${step.label}`);
if (dryRun) process.exit(0);

for (const step of steps) {
  console.log(`▶ ${step.label}`);
  await step.run();
}
console.log(`\n✔ Release v${version} pushed to origin and backup; the GitHub ZIP is available.`);
