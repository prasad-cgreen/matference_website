import { existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frontendDir = path.join(repoRoot, "frontend");
const backendDir = path.join(repoRoot, "backend");
const venvDir = path.join(backendDir, ".venv");
const isWindows = process.platform === "win32";
const venvPython = path.join(
  venvDir,
  isWindows ? "Scripts" : "bin",
  isWindows ? "python.exe" : "python",
);
const npxCli = path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npx-cli.js");

function run(command, args, options = {}) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("Installing frontend dependencies from frontend/yarn.lock...");
run(
  existsSync(npxCli) ? process.execPath : "npx",
  [
    ...(existsSync(npxCli) ? [npxCli] : []),
    "--yes",
    "yarn@1.22.22",
    "install",
    "--frozen-lockfile",
    "--non-interactive",
  ],
  { cwd: frontendDir },
);

const venvIsComplete =
  existsSync(venvPython) &&
  spawnSync(venvPython, ["-m", "pip", "--version"], { stdio: "ignore" }).status === 0;

if (existsSync(venvDir) && !venvIsComplete) {
  console.log("Removing the incomplete backend virtual environment...");
  rmSync(venvDir, { recursive: true, force: true });
}

if (!venvIsComplete) {
  console.log("\nCreating backend/.venv. This can take a minute while Python installs pip; do not interrupt it.");
  run(process.env.PYTHON || "python", ["-m", "venv", venvDir]);
}

console.log("\nInstalling isolated backend runtime dependencies...");
run(venvPython, [
  "-m",
  "pip",
  "install",
  "--disable-pip-version-check",
  "--requirement",
  path.join(backendDir, "requirements.prod.txt"),
]);

console.log("\nLocal setup complete. Start both services with: npm run dev");
