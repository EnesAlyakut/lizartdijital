import sharp from "sharp";
import fs from "fs";
import path from "path";

function createIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset
    entries.push(entry);
    offset += img.buffer.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((img) => img.buffer)]);
}

async function main() {
  console.log("Generating favicons from public/decoded-icon.png...");
  const baseFile = "public/decoded-icon.png";

  // Create standard padded 512x512 master (ensures perfect circle cropping for Google SERP)
  const masterSize = 512;
  const innerSize = Math.round(masterSize * 0.82); // 420px
  const resizedInner = await sharp(baseFile)
    .resize(innerSize, innerSize, { fit: "contain" })
    .toBuffer();

  const master512 = await sharp({
    create: {
      width: masterSize,
      height: masterSize,
      channels: 4,
      background: { r: 85, g: 128, b: 83, alpha: 1 },
    },
  })
    .composite([
      {
        input: resizedInner,
        top: Math.round((masterSize - innerSize) / 2),
        left: Math.round((masterSize - innerSize) / 2),
      },
    ])
    .png()
    .toBuffer();

  // 1. Generate sizes
  const p16 = await sharp(master512).resize(16, 16).png().toBuffer();
  const p32 = await sharp(master512).resize(32, 32).png().toBuffer();
  const p48 = await sharp(master512).resize(48, 48).png().toBuffer();
  const p96 = await sharp(master512).resize(96, 96).png().toBuffer();
  const p180 = await sharp(master512).resize(180, 180).png().toBuffer();
  const p192 = await sharp(master512).resize(192, 192).png().toBuffer();
  const p512 = master512;

  // 2. Generate multi-size favicon.ico
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 },
  ]);

  // Write to public/
  fs.writeFileSync("public/favicon.ico", icoBuffer);
  fs.writeFileSync("public/favicon-16x16.png", p16);
  fs.writeFileSync("public/favicon-32x32.png", p32);
  fs.writeFileSync("public/favicon-48x48.png", p48);
  fs.writeFileSync("public/favicon-96x96.png", p96);
  fs.writeFileSync("public/apple-touch-icon.png", p180);
  fs.writeFileSync("public/icon-192x192.png", p192);
  fs.writeFileSync("public/icon-512x512.png", p512);

  // Write to src/app/ (for Next.js App Router metadata conventions)
  fs.writeFileSync("src/app/favicon.ico", icoBuffer);
  fs.writeFileSync("src/app/icon.png", p192);
  fs.writeFileSync("src/app/apple-icon.png", p180);

  // Web manifest
  const manifest = {
    name: "Lizart Dijital",
    short_name: "Lizart",
    description: "Web Tasarım & Dijital Çözümler",
    start_url: "/",
    display: "standalone",
    background_color: "#15171c",
    theme_color: "#558053",
    icons: [
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
  fs.writeFileSync("public/site.webmanifest", JSON.stringify(manifest, null, 2));

  console.log("All favicons, icons and manifest generated successfully!");
}

main().catch(console.error);
