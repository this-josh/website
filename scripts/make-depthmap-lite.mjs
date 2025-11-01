#!/usr/bin/env node
// Lightweight depth-map approximation using luminance.
// Usage: node scripts/make-depthmap-lite.mjs input.jpg output.png
import sharp from 'sharp';
import fs from 'node:fs/promises';

async function main(inp, out){
  const img = sharp(inp);
  // Convert to grayscale, normalize, and add a gentle S-curve via gamma
  const buf = await img
    .greyscale()
    .normalize()
    .gamma(1.2)
    .toFormat('png')
    .toBuffer();
  await fs.writeFile(out, buf);
  console.log(`Saved approximate depth map → ${out}`);
}

const [,, inp, out] = process.argv;
if(!inp || !out){
  console.error('Usage: node scripts/make-depthmap-lite.mjs input.jpg output.png');
  process.exit(1);
}
main(inp, out).catch((e) => { console.error(e); process.exit(1); });

