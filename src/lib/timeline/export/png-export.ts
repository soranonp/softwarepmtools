// PNG export of the Gantt chart (spec §10.5 / §12)
//
// html-to-image is dynamically imported to keep it out of the initial bundle.

import { triggerDownload } from "./excel-export";

function fileDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/**
 * Rasterize a node to a PNG data URL. The Gantt's inner scroll container is
 * temporarily expanded so the full timeline (not just the visible window) is
 * captured, then restored — even if html-to-image throws.
 */
export async function captureNodeToPng(node: HTMLElement): Promise<string> {
  const { toPng } = await import("html-to-image");
  const scroll = node.querySelector<HTMLElement>("[data-gantt-scroll]");
  const saved = scroll
    ? { overflow: scroll.style.overflow, width: scroll.style.width }
    : null;
  if (scroll) {
    scroll.style.overflow = "visible";
    scroll.style.width = `${scroll.scrollWidth}px`;
  }
  try {
    return await toPng(node, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      cacheBust: true,
    });
  } finally {
    if (scroll && saved) {
      scroll.style.overflow = saved.overflow;
      scroll.style.width = saved.width;
    }
  }
}

/** Capture the Gantt node and download it as `gantt-{date}.png`. */
export async function exportGanttPng(node: HTMLElement): Promise<string> {
  const dataUrl = await captureNodeToPng(node);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const filename = `gantt-${fileDate(new Date())}.png`;
  triggerDownload(blob, filename);
  return filename;
}

/**
 * Render an offscreen HTML string to a PNG (inherits the page's Thai font so
 * Thai text rasterizes correctly). Returns the data URL plus pixel size.
 */
export async function htmlStringToPng(
  html: string,
  widthPx: number,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const { toPng } = await import("html-to-image");
  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:-99999px;top:0;width:${widthPx}px;background:#ffffff;`;
  host.style.fontFamily = getComputedStyle(document.body).fontFamily;
  host.innerHTML = html;
  document.body.appendChild(host);
  try {
    const dataUrl = await toPng(host, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });
    return {
      dataUrl,
      width: host.offsetWidth,
      height: host.offsetHeight,
    };
  } finally {
    host.remove();
  }
}
