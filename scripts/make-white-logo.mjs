import fs from 'node:fs';
import zlib from 'node:zlib';

const buf = fs.readFileSync('public/lizart-logo-original.png');
let pos = 8;
const chunks = [];
let ihdr;
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  const data = buf.subarray(pos + 8, pos + 8 + len);
  const crc = buf.subarray(pos + 8 + len, pos + 12 + len);
  chunks.push({ len, type, data, crc });
  if (type === 'IHDR') ihdr = data;
  pos += 12 + len;
}

const idats = chunks.filter(c => c.type === 'IDAT').map(c => c.data);
const decomp = zlib.inflateSync(Buffer.concat(idats));

// Convert all colored/black pixels to white (255, 255, 255) while preserving alpha
for (let y = 0; y < 1000; y++) {
  const lineOffset = y * 4001;
  for (let x = 0; x < 1000; x++) {
    const px = lineOffset + 1 + x * 4;
    const a = decomp[px + 3];
    if (a > 0) {
      decomp[px] = 255;
      decomp[px + 1] = 255;
      decomp[px + 2] = 255;
    }
  }
}

const newIdatData = zlib.deflateSync(decomp);

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function makeChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);
  
  let crc = 0 ^ (-1);
  for (let i = 0; i < typeAndData.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ typeAndData[i]) & 0xFF];
  }
  crc = (crc ^ (-1)) >>> 0;
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);
  
  return Buffer.concat([lenBuf, typeAndData, crcBuf]);
}

const pngSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const whitePng = Buffer.concat([
  pngSig,
  makeChunk('IHDR', ihdr),
  makeChunk('IDAT', newIdatData),
  makeChunk('IEND', Buffer.alloc(0))
]);

fs.writeFileSync('public/logo-white.png', whitePng);
const b64 = whitePng.toString('base64');
const whiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="84 278 828 469"><image width="1000" height="1000" href="data:image/png;base64,${b64}"/></svg>`;
fs.writeFileSync('public/logo-white.svg', whiteSvg);
console.log('Successfully generated public/logo-white.svg and public/logo-white.png!');
