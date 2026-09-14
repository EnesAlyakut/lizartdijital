import fs from 'node:fs';
import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const logoData = fs.readFileSync('public/logo.svg').toString('base64');
  
  const result = await page.evaluate(async (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // High DPI Canvas (Retina crispness: 828 x 469 * 2 = 1656 x 938)
        const targetWidth = 1656;
        const targetHeight = 938;
        
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const data = imgData.data;
        
        const darkCanvas = document.createElement('canvas');
        darkCanvas.width = targetWidth;
        darkCanvas.height = targetHeight;
        const darkCtx = darkCanvas.getContext('2d');
        const darkData = darkCtx.createImageData(targetWidth, targetHeight);
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          const a = data[i+3];
          
          if (a === 0) {
            darkData.data[i] = 0;
            darkData.data[i+1] = 0;
            darkData.data[i+2] = 0;
            darkData.data[i+3] = 0;
            continue;
          }
          
          // Is it near white background?
          const isWhiteBg = r > 235 && g > 235 && b > 235;
          if (isWhiteBg) {
            darkData.data[i] = 0;
            darkData.data[i+1] = 0;
            darkData.data[i+2] = 0;
            darkData.data[i+3] = 0;
            continue;
          }
          
          // Is it the green logo box?
          const isGreen = g > r + 15 && g > b + 15;
          if (isGreen) {
            // Keep the signature brand green box!
            darkData.data[i] = r;
            darkData.data[i+1] = g;
            darkData.data[i+2] = b;
            darkData.data[i+3] = a;
            continue;
          }
          
          // Is it white text inside green box?
          const isWhiteTextInBox = r > 215 && g > 215 && b > 215;
          if (isWhiteTextInBox) {
            darkData.data[i] = 255;
            darkData.data[i+1] = 255;
            darkData.data[i+2] = 255;
            darkData.data[i+3] = a;
            continue;
          }
          
          // It's the dark text "art" (or antialiased edge of "art")
          const brightness = (r + g + b) / 3;
          if (brightness < 190) {
            // Make text crisp white with alpha preserved from darkness
            const textAlpha = ((255 - brightness) / 255) * (a / 255);
            darkData.data[i] = 255;
            darkData.data[i+1] = 255;
            darkData.data[i+2] = 255;
            darkData.data[i+3] = Math.min(255, Math.round(textAlpha * 1.2 * 255));
          } else {
            darkData.data[i] = r;
            darkData.data[i+1] = g;
            darkData.data[i+2] = b;
            darkData.data[i+3] = a;
          }
        }
        
        darkCtx.putImageData(darkData, 0, 0);
        resolve({
          width: targetWidth,
          height: targetHeight,
          pngDataUrl: darkCanvas.toDataURL('image/png')
        });
      };
      img.src = 'data:image/svg+xml;base64,' + base64;
    });
  }, logoData);
  
  // Save dark PNG and SVG
  const pngBase64 = result.pngDataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('public/logo-dark-mode.png', Buffer.from(pngBase64, 'base64'));
  
  const darkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 828 469"><image width="828" height="469" href="${result.pngDataUrl}"/></svg>`;
  fs.writeFileSync('public/logo-dark-mode.svg', darkSvg);
  
  // Verify with a test screenshot at actual display scale
  await page.setContent(`
    <html>
    <body style="background: #07130d; color: white; font-family: sans-serif; padding: 40px;">
      <h2>Retina Dark Mode Logo Preview:</h2>
      <div style="background: #07130d; border: 1px solid rgba(255,255,255,0.1); padding: 24px; display: inline-flex; align-items: center; gap: 16px; border-radius: 16px;">
        <img src="${result.pngDataUrl}" style="height: 48px; width: auto;" />
        <span style="border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 6px; font-size: 11px; color: #6ee7b7; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Stüdyo</span>
      </div>
    </body>
    </html>
  `);
  
  await page.screenshot({ path: 'test-retina-logo.png' });
  await browser.close();
  console.log('Generated Retina public/logo-dark-mode.svg and public/logo-dark-mode.png!');
}

main().catch(console.error);
