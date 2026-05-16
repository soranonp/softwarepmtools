// URL state sharing (spec §13)
//
// Encodes the timeline into `?state=` so a teammate can open the same plan.
// Computed task dates are dropped (recomputed on load). State lives in the
// URL only — no localStorage (spec §13 note).
//
// Compression: spec §13 suggests inlining LZString. Instead we use the
// platform CompressionStream (gzip) when the payload exceeds ~2KB — zero
// extra install, far less code than an inlined LZ implementation, and
// reversible via DecompressionStream. A 1-char scheme prefix records which
// encoding was used so old/short links still decode. Flagged per spec §21.

import type {
  Phase,
  ProjectConfig,
  TimelineState,
} from "./types";

interface SerialConfig
  extends Omit<ProjectConfig, "startDate" | "customHolidays"> {
  startDate: string;
  customHolidays: string[];
}
interface SerialPayload {
  v: 1;
  config: SerialConfig;
  phases: Phase[]; // startDate/endDate omitted below
}

const COMPRESS_THRESHOLD = 2048;

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(d.getDate()).padStart(2, "0")}`;
}
function fromDateKey(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function bytesToB64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64UrlToBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function gzip(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart])
    .stream()
    .pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
async function gunzip(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function serialize(state: TimelineState): SerialPayload {
  return {
    v: 1,
    config: {
      ...state.config,
      startDate: toDateKey(state.config.startDate),
      customHolidays: state.config.customHolidays.map(toDateKey),
    },
    phases: state.phases.map((p) => ({
      ...p,
      tasks: p.tasks.map((t) => {
        // Strip computed fields — recomputed by the dependency engine.
        const { startDate: _s, endDate: _e, ...rest } = t;
        void _s;
        void _e;
        return rest;
      }),
    })),
  };
}

function deserialize(payload: SerialPayload): TimelineState {
  return {
    config: {
      ...payload.config,
      startDate: fromDateKey(payload.config.startDate),
      customHolidays: (payload.config.customHolidays ?? []).map(fromDateKey),
    },
    phases: payload.phases,
  };
}

/** Encode state to a URL-safe string (scheme-prefixed). */
export async function encodeState(state: TimelineState): Promise<string> {
  const json = JSON.stringify(serialize(state));
  const bytes = new TextEncoder().encode(json);
  if (
    bytes.length <= COMPRESS_THRESHOLD ||
    typeof CompressionStream === "undefined"
  ) {
    return "1" + bytesToB64Url(bytes);
  }
  return "2" + bytesToB64Url(await gzip(bytes));
}

/** Decode a `?state=` value. Returns null on any malformed input. */
export async function decodeState(
  param: string,
): Promise<TimelineState | null> {
  try {
    const scheme = param[0];
    const body = param.slice(1);
    const raw = b64UrlToBytes(body);
    const bytes = scheme === "2" ? await gunzip(raw) : raw;
    const payload = JSON.parse(
      new TextDecoder().decode(bytes),
    ) as SerialPayload;
    if (payload?.v !== 1 || !Array.isArray(payload.phases)) return null;
    return deserialize(payload);
  } catch {
    return null;
  }
}

/** Build the full shareable URL for the current location. */
export async function buildShareUrl(state: TimelineState): Promise<string> {
  const encoded = await encodeState(state);
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?state=${encoded}`;
}
