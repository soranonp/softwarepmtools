#!/usr/bin/env bash
# Verify every page emits its JSON-LD structured data in the built HTML.
#
# IMPORTANT: next.config has `output: "export"`, so Next.js writes
# directory-style files (out/services/index.html), NOT flat files
# (out/services.html). Grepping the flat path always reports 0 even when
# the schema is present — that bug is what this script exists to avoid.
#
# Usage: ./scripts/verify-jsonld.sh   (run after `npm run build`)

set -euo pipefail

OUT_DIR="${1:-out}"

if [ ! -d "$OUT_DIR" ]; then
  echo "ERROR: '$OUT_DIR' not found. Run 'npm run build' first." >&2
  exit 1
fi

# Route -> built HTML file (static-export layout). Root is the one flat file.
PAGES=(
  "/                          ${OUT_DIR}/index.html"
  "/tools                     ${OUT_DIR}/tools/index.html"
  "/services                  ${OUT_DIR}/services/index.html"
  "/about                     ${OUT_DIR}/about/index.html"
  "/contact                   ${OUT_DIR}/contact/index.html"
  "/tools/project-estimation  ${OUT_DIR}/tools/project-estimation/index.html"
  "/tools/timeline-planner    ${OUT_DIR}/tools/timeline-planner/index.html"
)

fail=0
for entry in "${PAGES[@]}"; do
  route="${entry%% *}"
  file="${entry##* }"
  if [ ! -f "$file" ]; then
    echo "MISSING  $route -> $file"
    fail=1
    continue
  fi
  count=$(grep -c "application/ld+json" "$file" || true)
  if [ "$count" -ge 1 ]; then
    echo "OK       $route -> $count schema block(s)  ($file)"
  else
    echo "NO JSON-LD  $route -> $file"
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo "---"
  echo "FAIL: one or more pages are missing JSON-LD." >&2
  exit 1
fi

echo "---"
echo "PASS: all pages emit JSON-LD."
