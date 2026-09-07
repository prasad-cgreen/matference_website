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

const backendPort = Number(process.env.BACKEND_PORT || 8000);
const frontendPort = Number(process.env.PORT || 3000);

if (!existsSync(venvPython) || !existsSync(cracoCli)) {
  console.error("Local dependencies are missing. Run `npm run setup` from the repository root first.");
  process.exit(1);
}

function listenerPids(port) {
  const pids = new Set();
  if (isWindows) {
    const out = spawnSync("netstat", ["-ano", "-p", "TCP"], { encoding: "utf8" }).stdout || "";
    for (const line of out.split(/\r?\n/)) {
      const match = line.match(/^\s*TCP\s+\S+:(\d+)\s+\S+\s+LISTENING\s+(\d+)\s*$/);
      if (match && Number(match[1]) === port) pids.add(Number(match[2]));
    }
  } else {
    const out = spawnSync("lsof", ["-ti", `tcp:${port}`, "-sTCP:LISTEN"], { encoding: "utf8" }).stdout || "";
    for (const pid of out.split(/\s+/).filter(Boolean)) pids.add(Number(pid));
  }
  return [...pids].filter((pid) => pid > 0 && pid !== process.pid);
}

function commandLineOf(pid) {
  if (isWindows) {
    const result = spawnSync(
      "powershell.exe",
      ["-NoProfile", "-Command", `(Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}').CommandLine`],
      { encoding: "utf8" },
    );
    return (result.stdout || "").trim();
  }
  return (spawnSync("ps", ["-o", "command=", "-p", String(pid)], { encoding: "utf8" }).stdout || "").trim();
}

function killPid(pid) {
  if (isWindows) {
    spawnSync("taskkill", ["/pid", String(pid), "/t", "/f"], { stdio: "ignore" });
  } else {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      /* already gone */
    }
  }
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// A previous run that was closed hard (terminal closed, node force-killed) can leave
// its uvicorn/craco child listening. Reclaim only ports held by *this repo's* processes,
// and wait for the port to actually free before we try to bind it.
function reclaimPort(port, label) {
  const portFlag = port === frontendPort ? "PORT" : "BACKEND_PORT";
  const deadline = Date.now() + 10_000;
  let lingering = [];

  while (Date.now() < deadline) {
    lingering = listenerPids(port);
    if (lingering.length === 0) return;

    for (const pid of lingering) {
      const commandLine = commandLineOf(pid);
      // An empty command line means the process is already exiting (or unreadable);
      // give it a moment rather than mistaking it for someone else's server.
      if (!commandLine) continue;
      if (commandLine.toLowerCase().includes(repoRoot.toLowerCase())) {
        console.log(`Reclaiming ${label} port ${port} from stale process ${pid}.`);
        killPid(pid);
        continue;
      }
      console.error(
        `Port ${port} (${label}) is already in use by PID ${pid}:
  ${commandLine}
` +
          `Stop that process, or run with a different port (e.g. ${portFlag}=${port + 1}).`,
      );
      process.exit(1);
    }
    sleepSync(250);
  }

  console.error(
    `Port ${port} (${label}) is still held by PID ${lingering.join(", ")} after 10s.
` +
      `Stop it manually, or run with a different port (e.g. ${portFlag}=${port + 1}).`,
  );
  process.exit(1);
}

reclaimPort(backendPort, "backend");
reclaimPort(frontendPort, "frontend");

const backendEnvFile = path.join(backendDir, ".env");
const backendEnv = { ...process.env };
if (!existsSync(backendEnvFile)) {
  backendEnv.MONGO_URL ||= "mongodb://127.0.0.1:27017";
  backendEnv.DB_NAME ||= "cgreen";
  backendEnv.CORS_ORIGINS ||= `http://localhost:${frontendPort},http://127.0.0.1:${frontendPort}`;
  console.warn(
    "backend/.env was not found; using local MongoDB defaults. " +
      "The contact form requires MongoDB on 127.0.0.1:27017.",
  );
}

const frontendEnv = {
  ...process.env,
  PORT: String(frontendPort),
  REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL || `http://127.0.0.1:${backendPort}`,
};

console.log(`Backend:  http://127.0.0.1:${backendPort}/api/`);
console.log(`Frontend: http://localhost:${frontendPort}`);
console.log("Press Ctrl+C once to stop both services.\n");

const children = [
  spawn(
    venvPython,
    ["-m", "uvicorn", "server:app", "--host", "127.0.0.1", "--port", String(backendPort)],
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
