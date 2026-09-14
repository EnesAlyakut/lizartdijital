import fs from "node:fs";
import path from "node:path";

const srcDir = "C:\\Users\\enesa\\.gemini\\antigravity-ide\\brain\\a428c101-f609-451b-a8f1-6e83698cd9df\\.user_uploaded";
const destDir = "d:\\lizart-new\\public\\gorseller\\referanslar";

const filesToCopy = [
  // Desktop Hero
  { src: "media_1788778556527.png", dest: "adamotor-masaustu.png" },
  { src: "media_1788778556527.png", dest: "adamotor-masaustu.jpg" },
  // Mobile Hero / Ürünler
  { src: "media_1788778556570.png", dest: "adamotor-mobil.png" },
  { src: "media_1788778556570.png", dest: "adamotor-mobil.jpg" },
  // Desktop Motosikletler
  { src: "media_1788778556606.png", dest: "adamotor-motosiklet-masaustu.png" },
  { src: "media_1788778556606.png", dest: "adamotor-motosiklet-masaustu.jpg" },
  // Desktop Aksesuarlar
  { src: "media_1788778556637.png", dest: "adamotor-aksesuar-masaustu.png" },
  { src: "media_1788778556637.png", dest: "adamotor-aksesuar-masaustu.jpg" },
  // Mobile Aksesuarlar
  { src: "media_1788778556505.png", dest: "adamotor-aksesuar-mobil.png" },
  { src: "media_1788778556505.png", dest: "adamotor-aksesuar-mobil.jpg" },
  // Tablet
  { src: "media_1788778556606.png", dest: "adamotor-tablet.png" },
  { src: "media_1788778556606.png", dest: "adamotor-tablet.jpg" },
];

for (const { src, dest } of filesToCopy) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${src} -> ${dest}`);
}
