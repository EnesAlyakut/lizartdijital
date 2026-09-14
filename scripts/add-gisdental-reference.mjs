import fs from 'node:fs';
import path from 'node:path';

const userUploadedDir = 'C:\\Users\\enesa\\.gemini\\antigravity-ide\\brain\\661f67de-36cc-4031-9f27-c9444df51297\\.user_uploaded';
const targetDir = 'public/gorseller/referanslar';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mappings = [
  {
    src: 'media_1788867906570.png',
    destBase: 'gisdental-masaustu',
  },
  {
    src: 'media_1788867906601.png',
    destBase: 'gisdental-mobil',
  },
  {
    src: 'media_1788867906542.png',
    destBase: 'gisdental-tedaviler-masaustu',
  },
  {
    src: 'media_1788867906642.png',
    destBase: 'gisdental-hakkimizda-masaustu',
  },
  {
    src: 'media_1788867906636.png',
    destBase: 'gisdental-tedaviler-mobil',
  },
];

for (const m of mappings) {
  const srcPath = path.join(userUploadedDir, m.src);
  if (fs.existsSync(srcPath)) {
    const data = fs.readFileSync(srcPath);
    // Write both .png, .jpg and .webp copies
    fs.writeFileSync(path.join(targetDir, `${m.destBase}.png`), data);
    fs.writeFileSync(path.join(targetDir, `${m.destBase}.jpg`), data);
    fs.writeFileSync(path.join(targetDir, `${m.destBase}.webp`), data);
    console.log(`Copied ${m.src} -> ${m.destBase}.[png|jpg|webp] (${data.length} bytes)`);
  } else {
    console.error(`Source not found: ${srcPath}`);
  }
}
