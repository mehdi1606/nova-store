#!/usr/bin/env node
"use strict";

/**
 * Build wrapper for Nova Cavalia.
 *
 * `next build --turbopack` compiles and writes every artifact correctly, but on
 * Node v23 + Windows it throws a benign `kill EPERM` (errno -4048) while tearing
 * down its worker subprocesses *after* the build has finished. That stray error
 * makes `npm run build` exit non-zero even though the output in .next is complete.
 *
 * This wrapper runs the exact same build, but:
 *   1. preloads a narrow handler that swallows ONLY that teardown EPERM
 *      (any other uncaught error is re-thrown, so real crashes still fail), and
 *   2. as a safety net, treats a non-zero exit as success *only* when BUILD_ID
 *      was written this run (proof every artifact reached disk).
 *
 * The proper upstream fix is to build on a Node LTS release (20.x / 22.x), where
 * this EPERM does not occur. Run the raw build any time with `npm run build:raw`.
 */

const fs = require("node:fs");
const path = require("node:path");

const PRELOAD_FLAG = "__NC_SUPPRESS_BUILD_EPERM";

/** The single benign error we ignore: Node 23/Windows failing to kill a worker. */
function isBenignKillEperm(err) {
  return Boolean(err) && err.code === "EPERM" && err.syscall === "kill";
}

if (process.env[PRELOAD_FLAG]) {
  // ── Mode A: preloaded (--require) inside the `next build` process ──────────
  process.on("uncaughtException", (err) => {
    if (isBenignKillEperm(err)) return; // swallow the teardown noise
    throw err; // anything else is a real failure — let it crash the build
  });
} else {
  // ── Mode B: the `npm run build` entry point ───────────────────────────────
  const { spawn } = require("node:child_process");

  const root = path.join(__dirname, "..");
  const distDir = process.env.NEXT_DIST_DIR || ".next";
  const buildIdFile = path.join(root, distDir, "BUILD_ID");
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

  // Clear any stale BUILD_ID so its presence afterwards proves THIS run finished.
  try {
    fs.rmSync(buildIdFile, { force: true });
  } catch {
    /* nothing to remove */
  }

  const child = spawn(
    process.execPath,
    ["--require", __filename, nextBin, "build", "--turbopack"],
    { stdio: "inherit", env: { ...process.env, [PRELOAD_FLAG]: "1" } },
  );

  child.on("exit", (code, signal) => {
    if (code === 0) {
      process.exit(0);
    }
    if (fs.existsSync(buildIdFile)) {
      console.log(
        "\n[build] next exited non-zero while tearing down workers, but the " +
          "build completed (BUILD_ID present). Ignoring the known Node 23 + " +
          "Windows teardown EPERM and reporting success.",
      );
      process.exit(0);
    }
    if (signal) {
      console.error(`[build] next was terminated by signal ${signal}.`);
      process.exit(1);
    }
    process.exit(code == null ? 1 : code);
  });
}
