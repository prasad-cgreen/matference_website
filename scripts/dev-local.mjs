import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frontendDir = path.join(repoRoot, "frontend");
const backendDir = path.join(repoRoot, "backend");
const isWindows = process.platform === "win32";
const venvPython = path.join(
  backendDir,
  ".venv",
  isWindows ? "Scripts" : "bin",
  isWindows ? "python.exe" : "python",
);
const cracoCli = path.join(frontendDir, "node_modules", "@craco", "craco", "dist", "bin", "craco.js");

if (!existsSync(venvPython) || !existsSync(cracoCli)) {
  console.error("Local dependencies are missing. Run `npm run setup` from the repository root first.");
  process.exit(1);
}

const backendEnvFile = path.join(backendDir, ".env");
const backendEnv = { ...process.env };
if (!existsSync(backendEnvFile)) {
  backendEnv.MONGO_URL ||= "mongodb://127.0.0.1:27017";
  backendEnv.DB_NAME ||= "cgreen";
  backendEnv.CORS_ORIGINS ||= "http://localhost:3000,http://127.0.0.1:3000";
  console.warn(
    "backend/.env was not found; using local MongoDB defaults. " +
      "The contact form requires MongoDB on 127.0.0.1:27017.",
  );
}

const frontendEnv = {
  ...process.env,
  REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000",
};

console.log("Backend:  http://127.0.0.1:8000/api/");
console.log("Frontend: http://localhost:3000");
console.log("Press Ctrl+C once to stop both services.\n");

const children = [
  spawn(
    venvPython,
    ["-m", "uvicorn", "server:app", "--host", "127.0.0.1", "--port", "8000"],
    { cwd: backendDir, env: backendEnv, stdio: "inherit" },
  ),
  spawn(process.execPath, [cracoCli, "start"], {
    cwd: frontendDir,
    env: frontendEnv,
    stdio: "inherit",
  }),
];

let stopping = false;
function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.killed || !child.pid) continue;
    if (isWindows) {
      spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
    } else {
      child.kill("SIGTERM");
    }
  }
  setTimeout(() => process.exit(exitCode), 500).unref();
}

for (const child of children) {
  child.on("error", (error) => {
    console.error(error);
    stopAll(1);
  });
  child.on("exit", (code) => {
    if (!stopping) stopAll(code ?? 1);
  });
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
