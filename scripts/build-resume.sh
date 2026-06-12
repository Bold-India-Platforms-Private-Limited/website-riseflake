#!/usr/bin/env bash
# Build the resume sub-app and copy its static export into public/resume.
# This script is intentionally fault-tolerant — a resume build failure must
# NOT block the main Next.js website build.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."
RESUME_DIR="$ROOT/resume"
OUT_DIR="$RESUME_DIR/out"

build_resume() {
  echo "[build-resume] Building resume sub-app..."
  cd "$RESUME_DIR" || return 1
  cp "$ROOT/.env" .env 2>/dev/null || true
  npm install --include=dev --no-package-lock || return 1
  npm run build || return 1
  echo "[build-resume] Resume build complete"
}

# On Vercel CI, skip rebuild to stay within build timeout.
# Vercel sets VERCEL=1 automatically in all CI builds.
if [ "${VERCEL:-0}" = "1" ]; then
  echo "[build-resume] Vercel CI — skipping resume rebuild (pre-built output will be used if present)"
else
  build_resume || echo "[build-resume] Resume build failed — continuing without it"
fi

# Copy output if it exists
if [ -d "$OUT_DIR" ]; then
  rm -rf "$ROOT/public/resume"
  cp -R "$OUT_DIR" "$ROOT/public/resume"
  node "$ROOT/scripts/fix-resume-paths.js" || true
  echo "[build-resume] Resume output copied to public/resume"
else
  echo "[build-resume] INFO: resume/out not found — /resume route will serve from existing public/resume if present"
fi

exit 0
