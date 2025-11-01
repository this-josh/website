#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import sharp from 'sharp';

const SRC_DIR = path.resolve('_background_sources');
const OUT_DIR = path.resolve('public/backgrounds');
const MANIFEST = path.resolve('data/hero.manifest.json');
const PY = path.resolve('.venv/bin/python');
const UV = path.resolve(process.env.HOME || '~', '.local/bin/uv');

async function ensureDir(p){ await fsp.mkdir(p, { recursive: true }); }

async function jpgOut(src, out){
  await sharp(src).resize({ width: 3600, withoutEnlargement: true }).jpeg({ quality: 88 }).toFile(out);
}

function runDepth(inp, out){
  return new Promise((resolve, reject) => {
    const p = spawn(UV, ['run', '--python', PY, 'scripts/make-depthmap.py', inp, out], { stdio: 'inherit' });
    p.on('close', (code) => code === 0 ? resolve() : reject(new Error('depth exit '+code)));
  });
}

async function main(){
  if(!fs.existsSync(SRC_DIR)){
    console.error(`No sources at ${SRC_DIR}`);
    process.exit(0);
  }
  await ensureDir(OUT_DIR);
  const files = (await fsp.readdir(SRC_DIR)).filter(f => /\.(jpe?g|png)$/i.test(f));
  const entries = [];
  for(const f of files){
    const stem = f.replace(/\.[^.]+$/, '');
    const src = path.join(SRC_DIR, f);
    const out = path.join(OUT_DIR, stem + '.jpg');
    const depth = path.join(OUT_DIR, stem + '-depth.png');
    await jpgOut(src, out);
    await runDepth(out, depth);
    entries.push({ src: '/backgrounds/'+path.basename(out), depth: '/backgrounds/'+path.basename(depth) });
    console.log('Processed', f);
  }
  await ensureDir(path.dirname(MANIFEST));
  await fsp.writeFile(MANIFEST, JSON.stringify({ entries }, null, 2));
  console.log(`Wrote ${entries.length} hero entries → ${MANIFEST}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

