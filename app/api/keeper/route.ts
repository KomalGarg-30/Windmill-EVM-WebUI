import { NextRequest, NextResponse } from "next/server";
import { spawn, type ChildProcess } from "child_process";
import path from "path";

export const dynamic = "force-dynamic";

// ── In-memory keeper process state ──────────────────────────────────────
// Persists across requests for the lifetime of the Next.js dev server.
interface KeeperState {
  process: ChildProcess | null;
  pid: number | null;
  running: boolean;
  startedAt: string | null;
  logs: string[];
}

const MAX_LOG_LINES = 200;

const keeper: KeeperState = {
  process: null,
  pid: null,
  running: false,
  startedAt: null,
  logs: [],
};

function pushLog(line: string) {
  keeper.logs.push(line);
  if (keeper.logs.length > MAX_LOG_LINES) {
    keeper.logs.splice(0, keeper.logs.length - MAX_LOG_LINES);
  }
}

// ── POST /api/keeper  →  start or stop the keeper process ───────────────
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const action: string = body.action ?? "start";

  // ── STOP ──────────────────────────────────────────────────────────────
  if (action === "stop") {
    if (!keeper.running || !keeper.process) {
      return NextResponse.json(
        { ok: false, error: "Keeper is not running." },
        { status: 400 }
      );
    }

    try {
      keeper.process.kill("SIGTERM");
    } catch {
      // Process may already be dead — that's fine.
    }

    keeper.running = false;
    keeper.process = null;
    keeper.pid = null;
    pushLog(`[api] Keeper stopped by user at ${new Date().toISOString()}`);

    return NextResponse.json({ ok: true, status: "stopped" });
  }

  // ── START ─────────────────────────────────────────────────────────────
  if (keeper.running && keeper.process) {
    return NextResponse.json(
      { ok: false, error: "Keeper is already running.", pid: keeper.pid },
      { status: 409 }
    );
  }

  // Resolve the path to the Keeper2 project relative to the WebUI project.
  // WebUI lives at  …/Windmill-EVM-Contracts/Windmill-EVM-WebUI
  // Keeper2 lives at …/Windmill-EVM-Contracts/Windmill-EVM-Keeper2
  const keeperDir = path.resolve(process.cwd(), "..", "Windmill-EVM-Keeper2");
  const fileName = ["src", "index.js"].join("/");
  const entryPoint = String(path.resolve(keeperDir, fileName));

  pushLog(`[api] Spawning keeper from ${keeperDir}`);
  pushLog(`[api] Entry: ${entryPoint}`);

  try {
    const child = spawn("node", [entryPoint], {
      cwd: keeperDir,
      env: { ...process.env },          // inherits Keeper2/.env via dotenv inside the keeper
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,                    // keep it tied to this server so we can manage it
      windowsHide: true,
    });

    keeper.process = child;
    keeper.pid = child.pid ?? null;
    keeper.running = true;
    keeper.startedAt = new Date().toISOString();
    keeper.logs = [];
    pushLog(`[api] Keeper started  pid=${keeper.pid}  at ${keeper.startedAt}`);

    // Stream stdout / stderr into the in-memory log buffer
    child.stdout?.on("data", (chunk: Buffer) => {
      const lines = chunk.toString().split("\n").filter(Boolean);
      for (const line of lines) pushLog(`[stdout] ${line}`);
    });

    child.stderr?.on("data", (chunk: Buffer) => {
      const lines = chunk.toString().split("\n").filter(Boolean);
      for (const line of lines) pushLog(`[stderr] ${line}`);
    });

    child.on("exit", (code, signal) => {
      pushLog(
        `[api] Keeper exited  code=${code}  signal=${signal}  at ${new Date().toISOString()}`
      );
      keeper.running = false;
      keeper.process = null;
      keeper.pid = null;
    });

    child.on("error", (err) => {
      pushLog(`[api] Keeper error: ${err.message}`);
      keeper.running = false;
      keeper.process = null;
      keeper.pid = null;
    });

    return NextResponse.json({
      ok: true,
      status: "started",
      pid: keeper.pid,
      startedAt: keeper.startedAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    pushLog(`[api] Failed to spawn keeper: ${message}`);
    return NextResponse.json(
      { ok: false, error: `Failed to spawn keeper: ${message}` },
      { status: 500 }
    );
  }
}

// ── GET /api/keeper  →  return current status + recent logs ─────────────
export async function GET() {
  return NextResponse.json({
    running: keeper.running,
    pid: keeper.pid,
    startedAt: keeper.startedAt,
    logs: keeper.logs,
  });
}
