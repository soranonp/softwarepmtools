// Generates raster assets from the hand-authored SVGs in /public.
//
//   public/og-image.svg  -> public/og-image.png       (1200x630, social cards)
//   public/favicon.svg   -> public/apple-touch-icon.png (180x180, iOS bookmark)
//
// Facebook/LINE/Twitter do not render SVG OG images, and iOS needs a PNG
// touch icon, so these PNGs are required even though SVG works in browsers.
//
// Run: node scripts/generate-images.mjs

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public",
);

async function render(srcSvg, outPng, width, height) {
  const svg = await readFile(path.join(publicDir, srcSvg));
  // `density` is dpi for the SVG raster step; high value keeps text crisp
  // before sharp resizes to the exact target dimensions.
  const png = await sharp(svg, { density: 384 })
    .resize(width, height, { fit: "fill" })
    .png()
    .toBuffer();
  await writeFile(path.join(publicDir, outPng), png);
  console.log(`${srcSvg} -> ${outPng} (${width}x${height})`);
}

await render("og-image.svg", "og-image.png", 1200, 630);
await render("favicon.svg", "apple-touch-icon.png", 180, 180);

// favicon.ico — legacy fallback for browsers/crawlers that ignore favicon.svg.
// No ImageMagick here, so we build the ICO container by hand. ICO entries may
// embed full PNG payloads (supported by all modern browsers), so we pack a
// 16x16 and a 32x32 PNG into one multi-size .ico.
async function buildFaviconIco() {
  const svg = await readFile(path.join(publicDir, "favicon.svg"));
  const sizes = [16, 32];
  const pngs = await Promise.all(
    sizes.map((s) =>
      sharp(svg, { density: 384 }).resize(s, s, { fit: "fill" }).png().toBuffer(),
    ),
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4); // image count

  const dir = Buffer.alloc(16 * sizes.length);
  let offset = header.length + dir.length;
  sizes.forEach((s, i) => {
    const e = i * 16;
    dir.writeUInt8(s >= 256 ? 0 : s, e + 0); // width
    dir.writeUInt8(s >= 256 ? 0 : s, e + 1); // height
    dir.writeUInt8(0, e + 2); // palette colors
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // color planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(pngs[i].length, e + 8); // payload size
    dir.writeUInt32LE(offset, e + 12); // payload offset
    offset += pngs[i].length;
  });

  await writeFile(
    path.join(publicDir, "favicon.ico"),
    Buffer.concat([header, dir, ...pngs]),
  );
  console.log(`favicon.svg -> favicon.ico (${sizes.join(", ")})`);
}

await buildFaviconIco();
