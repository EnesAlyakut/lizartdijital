import fs from 'node:fs';
import path from 'node:path';

const userUploadedDir = 'C:\\Users\\enesa\\.gemini\\antigravity-ide\\brain\\661f67de-36cc-4031-9f27-c9444df51297\\.user_uploaded';
const targetDir = 'public/gorseller/referanslar';

const mappings = [
  {
    src: 'media_1788868448631.jpg',
    destBase: 'kuruoglukerestecilik-masaustu',
  },
  {
    src: 'media_1788868448514.png',
    destBase: 'kuruoglukerestecilik-mobil',
  },
  {
    src: 'media_1788868448595.png',
    destBase: 'kuruoglukerestecilik-urunler-masaustu',
  },
  {
    src: 'media_1788868448663.png',
    destBase: 'kuruoglukerestecilik-galeri-masaustu',
  },
  {
    src: 'media_1788868448560.png',
    destBase: 'kuruoglukerestecilik-blog-mobil',
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
