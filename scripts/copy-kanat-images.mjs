import fs from "node:fs";
import path from "node:path";

const srcDir = "C:\\Users\\enesa\\.gemini\\antigravity-ide\\brain\\a428c101-f609-451b-a8f1-6e83698cd9df\\.user_uploaded";
const destDir = "d:\\lizart-new\\public\\gorseller\\referanslar";

const filesToCopy = [
  { src: "media_1788777761204.png", dest: "kanat-musavirlik-masaustu.jpg" },
  { src: "media_1788777761204.png", dest: "kanat-musavirlik-masaustu.png" },
  { src: "media_1788777761165.png", dest: "kanat-musavirlik-mobil.jpg" },
  { src: "media_1788777761165.png", dest: "kanat-musavirlik-mobil.png" },
  { src: "media_1788777761165.png", dest: "kanat-musavirlik-hizmetler-mobil.jpg" },
  { src: "media_1788777761165.png", dest: "kanat-musavirlik-hizmetler-mobil.png" },
  { src: "media_1788777761179.png", dest: "kanat-musavirlik-tablet.jpg" },
  { src: "media_1788777761179.png", dest: "kanat-musavirlik-tablet.png" },
  { src: "media_1788777761179.png", dest: "kanat-musavirlik-hizmetler-masaustu.jpg" },
  { src: "media_1788777761179.png", dest: "kanat-musavirlik-hizmetler-masaustu.png" },
  { src: "media_1788777761189.png", dest: "kanat-musavirlik-hakkimizda-masaustu.jpg" },
  { src: "media_1788777761189.png", dest: "kanat-musavirlik-hakkimizda-masaustu.png" },
  { src: "media_1788777563698.png", dest: "kanat-musavirlik-hakkimizda-mobil.jpg" },
  { src: "media_1788777563698.png", dest: "kanat-musavirlik-hakkimizda-mobil.png" },
];

for (const { src, dest } of filesToCopy) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${src} -> ${dest}`);
}
