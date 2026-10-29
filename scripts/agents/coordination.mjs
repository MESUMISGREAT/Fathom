#!/usr/bin/env node
import { mkdir, readFile, writeFile, rename, readdir, stat, rmdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";

const root = path.resolve(process.env.FATHOM_AGENT_COORD_DIR || ".agent-coordination");
const dirs = {
  agents: path.join(root, "agents"), messages: path.join(root, "messages"),
  claims: path.join(root, "claims"), state: path.join(root, "state"),
};
const args = process.argv.slice(2), command = args.shift() || "help", flags = {};
for (let i = 0; i < args.length; i++) {
  if (!args[i].startsWith("--")) continue;
  const key = args[i].slice(2), next = args[i + 1];
  flags[key] = next && !next.startsWith("--") ? (i++, next) : true;
}
const now = () => new Date().toISOString();
const agentId = () => String(flags.id || process.env.FATHOM_AGENT_ID || "").trim();
const taskKey = v => String(v || "").trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);
const parseList = v => String(v || "").split(",").map(s => s.trim()).filter(Boolean);
const output = v => console.log(typeof v === "string" ? v : JSON.stringify(v, null, 2));
async function ensure() { for (const d of Object.values(dirs)) await mkdir(d, { recursive: true }); }
async function readJson(file) { try { return JSON.parse(await readFile(file, "utf8")); } catch (e) { if (e.code === "ENOENT") return null; throw e; } }
async function atomicJson(file, value) {
  const tmp = file + "." + process.pid + "." + randomUUID() + ".tmp";
  await writeFile(tmp, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
  await rename(tmp, file);
}
async function files(dir) { try { return (await readdir(dir)).sort(); } catch { return []; } }
async function sendMessage(from, to, type, text, task = "", touched = []) {
  if (!from) throw new Error("Missing --from ID (or set FATHOM_AGENT_ID).");
  if (!text) throw new Error("Missing --text.");
  const stamp = now(), msg = { timestamp: stamp, from, to: to || "all", type: type || "finding", task: task || null, files: touched, text };
  const name = stamp.replace(/[:.]/g, "-") + "-" + taskKey(from) + "-" + randomUUID().slice(0, 8) + ".json";
  await writeFile(path.join(dirs.messages, name), JSON.stringify(msg, null, 2) + "\n", { flag: "wx" });
  output({ sent: true, file: name, message: msg });
}
async function listMessages(limit = 20) {
  const names = (await files(dirs.messages)).filter(n => n.endsWith(".json")).slice(-limit), out = [];
  for (const n of names) { const m = await readJson(path.join(dirs.messages, n)); if (m) out.push({ file: n, ...m }); }
  return out;
}
async function run() {
  if (command === "help" || flags.help) {
    output("Fathom local agent coordination\nDirectory: " + root + "\nCommands:\n" +
      "  init\n  join --id ID --role ROLE --capabilities \"writer,reviewer\" [--task TASK]\n" +
      "  status\n  message --from ID --to all|ID --type proposal --task TASK --files \"a,b\" --text \"message\"\n" +
      "  watch --id ID [--interval 3000] [--since ISO_TIMESTAMP]\n" +
      "  set-leader --id ID\n" +
      "  assign --from LEADER_ID --to AGENT_ID --task TASK --files \"a,b\" [--role ROLE] --text \"instructions\"\n" +
      "  claim --id ID --task TASK --files \"a,b\" [--role ROLE]\n" +
      "  heartbeat --id ID [--role ROLE] [--task TASK] [--status active|idle|blocked|done] [--files \"a,b\"]\n" +
      "  release --id ID --task TASK\n" +
      "Set FATHOM_AGENT_COORD_DIR to an absolute path shared by all agents when using separate worktrees.\n" +
      "File messages require polling; this is not push messaging.");
    return;
  }
  await ensure();
  if (command === "init") { output({ initialized: root, note: "Use the exact same directory path in every agent." }); return; }
  if (command === "join") {
    const id = agentId();
    if (!id) throw new Error("Provide --id or FATHOM_AGENT_ID.");
    const file = path.join(dirs.agents, taskKey(id) + ".json"), previous = await readJson(file);
    const agent = { id, host: os.hostname(), pid: process.pid, startedAt: previous?.startedAt || now(), heartbeatAt: now(), role: flags.role || "unassigned", capabilities: parseList(flags.capabilities), task: flags.task || null, files: [], status: "active" };
    await atomicJson(file, agent);
    await sendMessage(id, "all", "hello", "Joined coordination. Role proposal: " + agent.role + ". Capabilities: " + (agent.capabilities.join(", ") || "not specified") + ".", agent.task || "");
    output(agent); return;
  }
  if (command === "message") {
    await sendMessage(agentId() || String(flags.from || ""), String(flags.to || "all"), String(flags.type || "finding"), String(flags.text || ""), String(flags.task || ""), parseList(flags.files)); return;
  }
  if (command === "status") {
    const agents = [];
    for (const n of await files(dirs.agents)) { if (n.endsWith(".json")) { const a = await readJson(path.join(dirs.agents, n)); if (a) agents.push(a); } }
    const claims = [];
    for (const n of await files(dirs.claims)) {
      const p = path.join(dirs.claims, n, "owner.json"), c = await readJson(p);
      if (c) claims.push(c);
      else { try { const s = await stat(path.join(dirs.claims, n)); claims.push({ task: n, warning: "Claim directory exists without owner.json; inspect before cleanup", createdAt: s.birthtime.toISOString() }); } catch {} }
    }
    output({ directory: root, leader: await readJson(path.join(dirs.state, "leader.json")), agents, claims, recentMessages: await listMessages(Number(flags.limit || 15)) }); return;
  }
  if (command === "set-leader") {
    const id = agentId();
    if (!id) throw new Error("Provide --id.");
    const file = path.join(dirs.state, "leader.json"), current = await readJson(file);
    if (current && current.id !== id) throw new Error("Leader already set to " + current.id + "; only that leader or the human operator should change it.");
    const leader = { id, setAt: current?.setAt || now(), updatedAt: now(), temporary: true };
    await atomicJson(file, leader);
    await sendMessage(id, "all", "leader", "Temporary lesson coordinator is " + id + ". Route assignments, queue decisions, and publication coordination through this agent.", "");
    output(leader); return;
  }
  if (command === "assign") {
    const from = String(flags.from || agentId()), to = String(flags.to || "").trim(), task = taskKey(flags.task);
    if (!from || !to || !task || !flags.text) throw new Error("Provide --from, --to, --task, and --text.");
    const leader = await readJson(path.join(dirs.state, "leader.json"));
    if (!leader || leader.id !== from) throw new Error("Only the registered temporary leader can assign work. Current leader: " + (leader?.id || "not set") + ".");
    const claimDir = path.join(dirs.claims, task);
    try { await mkdir(claimDir); } catch (e) {
      if (e.code === "EEXIST") { output({ assigned: false, task, owner: await readJson(path.join(claimDir, "owner.json")), message: "Task already claimed or assigned. Inspect owner and negotiate a handoff; do not overwrite." }); process.exitCode = 2; return; }
      throw e;
    }
    const targetFile = path.join(dirs.agents, taskKey(to) + ".json"), existingTarget = await readJson(targetFile);
    if (!existingTarget) { output({ assigned: false, task, message: "Recipient is not registered. Ask the agent to join first; do not assign work to an invisible mailbox." }); process.exitCode = 2; return; }
    const lastBeat = Date.parse(existingTarget.heartbeatAt || "");
    if (existingTarget.status === "blocked" || existingTarget.status === "done" || !Number.isFinite(lastBeat) || Date.now() - lastBeat > 5 * 60 * 1000) { output({ assigned: false, task, recipient: existingTarget, message: "Recipient is not confirmed active (blocked/done/stale heartbeat). Ask them to heartbeat before assigning." }); process.exitCode = 2; return; }
    const filesList = parseList(flags.files);
    const claim = { task, agentId: to, role: flags.role || "writer", files: filesList, status: "assigned", assignedBy: from, instructions: String(flags.text), startedAt: now(), heartbeatAt: now(), host: existingTarget.host || null, pid: existingTarget.pid || null };
    try {
      await atomicJson(path.join(claimDir, "owner.json"), claim);
      const agentFile = path.join(dirs.agents, taskKey(to) + ".json"), target = await readJson(agentFile) || { id: to, startedAt: now(), capabilities: [] };
      await atomicJson(agentFile, { ...target, id: to, heartbeatAt: now(), role: claim.role, task, files: filesList, status: "assigned", assignedBy: from });
      await sendMessage(from, to, "assignment", "TASK ASSIGNED by " + from + ": " + task + ". Role: " + claim.role + ". Files: " + (filesList.join(", ") || "confirm exact scope before editing") + ". Instructions: " + claim.instructions, task, filesList);
      await sendMessage(from, "all", "assignment", "Assigned " + task + " to " + to + " as " + claim.role + ".", task, filesList);
      output({ assigned: true, claim });
    } catch (e) { output({ error: "Claim directory exists but assignment setup failed. Inspect it manually; do not assume task is free.", task, detail: String(e) }); process.exitCode = 1; }
    return;
  }
  if (command === "claim") {
    const id = agentId(), task = taskKey(flags.task);
    if (!id || !task) throw new Error("Provide --id and --task.");
    const claimDir = path.join(dirs.claims, task);
    try { await mkdir(claimDir); } catch (e) {
      if (e.code === "EEXIST") { output({ claimed: false, task, owner: await readJson(path.join(claimDir, "owner.json")), message: "Already claimed. Do not edit this task." }); process.exitCode = 2; return; }
      throw e;
    }
    const claim = { task, agentId: id, role: flags.role || "writer", files: parseList(flags.files), startedAt: now(), heartbeatAt: now(), host: os.hostname(), pid: process.pid };
    try {
      await atomicJson(path.join(claimDir, "owner.json"), claim);
      const af = path.join(dirs.agents, taskKey(id) + ".json"), agent = await readJson(af) || { id, host: os.hostname(), pid: process.pid, startedAt: now(), capabilities: [] };
      await atomicJson(af, { ...agent, heartbeatAt: now(), role: claim.role, task, files: claim.files, status: "active" });
      await sendMessage(id, "all", "claim", "Claimed task " + task + " as " + claim.role + ".", task, claim.files);
      output({ claimed: true, claim });
    } catch (e) { output({ error: "Claim directory created but setup failed. Inspect it manually; do not assume it is free.", task, detail: String(e) }); process.exitCode = 1; }
    return;
  }
  if (command === "heartbeat") {
    const id = agentId(), task = taskKey(flags.task || "");
    if (!id) throw new Error("Provide --id.");
    const af = path.join(dirs.agents, taskKey(id) + ".json"), agent = await readJson(af) || { id, host: os.hostname(), pid: process.pid, startedAt: now(), capabilities: [] };
    const updated = { ...agent, heartbeatAt: now(), role: flags.role || agent.role || "unassigned", task: task || agent.task || null, files: flags.files ? parseList(flags.files) : (agent.files || []), status: flags.status || "active" };
    await atomicJson(af, updated);
    if (updated.task) {
      const of = path.join(dirs.claims, taskKey(updated.task), "owner.json"), owner = await readJson(of);
      if (owner?.agentId === id) await atomicJson(of, { ...owner, heartbeatAt: now() });
    }
    // Heartbeats are also visible to other agents through the mailbox.
    // Keep the message concise so frequent liveness checks do not flood the channel.
    await sendMessage(id, "all", "heartbeat",
      "Heartbeat: status=" + updated.status + "; task=" + (updated.task || "none") +
      "; role=" + (updated.role || "unassigned") + "; files=" + ((updated.files || []).join(", ") || "none"),
      updated.task || "", updated.files || []);
    output(updated); return;
  }
  if (command === "release") {
    const id = agentId(), task = taskKey(flags.task);
    if (!id || !task) throw new Error("Provide --id and --task.");
    const claimDir = path.join(dirs.claims, task), ownerFile = path.join(claimDir, "owner.json"), owner = await readJson(ownerFile);
    if (!owner) throw new Error("No readable owner claim found; inspect manually.");
    if (owner.agentId !== id) throw new Error("Claim belongs to " + owner.agentId + "; refusing to release it.");
    const released = path.join(dirs.state, "released-" + task + "-" + Date.now() + "-" + randomUUID().slice(0, 6) + ".json");
    await rename(ownerFile, released); await rmdir(claimDir);
    const af = path.join(dirs.agents, taskKey(id) + ".json"), agent = await readJson(af);
    if (agent) await atomicJson(af, { ...agent, heartbeatAt: now(), task: null, files: [], status: "idle" });
    await sendMessage(id, "all", "release", "Released task " + task + ".", task, owner.files || []);
    output({ released: true, task, record: released }); return;
  }
  if (command === "watch") {
    const id = agentId();
    if (!id) throw new Error("Provide --id.");
    const interval = Math.max(1000, Number(flags.interval || 3000));
    const since = flags.since ? new Date(String(flags.since)).getTime() : Date.now();
    output({ watching: root, agentId: id, intervalMs: interval, since: new Date(since).toISOString(), note: "Ctrl+C to stop. Polling, not push delivery." });
    const seen = new Set();
    for (const n of (await files(dirs.messages)).filter(n => n.endsWith(".json"))) {
      const m = await readJson(path.join(dirs.messages, n)); if (m && new Date(m.timestamp).getTime() <= since) seen.add(n);
    }
    while (true) {
      for (const n of (await files(dirs.messages)).filter(n => n.endsWith(".json"))) {
        if (seen.has(n)) continue;
        const m = await readJson(path.join(dirs.messages, n)); seen.add(n);
        if (!m || m.from === id || (m.to !== "all" && m.to !== id)) continue;
        output({ file: n, ...m });
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  throw new Error("Unknown command: " + command + ". Run: node scripts/agents/coordination.mjs help");
}
run().catch(e => { console.error(e.message || e); process.exitCode = 1; });
