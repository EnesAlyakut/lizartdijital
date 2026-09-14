import fs from 'node:fs';
import path from 'node:path';

const userUploadedDir = 'C:\\Users\\enesa\\.gemini\\antigravity-ide\\brain\\661f67de-36cc-4031-9f27-c9444df51297\\.user_uploaded';
const targetDir = 'public/gorseller/referanslar';

const mappings = [
  {
    src: 'media_1788868263902.png',
    destBase: 'kosuyolurezonans-masaustu',
  },
  {
    src: 'media_1788868263954.png',
    destBase: 'kosuyolurezonans-mobil',
  },
  {
    src: 'media_1788868263930.png',
    destBase: 'kosuyolurezonans-tedaviler-masaustu',
  },
  {
    src: 'media_1788868263988.png',
    destBase: 'kosuyolurezonans-tedaviler-mobil',
  },
  {
    src: 'media_1788868264004.png',
    destBase: 'kosuyolurezonans-slide2-mobil',
  },
];

for (const m of mappings) {
  const srcPath = path.join(userUploadedDir, m.src);
  if (fs.existsSync(srcPath)) {
    const data = fs.readFileSync(srcPath);
    fs.writeFileSync(path.join(targetDir, `${m.destBase}.png`), data);
    fs.writeFileSync(path.join(targetDir, `${m.destBase}.jpg`), data);
    fs.writeFileSync(path.join(targetDir, `${m.destBase}.webp`), data);
    console.log(`Copied ${m.src} -> ${m.destBase}.[png|jpg|webp] (${data.length} bytes)`);
  } else {
    console.error(`Source not found: ${srcPath}`);
  }
}
